// script.js
let walletAddress = null;

async function connectLace() {
    console.log('Available wallets:', window.midnight, window.cardano);
    if (window.midnight && window.midnight.lace) {
        try {
            const wallet = await window.midnight.lace.enable();
            const address = await wallet.getAddress(); 
            walletAddress = address;
            document.getElementById('mintButton').disabled = false;
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

async function mintDid() {
    if (!walletAddress) {
        alert('Please connect your Midnight Lace wallet first!');
        return;
    }

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const idNumber = document.getElementById('idNumber').value;
    const driversLicense = document.getElementById('driversLicense').value;
    const dob = document.getElementById('dob').value;
    const ssn = document.getElementById('ssn').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const backgroundCheck = document.getElementById('backgroundCheck').checked;
    const biometric = document.getElementById('biometric').value;
    const nokName = document.getElementById('nokName').value;
    const nokRelationship = document.getElementById('nokRelationship').value;
    const nokPhone = document.getElementById('nokPhone').value;

    if (!firstName || !lastName || !idNumber || !driversLicense || !dob || !ssn || !address || !phone || !nokName || !nokRelationship || !nokPhone) {
        alert('Please fill in all required fields.');
        return;
    }

    const kyc = {
        firstName,
        lastName,
        idNumber,
        driversLicense,
        dob,
        ssn,
        address,
        phone,
        backgroundCheck,
        biometric,
        nokName,
        nokRelationship,
        nokPhone,
        wallet: walletAddress
    };

    const response = await fetch('http://localhost:3000/mint-nft', {
        method: 'POST',
        body: JSON.stringify(kyc),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (data.qrUrl) {
        document.getElementById('qrCode').src = data.qrUrl;
        document.getElementById('qrCode').style.display = 'block';
    } else {
        alert('Failed to mint DID.');
    }
}

async function checkDid() {
    const didId = document.getElementById('checkDid').value;
    if (!didId) {
        alert('Please enter a DID to check.');
        return;
    }
    const response = await fetch(`http://localhost:3000/has-did/${didId}`);
    const data = await response.json();
    document.getElementById('result').textContent = data.exists ? 'DID exists!' : 'No such DID.';
}

async function verifyAge() {
    const didId = document.getElementById('checkDid').value;
    if (!didId) {
        alert('Please enter a DID to verify age.');
        return;
    }
    const response = await fetch(`http://localhost:3000/verify-age/${didId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
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