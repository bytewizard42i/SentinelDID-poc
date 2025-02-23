// script.js
async function mintDid() {
    
    if (!walletAddress) {       // Check if wallet is connected
        alert('Please connect your Midnight Lace wallet first!');
        return;
    }

    const kyc = { 
        name: document.getElementById('name').value, 
        idNumber: document.getElementById('idNumber').value,
        wallet: walletAddress // new 2-23-2025 Include wallet address in the request
    };
    const response = await fetch('http://localhost:3000/mint-nft', {
        method: 'POST', body: JSON.stringify(kyc), headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    document.getElementById('qrCode').src = data.qrUrl;
}

async function checkDid() {
    const didId = document.getElementById('checkDid').value;
    const response = await fetch(`http://localhost:3000/has-did/${didId}`);
    const data = await response.json();
    document.getElementById('result').textContent = data.exists ? 'DID exists!' : 'No such DID.';
}

async function verifyAge() {
    const didId = document.getElementById('checkDid').value;
    const response = await fetch(`http://localhost:3000/verify-age/${didId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    document.getElementById('result').textContent = data.isOver18 ? 'Over 18!' : 'Not over 18.';
}

async function getStats() {
    const countResp = await fetch('http://localhost:3000/did-count');
    const countData = await countResp.json();
    const lastResp = await fetch('http://localhost:3000/last-did');
    const lastData = await lastResp.json();
    document.getElementById('stats').textContent = `Total DIDs: ${countData.totalDids}, Last DID: ${lastData.lastDid}`;
}

let walletAddress = null;       // new 2-23-2025

async function connectLace() {
    console.log('Available wallets:', window.midnight, window.cardano);
    if (window.midnight && window.midnight.lace) {
        try {
            const wallet = await window.midnight.lace.enable();
            const address = await wallet.getAddress(); 
            walletAddress = address;    // new 2-23-2025
            document.getElementById('mintButton').disabled = false; //turns on mint button after wallet is connected new 2-23-2025
            document.getElementById('walletAddress').textContent = `Midnight Wallet: ${address}`;
            console.log('Connected to Midnight Lace at:', address);
        } catch (error) {
            document.getElementById('walletAddress').textContent = 'Wallet Error: Check Console';
            console.error('Midnight Lace connection failed:', error);
        }
    } else if (window.cardano && window.cardano.lace) {
        document.getElementById('walletAddress').textContent = 'Cardano Lace Detected—Use Midnight Lace!';
        console.warn('Found Cardano Lace—switch to Midnight Lace!');   
    } else {
        document.getElementById('walletAddress').textContent = 'Wallet: Midnight Lace Not Detected';
        console.warn('Midnight Lace extension not found—install from releases.midnight.network');
    }       
}