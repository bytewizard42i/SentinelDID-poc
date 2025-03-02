// server.js
const express = require('express');
const { keccak256 } = require('ethers');
const QRCode = require('qrcode');
const { exec } = require('child_process');
const { config } = require('dotenv'); // For environment variables

// Load environment variables from .env file
config();

const app = express();
app.use(express.json());

// In-memory KYC storage (replace with a database like MongoDB or PostgreSQL in production)
let kycStore = [];

// Contract address from environment variable (set this in a .env file)
const contractAddress = process.env.CONTRACT_ADDRESS || '0xYourDeployedAddress';

// Minimum payment in octas (e.g., 0.1 tDUST = 10,000,000 octas)
const MIN_PAYMENT = 10000000;

// Helper function to execute CLI commands with payment
function execWithPayment(command, payment, callback) {
    const fullCommand = `${command} --value ${payment}`;
    exec(fullCommand, callback);
}

// Mint a new DIDnft
app.post('/mint-nft', async (req, res) => {
    const { 
        firstName, lastName, idNumber, driversLicense, dob, ssn, 
        address, phone, backgroundCheck, biometric, nokName, 
        nokRelationship, nokPhone, wallet, uri 
    } = req.body;

    // Validate all required fields
    if (!firstName || !lastName || !idNumber || !driversLicense || !dob || !ssn || 
        !address || !phone || !nokName || !nokRelationship || !nokPhone || !wallet || !uri) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hash the KYC data
    const kycData = { firstName, lastName, idNumber, driversLicense, dob, ssn, address, phone, biometric };
    const kycHash = keccak256(JSON.stringify(kycData));

    // Store KYC data temporarily (move to a secure database in production)
    kycStore.push({ ...kycData, backgroundCheck, nokName, nokRelationship, nokPhone, wallet });

    // Call the contract to mint the DIDnft with payment
    execWithPayment(
        `midnight-cli call ${contractAddress} issueDid ${kycHash} ${uri} --network testnet --from ${wallet}`,
        MIN_PAYMENT,
        (err, stdout) => {
            if (err) {
                console.error('Minting failed:', err);
                return res.status(500).json({ error: 'Minting failed. Check server logs for details.' });
            }

            // Extract didId and tokenId from the output
            const didIdMatch = stdout.match(/didId: (\w+)/);
            const tokenIdMatch = stdout.match(/tokenId: (\d+)/);
            if (!didIdMatch || !tokenIdMatch) {
                return res.status(500).json({ error: 'Failed to extract didId or tokenId from contract response' });
            }

            const didId = didIdMatch[1];
            const tokenId = tokenIdMatch[1];

            // Generate QR code
            QRCode.toDataURL(`http://localhost:3000/did/${didId}`, (err, qrUrl) => {
                if (err) {
                    console.error('QR code generation failed:', err);
                    return res.status(500).json({ error: 'QR code generation failed' });
                }
                res.json({ didId, tokenId, qrUrl });
            });
        }
    );
});

// Retrieve DID information
app.get('/did/:didId', (req, res) => {
    const didId = req.params.didId;
    res.json({ didId, kycHash: 'stored-on-chain' });
});

// Check if a DID exists
app.get('/has-did/:didId', (req, res) => {
    const didId = req.params.didId;
    exec(`midnight-cli call ${contractAddress} verifyDid ${didId} --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Check failed:', err);
            return res.status(500).json({ error: 'Failed to verify DID existence' });
        }
        const exists = stdout.includes('true');
        res.json({ didId, exists });
    });
});

// Verify age based on DID and proof
app.post('/verify-age/:didId', (req, res) => {
    const didId = req.params.didId;
    const { proof } = req.body; // Expect proof to be provided in the request body

    if (!proof) {
        return res.status(400).json({ error: 'Proof is required for age verification' });
    }

    exec(`midnight-cli call ${contractAddress} verifyAge ${didId} ${proof} --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Verification failed:', err);
            return res.status(500).json({ error: 'Age verification failed' });
        }
        const isOver18 = stdout.includes('true');
        res.json({ didId, isOver18 });
    });
});

// Get total DID count
app.get('/did-count', (req, res) => {
    exec(`midnight-cli call ${contractAddress} getDidCount --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Count failed:', err);
            return res.status(500).json({ error: 'Failed to retrieve DID count' });
        }
        const count = parseInt(stdout.match(/(\d+)/)?.[0] || '0');
        res.json({ totalDids: count });
    });
});

// Get the last minted DID
app.get('/last-did', (req, res) => {
    exec(`midnight-cli call ${contractAddress} getLastDid --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Last DID failed:', err);
            return res.status(500).json({ error: 'Failed to retrieve last DID' });
        }
        const lastDid = stdout.match(/didId: (\w+)/)?.[1] || 'None yet';
        res.json({ lastDid });
    });
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));