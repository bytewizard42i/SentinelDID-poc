// server.js
const express = require('express');
const { keccak256 } = require('ethers');
const QRCode = require('qrcode');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
let kycStore = [];

const contractAddress = '0xYourDeployedAddress'; // From deploy

app.post('/mint-nft', (req, res) => {
    const kyc = req.body;
    kycStore.push(kyc);
    const kycHash = keccak256(JSON.stringify(kyc));
    exec(`midnight-cli call ${contractAddress} issueDid ${kycHash} --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Mint failed' });
        const didId = stdout.match(/didId: (\w+)/)?.[1];
        QRCode.toDataURL(`http://localhost:3000/did/${didId}`, (err, qrUrl) => {
            res.json({ qrUrl });
        });
    });
});

app.get('/did/:didId', (req, res) => {
    const didId = req.params.didId;
    res.json({ didId, kycHash: 'stored-on-chain' });
});

app.get('/has-did/:didId', (req, res) => {
    const didId = req.params.didId;
    exec(`midnight-cli call ${contractAddress} hasDid ${didId} --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Check failed' });
        const exists = stdout.includes('true');
        res.json({ didId, exists });
    });
});

app.post('/verify-age/:didId', (req, res) => {
    const didId = req.params.didId;
    const proof = '0x1234'; // Dummy proof
    exec(`midnight-cli call ${contractAddress} verifyAge ${didId} ${proof} --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Verification failed' });
        const isOver18 = stdout.includes('true');
        res.json({ didId, isOver18 });
    });
});

app.get('/did-count', (req, res) => {
    exec(`midnight-cli call ${contractAddress} getDidCount --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Count failed' });
        const count = parseInt(stdout.match(/(\d+)/)?.[0] || '0');
        res.json({ totalDids: count });
    });
});

app.get('/last-did', (req, res) => {
    exec(`midnight-cli call ${contractAddress} getLastDid --network testnet`, (err, stdout) => {
        if (err) return res.status(500).json({ error: 'Last DID failed' });
        const lastDid = stdout.match(/didId: (\w+)/)?.[1] || 'None yet';
        res.json({ lastDid });
    });
});

app.listen(3000, () => console.log('API on http://localhost:3000')); // Starts API