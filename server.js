// // server.js
// // Load tools we need - think of these as your plumber’s toolkit
// const express = require('express'); // Makes a server
// const { keccak256 } = require('ethers'); // Hashes KYC
// const QRCode = require('qrcode'); // Makes QR codes
// const { MidnightClient } = require('midnight-sdk'); // Talks to Midnight (fake for now)

// // Set up the server
// const app = express();
// app.use(express.json()); // Lets server read JSON from the form

// // Temp storage for KYC - like a notepad for PoC
// let kycStore = [];

// // Connect to Midnight Testnet - your blockchain hookup
// const client = new MidnightClient({
//     rpcUrl: 'https://testnet2.midnight.network',
//     privateKey: 'YOUR_TESTNET_PRIVATE_KEY' // Get this from midnight-cli keygen
// });
// const contractAddress = '0xYourDeployedAddress'; // After deploying SentinelDID.compact
// const contract = client.contract(/* ABI - fill this after deploy */, contractAddress);

// // When form sends KYC - this catches it
// app.post('/mint-nft', async (req, res) => {
//     // Grab KYC from the form
//     const kyc = req.body; // { name, idNumber }
//     kycStore.push(kyc); // Save it for PoC
//     // Hash KYC - turns it into a secret code
//     const kycHash = keccak256(JSON.stringify(kyc));
//     // Mint NFT on Midnight - like stamping a digital ID
//     const tx = await contract.issueDid(kycHash);
//     const receipt = await tx.wait(); // Wait for Midnight to say “done”
//     const didId = receipt.events[0].args.didId; // Unique ID for the NFT
//     // Make a QR code linking to the NFT
//     const qrUrl = await QRCode.toDataURL(`http://localhost:3000/did/${didId}`);
//     // Send QR back to website
//     res.json({ qrUrl });
// });

// // When QR is scanned - this shows NFT info
// app.get('/did/:didId', async (req, res) => {
//     const didId = req.params.didId; // Grab ID from URL
//     const kycHash = await contract.didNFTs(didId); // Get hash from Midnight
//     res.json({ didId, kycHash }); // Send back - PoC keeps it simple
// });

// // Start server on port 3000 - like turning on a light
// app.listen(3000, () => console.log('Server running on http://localhost:3000'));
// // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// new code:

// server.js
const express = require('express');
const { keccak256 } = require('ethers');
const QRCode = require('qrcode');
const { exec } = require('child_process'); // Runs CLI commands

const app = express();
app.use(express.json());
let kycStore = []; // Temp KYC notepad

const contractAddress = '0xYourDeployedAddress'; // From midnight-cli deploy

// Mint DID - form sends KYC here
app.post('/mint-nft', (req, res) => {
    const kyc = req.body; // { name, idNumber }
    kycStore.push(kyc); // Save for PoC
    const kycHash = keccak256(JSON.stringify(kyc)); // Hash it - secret code
    // Call Midnight CLI - mints NFT, args explicit per docs
    exec(`midnight-cli call ${contractAddress} issueDid ${kycHash} --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Mint failed' });
        const didId = stdout.match(/didId: (\w+)/)?.[1]; // Grab ID from output
        QRCode.toDataURL(`http://localhost:3000/did/${didId}`, (err, qrUrl) => {
            res.json({ qrUrl }); // Send QR to webpage
        });
    });
});

// Show DID info - QR scan hits this
app.get('/did/:didId', (req, res) => {
    const didId = req.params.didId; // ID from URL
    res.json({ didId, kycHash: 'stored-on-chain' }); // Fake for PoC - real fetch later
});

// Check if DID exists - new feature!
app.get('/has-did/:didId', (req, res) => {
    const didId = req.params.didId; // ID from URL
    exec(`midnight-cli call ${contractAddress} hasDid ${didId} --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Check failed' });
        const exists = stdout.includes('true'); // Parse CLI output - rough but works
        res.json({ didId, exists }); // Send back { didId, exists: true/false }
    });
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));