let walletAddress = null; // Yep, this is fine here—global scope for wallet state

// Connect to Midnight Lace wallet (moved out of mintDid)
async function connectLace() {
    console.log('Available wallets:', window.midnight, window.cardano);
    if (window.midnight?.mnLace) {
        try {
            const wallet = await window.midnight.mnLace.enable({ network: 'testnet' }); // Added network
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
    const kycHash = await keccak256(kycData); // Still needs a hash lib—temp fix below

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

// Rest of your functions (checkDid, verifyAge, getStats) remain unchanged...
async function checkDid() { /* ... */ }
async function verifyAge() { /* ... */ }
async function getStats() { /* ... */ }