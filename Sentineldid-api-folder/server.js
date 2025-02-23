 // server.js
const express = require('express'); // Web server tool
const { keccak256 } = require('ethers'); // Hashing tool
const QRCode = require('qrcode'); // QR code tool
const { exec } = require('child_process'); // Runs Midnight CLI

const app = express();
app.use(express.json()); // Reads JSON from form
let kycStore = []; // Temp KYC storage

const contractAddress = '0xYourDeployedAddress'; // From midnight-cli deploy

// Mint DID - processes KYC
app.post('/mint-nft', async (req, res) => {
    const { name, idNumber, wallet } = req.body; // Your logic to mint the DID-NFT using the wallet address New 2-23-2025
    // ...
    const kyc = req.body; // Gets KYC from form
    kycStore.push(kyc); // Stores temporarily
    const kycHash = keccak256(JSON.stringify(kyc)); // Hashes KYC
    exec(`midnight-cli call ${contractAddress} issueDid ${kycHash} --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Minting failed' });
        const didId = stdout.match(/didId: (\w+)/)?.[1]; // Extracts DID
        QRCode.toDataURL(`http://localhost:3000/did/${didId}`, (err, qrUrl) => {
            res.json({ qrUrl }); // Sends QR back
        });
    });
});

// Show DID info - for QR scans
app.get('/did/:didId', (req, res) => {
    const didId = req.params.didId; // Gets DID from URL
    res.json({ didId, kycHash: 'stored-on-chain' }); // Placeholder
});

// Check DID - verifies existence
app.get('/has-did/:didId', (req, res) => {
    const didId = req.params.didId;
    exec(`midnight-cli call ${contractAddress} hasDid ${didId} --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Check failed' });
        const exists = stdout.includes('true'); // Checks output
        res.json({ didId, exists }); // Returns result
    });
});

// Verify Age - ZKP proof
app.post('/verify-age/:didId', (req, res) => {
    const didId = req.params.didId; // Gets DID
    const proof = '0x1234'; // Dummy proof for PoC
    exec(`midnight-cli call ${contractAddress} verifyAge ${didId} ${proof} --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Verification failed' });
        const isOver18 = stdout.includes('true'); // Parses result
        res.json({ didId, isOver18 }); // Sends proof outcome
    });
});

// Total DIDs - stat
app.get('/did-count', (req, res) => {
    exec(`midnight-cli call ${contractAddress} getDidCount --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Count failed' });
        const count = parseInt(stdout.match(/(\d+)/)?.[0] || '0'); // Extracts number
        res.json({ totalDids: count }); // Returns total
    });
});

// Last DID - stat
app.get('/last-did', (req, res) => {
    exec(`midnight-cli call ${contractAddress} getLastDid --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Last DID failed' });
        const lastDid = stdout.match(/didId: (\w+)/)?.[1] || 'None yet'; // Extracts DID
        res.json({ lastDid }); // Returns last DID
    });
});

// Connect Lace Wallet - placeholder for client-side
app.get('/connect-wallet', (req, res) => {
    res.send(`<script>connectLace();</script>`); // Triggers wallet connect
});

app.listen(3000, () => console.log('Server running on http://localhost:3000')); // Starts server