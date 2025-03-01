let walletAddress = null;

// Simulated DID database (unchanged)
const didData = {
    'did:sentineldid:abc123': { name: 'Johnny Bytewizard', age: 30 }
};

// Log function (your cool demo feature—unchanged)
function logMessage(message) {
    const log = document.getElementById('serverLog');
    log.textContent += `[${new Date().toLocaleTimeString()}] ${message}\n`;
    log.scrollTop = log.scrollHeight;
}

// Connect to Midnight Lace wallet (tweaked with debug)
async function connectLace() {
    logMessage('Connecting to wallet...');
    console.log('Checking window.midnight:', window.midnight); // Debug: Verify extension availability
    if (window.midnight?.mnLace) {
        console.log('mnLace detected:', window.midnight.mnLace);
        try {
            const wallet = await window.midnight.mnLace.enable({ network: 'testnet' });
            console.log('Wallet object:', wallet); // Debug: Inspect wallet object
            const state = await wallet.state(); // Get wallet state
            console.log('Wallet state:', state); // Debug: Log state to find address property
            // Extract address; adjust based on state structure
            const walletAddress = state.address || state.walletAddress || 'Unknown Address';
            document.getElementById('mintButton').disabled = false;
            document.getElementById('walletAddress').textContent = `Midnight Wallet: ${walletAddress}`;
            logMessage(`Connected to wallet: ${walletAddress}`);
        } catch (error) {
            document.getElementById('walletAddress').textContent = 'Wallet Connection Failed: ' + error.message;
            logMessage('Wallet connection failed: ' + error.message);
            console.error('Connection error:', error);
        }
    } else {
        document.getElementById('walletAddress').textContent = 'Wallet: Midnight Lace Not Detected';
        logMessage('Midnight Lace extension not found—install from releases.midnight.network');
    }
}

// Mint DID (unchanged)
async function mintDid() {
    if (!walletAddress) {
        alert('Please connect your Midnight Lace wallet first!');
        return;
    }
    logMessage('Minting DID...');
    const kycHash = btoa("kycData"); // Placeholder
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
            logMessage(`DID minted: ${data.didId}`);
        } else {
            alert('Failed to mint DID: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Error minting DID: ' + error.message);
    }
}

// Check DID (unchanged)
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
        document.getElementById('callResult').textContent = data.exists ? 'DID exists!' : 'No such DID.';
        logMessage(`Checked DID: ${didId} - ${data.exists ? 'Found' : 'Not found'}`);
    } catch (error) {
        alert('Error checking DID: ' + error.message);
    }
}

// Verify Proof (unchanged demo flair)
async function verifyProof(type) {
    if (!walletAddress) {
        alert('Please connect your Midnight Lace wallet first!');
        return;
    }
    const didId = document.getElementById('checkDid').value;
    if (!didId) {
        alert('Please enter a DID to verify.');
        return;
    }
    setTimeout(() => {
        const proofResult = type === 'Age' ? 'Over 18!' : 'Identity Confirmed!';
        document.getElementById('verificationResult').textContent = `Proof Verified = True ${proofResult} ✔️👍`;
        document.getElementById('verificationResult').style.display = 'block';
        logMessage(`Verified ${type} for DID: ${didId}`);
    }, 2000);
}

// Get Stats (unchanged)
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
        logMessage('Fetched stats');
    } catch (error) {
        alert('Error fetching stats: ' + error.message);
    }
}

// Exit DID (unchanged demo exit)
function exitDid() {
    logMessage('Exiting workflow...');
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('h1').textContent = 'Workflow Ended';
}