/**
 * SentinelDID API Server
 * 
 * This Express.js server handles the backend operations for the SentinelDID system:
 * 1. Receives KYC data from the frontend form
 * 2. Hashes the KYC data using Keccak256 for privacy
 * 3. Interacts with the Midnight Testnet smart contract to mint DID NFTs
 * 4. Generates QR codes for DID verification
 * 5. Provides endpoints for DID verification and management
 * 
 * Flow:
 * Frontend Form → API Server → Hash KYC → Mint NFT → Generate QR → Return to Frontend
 */

// Import required dependencies
const express = require('express');           // Web framework for Node.js
const { keccak256 } = require('ethers');      // Ethereum utilities for hashing
const QRCode = require('qrcode');             // QR code generation library
const { exec } = require('child_process');    // Execute CLI commands (midnight-cli)
const { config } = require('dotenv');         // Environment variable management

// Load environment variables from .env file (CONTRACT_ADDRESS, etc.)
config();

const app = express();

// Enable CORS for frontend communication
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

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

/**
 * POST /mint-nft - Main endpoint for minting a new DID NFT
 * 
 * Process Flow:
 * 1. Extract KYC data from request body
 * 2. Validate all required fields are present
 * 3. Create a hash of immutable KYC data (privacy protection)
 * 4. Store KYC data temporarily in memory
 * 5. Call Midnight smart contract to mint NFT with payment
 * 6. Generate QR code for the new DID
 * 7. Return DID ID, token ID, and QR code to frontend
 */
app.post('/mint-nft', async (req, res) => {
    // Extract all KYC fields from the request body
    const { 
        firstName, lastName, idNumber, driversLicense, dob, ssn,     // Personal info
        address, phone, backgroundCheck, biometric,                   // Contact & verification
        nokName, nokRelationship, nokPhone,                          // Next of kin info
        wallet, uri                                                   // Wallet & metadata URI
    } = req.body;

    // Validate that all required fields are present
    // This prevents incomplete DID creation and ensures data integrity
    if (!firstName || !lastName || !idNumber || !driversLicense || !dob || !ssn || 
        !address || !phone || !nokName || !nokRelationship || !nokPhone || !wallet || !uri) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create KYC data object with immutable fields only
    // These fields are used for the hash that becomes the DID identifier
    const kycData = { firstName, lastName, idNumber, driversLicense, dob, ssn, address, phone, biometric };
    
    // Generate Keccak256 hash of KYC data
    // This hash serves as the unique DID identifier and ensures privacy
    // The same person cannot create multiple DIDs with identical immutable data
    const kycHash = keccak256(JSON.stringify(kycData));

    // Store complete KYC data temporarily in memory
    // TODO: Replace with secure database storage in production
    kycStore.push({ ...kycData, backgroundCheck, nokName, nokRelationship, nokPhone, wallet });

        // Call the Midnight smart contract to mint the DID NFT with payment
    console.log(`🚀 Attempting to mint DID NFT for wallet: ${wallet}`);
    console.log(`💰 Payment amount: ${MIN_PAYMENT} octas (0.1 tDUST)`);
    console.log(`🔐 KYC Hash: ${kycHash}`);
    console.log(`🔗 Metadata URI: ${uri}`);
    
    execWithPayment(
        `midnight-cli call ${contractAddress} issueDid ${kycHash} ${uri} --network testnet --from ${wallet}`,
        MIN_PAYMENT,
        (err, stdout, stderr) => {
            if (err) {
                // Log detailed error information
                console.error('❌ Minting failed with error:', err.message);
                console.error('❌ Error code:', err.code);
                console.error('❌ stderr:', stderr);
                console.error('❌ stdout:', stdout);
                
                // Return user-friendly error message
                return res.status(500).json({ 
                    error: 'Minting failed. Please check your wallet connection and try again.',
                    details: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
            }

            console.log('✅ Contract call successful. Output:', stdout);
            
            // Extract didId and tokenId from the contract output
            // These regex patterns may need adjustment based on actual midnight-cli output format
            const didIdMatch = stdout.match(/didId: ([a-fA-F0-9x]+)/) || stdout.match(/DID: ([a-fA-F0-9x]+)/);
            const tokenIdMatch = stdout.match(/tokenId: (\d+)/) || stdout.match(/Token: (\d+)/);
            
            if (!didIdMatch || !tokenIdMatch) {
                console.error('❌ Failed to parse contract response:', stdout);
                return res.status(500).json({ 
                    error: 'Failed to extract DID information from contract response',
                    rawOutput: process.env.NODE_ENV === 'development' ? stdout : undefined
                });
            }

            const didId = didIdMatch[1];
            const tokenId = tokenIdMatch[1];
            
            console.log(`✅ DID minted successfully! ID: ${didId}, Token: ${tokenId}`);

            // Generate QR code for the DID
            const qrCodeData = `https://sentineldid.com/verify/${didId}`;
            console.log(`📱 Generating QR code for: ${qrCodeData}`);
            
            QRCode.toDataURL(qrCodeData, { width: 256, margin: 2 }, (err, qrUrl) => {
                if (err) {
                    console.error('❌ QR code generation failed:', err.message);
                    // Still return success but without QR code
                    return res.json({ 
                        didId, 
                        tokenId, 
                        qrUrl: null,
                        warning: 'DID minted successfully but QR code generation failed'
                    });
                }
                
                console.log('✅ QR code generated successfully');
                
                // Return complete success response
                res.json({ 
                    didId, 
                    tokenId, 
                    qrUrl,
                    message: 'DID NFT minted successfully!'
                });
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

// Start the server on port 3001 to avoid conflict with UI
app.listen(3001, () => {
    console.log('🚀 SentinelDID API Server running on http://localhost:3001');
    console.log('📋 Available endpoints:');
    console.log('  POST /mint-nft - Mint a new DID NFT');
    console.log('  GET  /did/:didId - Get DID information');
    console.log('  GET  /has-did/:didId - Check if DID exists');
    console.log('  POST /verify-age/:didId - Verify age with ZK proof');
    console.log('  GET  /did-count - Get total DID count');
    console.log('  GET  /last-did - Get last minted DID');
});