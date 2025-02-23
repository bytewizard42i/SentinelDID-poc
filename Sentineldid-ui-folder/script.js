// script.js
async function mintDid() {
    const kyc = { name: document.getElementById('name').value, idNumber: document.getElementById('idNumber').value };
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

async function connectLace() {
    if (window.cardano && window.cardano.lace) {
        const wallet = await window.cardano.lace.enable();
        const address = await wallet.getChangeAddress();
        document.getElementById('walletAddress').textContent = `Wallet: ${address}`;
    } else {
        document.getElementById('walletAddress').textContent = 'Wallet: Lace not found!';
    }
}