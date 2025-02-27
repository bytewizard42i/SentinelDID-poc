// server.js
const express = require('express');
const { keccak256 } = require('ethers');
const QRCode = require('qrcode');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
let kycStore = []; // you might want to store this in a DB instead, but for a POC it's fine I guess
const contractAddress = '0xYourDeployedAddress'; // ****Replace with actual address****

const server = app.listen(3000, () => console.log(`Server running on ${server.address()}`)); // the {port} be parameterized here

app.post('/mint-nft', async (req, res) => {
    const { firstName, lastName, idNumber, driversLicense, dob, ssn, address, phone, backgroundCheck, biometric, nokName, nokRelationship, nokPhone, wallet } = req.body;
    if (!firstName || !lastName || !idNumber || !driversLicense || !dob || !ssn || !address || !phone || !nokName || !nokRelationship || !nokPhone || !wallet) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const kycData = { firstName, lastName, idNumber, driversLicense, dob, ssn, address, phone, biometric };
    const kycHash = keccak256(JSON.stringify(kycData));
    kycStore.push({ ...kycData, backgroundCheck, nokName, nokRelationship, nokPhone, wallet }); // I thought we're only storing the hash...

    // need to sanitize {wallet} to prevent malicious attacks
    exec(`midnight-cli call ${contractAddress} issueDid ${kycHash} ${wallet} --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Minting failed:', err);
            return res.status(500).json({ error: 'Minting failed' });
        }
        const didIdMatch = stdout.match(/didId: (\w+)/);
        if (!didIdMatch) {
            return res.status(500).json({ error: 'Failed to extract didId' });
        }
        const didId = didIdMatch[1];
        QRCode.toDataURL(`${server.address()}/${didId}`, (err, qrUrl) => {
            if (err) {
                console.error('QR code generation failed:', err);
                return res.status(500).json({ error: 'QR code generation failed' });
            }
            res.json({ qrUrl });
        });
    });
});

app.get('/did/:didId', (req, res) => {
    const didId = req.params.didId;                  // I don't really understand this endpoint,
    res.json({ didId, kycHash: 'stored-on-chain' }); // is it a plan that the hash should be retrieved from the on-chain?
});

app.get('/has-did/:didId', (req, res) => {
    const didId = req.params.didId; // need to sanitize {didId} to prevent malicious attacks
    exec(`midnight-cli call ${contractAddress} hasDid ${didId} --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Check failed:', err);
            return res.status(500).json({ error: 'Check failed' });
        }
        const exists = stdout.includes('true');
        res.json({ didId, exists });
    });
});

app.post('/verify-age/:didId', (req, res) => {
    const didId = req.params.didId; // need to sanitize {didId} to prevent malicious attacks
    const proof = '0x1234'; // Dummy proof for PoC
    exec(`midnight-cli call ${contractAddress} verifyAge ${didId} ${proof} --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Verification failed:', err);
            return res.status(500).json({ error: 'Verification failed' });
        }
        const isOver18 = stdout.includes('true');
        res.json({ didId, isOver18 });
    });
});

app.get('/did-count', (req, res) => {
    exec(`midnight-cli call ${contractAddress} getDidCount --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Count failed:', err);
            return res.status(500).json({ error: 'Count failed' });
        }
        const count = parseInt(stdout.match(/(\d+)/)?.[0] || '0');
        res.json({ totalDids: count });
    });
});

app.get('/last-did', (req, res) => {
    exec(`midnight-cli call ${contractAddress} getLastDid --network testnet`, (err, stdout) => {
        if (err) {
            console.error('Last DID failed:', err);
            return res.status(500).json({ error: 'Last DID failed' });
        }
        const lastDid = stdout.match(/didId: (\w+)/)?.[1] || 'None yet';
        res.json({ lastDid });
    });
});
