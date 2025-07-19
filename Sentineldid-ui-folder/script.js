/**
 * SentinelDID Frontend JavaScript
 * 
 * This file handles all frontend interactions for the SentinelDID system:
 * 1. Midnight Lace wallet connection and management
 * 2. KYC form data collection and validation
 * 3. API communication with the backend server
 * 4. DID minting, verification, and management
 * 5. QR code display and user feedback
 * 
 * Flow:
 * Connect Wallet → Fill KYC Form → Submit to API → Display Results
 */

// Global variables
let walletAddress = null;                    // Connected wallet address
const API_BASE_URL = 'http://localhost:3001'; // Backend API URL (updated port)

/**
 * Utility function to log messages to the server log display
 * @param {string} message - Message to log with timestamp
 */
function logMessage(message) {
    const log = document.getElementById('serverLog');
    if (log) {
        log.textContent += `[${new Date().toLocaleTimeString()}] ${message}\n`;
        log.scrollTop = log.scrollHeight;
    }
    console.log(`[SentinelDID] ${message}`);
}

/**
 * Connect to Midnight Lace wallet
 * This function handles wallet detection, connection, and address retrieval
 */
async function connectLace() {
    logMessage('🔗 Attempting to connect to Midnight Lace wallet...');
    console.log('Checking window.midnight:', window.midnight);
    
    // Check if Midnight Lace extension is available
    if (window.midnight?.mnLace) {
        console.log('✅ mnLace detected:', window.midnight.mnLace);
        try {
            // Enable wallet connection for testnet
            const wallet = await window.midnight.mnLace.enable({ network: 'testnet' });
            console.log('Wallet object:', wallet);
            
            // Get wallet state to retrieve address
            const state = await wallet.state();
            console.log('Wallet state:', state);
            
            // Extract wallet address with fallbacks
            walletAddress = state.address || state.walletAddress || 'Unknown Address';
            
            // Update UI elements
            const mintButton = document.getElementById('mintButton');
            if (mintButton) mintButton.disabled = false;
            
            document.getElementById('walletAddress').textContent = `Midnight Wallet: ${walletAddress}`;
            logMessage(`✅ Successfully connected to wallet: ${walletAddress}`);
            
        } catch (error) {
            // Handle connection errors
            document.getElementById('walletAddress').textContent = 'Wallet Connection Failed: ' + error.message;
            logMessage('❌ Wallet connection failed: ' + error.message);
            console.error('Connection error:', error);
        }
    } else {
        // Lace extension not found
        document.getElementById('walletAddress').textContent = 'Wallet: Midnight Lace Not Detected';
        logMessage('❌ Midnight Lace extension not found—install from releases.midnight.network');
    }
}

/**
 * Copy wallet address to clipboard
 * Utility function for user convenience
 */
function copyAddress() {
    if (!walletAddress || walletAddress === 'Unknown Address') {
        alert('No wallet address to copy. Please connect your wallet first.');
        return;
    }
    
    const addressElement = document.getElementById('walletAddress');
    const addressText = addressElement.textContent.replace('Midnight Wallet: ', '');
    
    navigator.clipboard.writeText(addressText).then(() => {
        alert('✅ Address copied to clipboard!');
        logMessage('📋 Wallet address copied to clipboard');
    }).catch(() => {
        alert('❌ Failed to copy address');
        logMessage('❌ Failed to copy wallet address');
    });
}

/**
 * Collect and validate KYC form data
 * @returns {Object|null} KYC data object or null if validation fails
 */
function collectKYCData() {
    // Extract all form field values
    const formData = {
        firstName: document.getElementById('firstName')?.value?.trim(),
        lastName: document.getElementById('lastName')?.value?.trim(),
        idNumber: document.getElementById('idNumber')?.value?.trim(),
        driversLicense: document.getElementById('driversLicense')?.value?.trim(),
        dob: document.getElementById('dob')?.value?.trim(),
        ssn: document.getElementById('ssn')?.value?.trim(),
        address: document.getElementById('address')?.value?.trim(),
        phone: document.getElementById('phone')?.value?.trim(),
        backgroundCheck: document.getElementById('backgroundCheck')?.value?.trim(),
        biometric: document.getElementById('biometric')?.value?.trim(),
        nokName: document.getElementById('nokName')?.value?.trim(),
        nokRelationship: document.getElementById('nokRelationship')?.value?.trim(),
        nokPhone: document.getElementById('nokPhone')?.value?.trim(),
        wallet: walletAddress,
        uri: `https://sentineldid.com/metadata/${Date.now()}` // Generate unique URI
    };
    
    // Validate required fields
    const requiredFields = [
        'firstName', 'lastName', 'idNumber', 'driversLicense', 'dob', 'ssn',
        'address', 'phone', 'nokName', 'nokRelationship', 'nokPhone'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
        alert(`❌ Please fill in the following required fields: ${missingFields.join(', ')}`);
        logMessage(`❌ Validation failed - missing fields: ${missingFields.join(', ')}`);
        return null;
    }
    
    if (!walletAddress) {
        alert('❌ Please connect your wallet first!');
        return null;
    }
    
    return formData;
}

/**
 * Main function to mint a new DID NFT
 * This function handles the complete minting process
 */
async function mintDid() {
    logMessage('🚀 Starting DID minting process...');
    
    // Collect and validate form data
    const kycData = collectKYCData();
    if (!kycData) return;
    
    try {
        // Show loading state
        const mintButton = document.getElementById('mintButton');
        if (mintButton) {
            mintButton.disabled = true;
            mintButton.textContent = 'Minting DID...';
        }
        
        logMessage('📤 Sending KYC data to backend API...');
        
        // Send POST request to backend API
        const response = await fetch(`${API_BASE_URL}/mint-nft`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(kycData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.didId) {
            // Success - display results
            logMessage(`✅ DID minted successfully! ID: ${result.didId}`);
            logMessage(`🎫 Token ID: ${result.tokenId}`);
            
            // Display QR code if available
            if (result.qrUrl) {
                const qrCodeImg = document.getElementById('qrCode');
                if (qrCodeImg) {
                    qrCodeImg.src = result.qrUrl;
                    qrCodeImg.style.display = 'block';
                }
                logMessage('📱 QR code generated and displayed');
            }
            
            // Show success message
            alert(`✅ DID minted successfully!\n\nDID ID: ${result.didId}\nToken ID: ${result.tokenId}`);
            
        } else {
            // Error handling
            const errorMsg = result.error || 'Unknown error occurred';
            logMessage(`❌ Minting failed: ${errorMsg}`);
            alert(`❌ Failed to mint DID: ${errorMsg}`);
        }
        
    } catch (error) {
        // Network or other errors
        logMessage(`❌ Error during minting: ${error.message}`);
        alert(`❌ Error minting DID: ${error.message}`);
        console.error('Minting error:', error);
        
    } finally {
        // Reset button state
        const mintButton = document.getElementById('mintButton');
        if (mintButton) {
            mintButton.disabled = false;
            mintButton.textContent = 'Mint DID';
        }
    }
}

/**
 * Check if a DID exists on the blockchain
 */
async function checkDid() {
    const didId = document.getElementById('checkDid')?.value?.trim();
    
    if (!didId) {
        alert('❌ Please enter a DID to check.');
        return;
    }
    
    logMessage(`🔍 Checking DID existence: ${didId}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/has-did/${didId}`);
        const data = await response.json();
        
        const resultText = data.exists ? '✅ DID exists!' : '❌ No such DID.';
        const resultElement = document.getElementById('callResult');
        if (resultElement) {
            resultElement.textContent = resultText;
        }
        
        logMessage(`🔍 DID check result: ${didId} - ${data.exists ? 'Found' : 'Not found'}`);
        
    } catch (error) {
        logMessage(`❌ Error checking DID: ${error.message}`);
        alert(`❌ Error checking DID: ${error.message}`);
    }
}

/**
 * Verify age or identity proof using ZK proofs
 * @param {string} type - Type of verification ('Age' or 'Identity')
 */
async function verifyProof(type) {
    const didId = document.getElementById('checkDid')?.value?.trim();
    
    if (!didId) {
        alert('❌ Please enter a DID to verify.');
        return;
    }
    
    logMessage(`🔐 Starting ${type} verification for DID: ${didId}`);
    
    try {
        // For demo purposes, simulate proof verification
        // In production, this would involve actual ZK proof generation and verification
        
        const resultElement = document.getElementById('verificationResult');
        if (resultElement) {
            resultElement.textContent = '⏳ Generating and verifying proof...';
            resultElement.style.display = 'block';
        }
        
        // Simulate proof generation delay
        setTimeout(async () => {
            try {
                // This would be replaced with actual ZK proof verification
                const proofResult = type === 'Age' ? 'Over 18!' : 'Identity Confirmed!';
                
                if (resultElement) {
                    resultElement.textContent = `✅ Proof Verified = True ${proofResult} 👍`;
                }
                
                logMessage(`✅ ${type} verification successful for DID: ${didId}`);
                
            } catch (error) {
                if (resultElement) {
                    resultElement.textContent = `❌ Verification failed: ${error.message}`;
                }
                logMessage(`❌ ${type} verification failed: ${error.message}`);
            }
        }, 2000);
        
    } catch (error) {
        logMessage(`❌ Error during ${type} verification: ${error.message}`);
        alert(`❌ Error verifying ${type}: ${error.message}`);
    }
}

/**
 * Get system statistics (total DIDs, last minted DID)
 */
async function getStats() {
    logMessage('📊 Fetching system statistics...');
    
    try {
        // Fetch DID count
        const countResp = await fetch(`${API_BASE_URL}/did-count`);
        const countData = await countResp.json();
        
        // Fetch last DID
        const lastResp = await fetch(`${API_BASE_URL}/last-did`);
        const lastData = await lastResp.json();
        
        // Display stats
        const statsText = `📊 Total DIDs: ${countData.totalDids}, Last DID: ${lastData.lastDid}`;
        const statsElement = document.getElementById('stats');
        if (statsElement) {
            statsElement.textContent = statsText;
        }
        
        logMessage('📊 Statistics fetched successfully');
        
    } catch (error) {
        logMessage(`❌ Error fetching stats: ${error.message}`);
        alert(`❌ Error fetching stats: ${error.message}`);
    }
}

/**
 * Exit the DID workflow
 */
function exitDid() {
    logMessage('👋 Exiting SentinelDID workflow...');
    
    const formContainer = document.querySelector('.form-container');
    const headerElement = document.querySelector('h1');
    
    if (formContainer) formContainer.style.display = 'none';
    if (headerElement) headerElement.textContent = 'SentinelDID Workflow Ended';
    
    logMessage('✅ Workflow ended successfully');
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    logMessage('🚀 SentinelDID application initialized');
    logMessage('💡 Connect your Midnight Lace wallet to begin');
    
    // Add form submission handler
    const kycForm = document.getElementById('kycForm');
    if (kycForm) {
        kycForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            mintDid(); // Call our custom mint function
        });
    }
});
