let walletAddress = null;



async function mintDid() {
    if (!walletAddress) {
        alert('Please connect your Midnight Lace wallet first!');
        return;
    }
    async function connectLace() {
        console.log('Available wallets:', window.midnight, window.cardano);
        if (window.midnight?.mnLace) {
            try {
                const wallet = await window.midnight.mnLace.enable();
                const address = await wallet.getAddress();
                walletAddress = address;
                document.getElementById('mintButton').disabled = false;
                document.getElementById('walletAddress').textContent = `Midnight Wallet: ${address}`;
                console.log('Connected to Midnight Lace at:', address);
            } catch (error) {
                document.getElementById('walletAddress').textContent = 'Wallet Connection Failed: ' + error.message;
                console.error('Midnight Lace connection failed:', error);
            }
        } else {
            document.getElementById('walletAddress').textContent = 'Wallet: Midnight Lace Not Detected';
            console.warn('Midnight Lace extension not found—install from releases.midnight.network');
        }
    }
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const idNumber = document.getElementById('idNumber').value;
    const driversLicense = document.getElementById('driversLicense').value;
    const dob = document.getElementById('dob').value;
    const ssn = document.getElementById('ssn').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const biometric = document.getElementById('biometric').value;
    const backgroundCheck = document.getElementById('backgroundCheck').checked;
    const nokName = document.getElementById('nokName').value;
    const nokRelationship = document.getElementById('nokRelationship').value;
    const nokPhone = document.getElementById('nokPhone').value;

    if (!firstName || !lastName || !idNumber || !driversLicense || !dob || !ssn || !address || !phone || !biometric || !nokName || !nokRelationship || !nokPhone) {
        alert('Please fill in all required fields.');
        return;
    }

    const kycData = `${firstName}|${lastName}|${idNumber}|${driversLicense}|${dob}|${ssn}|${address}|${phone}|${biometric}|${nokName}|${nokRelationship}|${nokPhone}`;
    const kycHash = await keccak256(kycData); // Simulated hash; ideally computed server-side

    try {
        const response = await fetch('http://localhost:3000/mint-nft', {
            method: 'POST',
            body: JSON.stringify({ kycHash, wallet: walletAddress }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.qrUrl) {
            document.getElementById('qrCode').src = data.qrUrl;
            document.getElementById('qrCode').style.display = 'block';
        } else {
            alert('Failed to mint DID: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Error minting DID: ' + error.message);
    }
}

async function checkDid() {
    if (!walletAddress) {
        alert('Please connect your Midnight Lace wallet first!');
        return;
    }
    const didId = document.getElementById('checkDid').value;
    if (!didId) {
        alert('Please enter a DID to check.');
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/has-did/${didId}`);
        const data = await response.json();
        document.getElementById('result').textContent = data.exists ? 'DID exists!' : 'No such DID.';
    } catch (error) {
        alert('Error checking DID: ' + error.message);
    }
}

async function verifyAge() {
    if (!walletAddress) {
        alert('Please connect your Midnight Lace wallet first!');
        return;
    }
    const didId = document.getElementById('checkDid').value;
    if (!didId) {
        alert('Please enter a DID to verify age.');
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/verify-age/${didId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        document.getElementById('result').textContent = data.isOver18 ? 'Over 18!' : 'Not over 18.';
    } catch (error) {
        alert('Error verifying age: ' + error.message);
    }
}

async function getStats() {
    if (!walletAddress) {
        alert('Please connect your Midnight Lace wallet first!');
        return;
    }
    try {
        const countResp = await fetch('http://localhost:3000/did-count');
        const countData = await countResp.json();
        const lastResp = await fetch('http://localhost:3000/last-did');
        const lastData = await lastResp.json();
        document.getElementById('stats').textContent = `Total DIDs: ${countData.totalDids}, Last DID: ${lastData.lastDid}`;
    } catch (error) {
        alert('Error fetching stats: ' + error.message);
    }
}