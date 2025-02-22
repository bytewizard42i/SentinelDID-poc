# sentinaldid-poc
**The main repo for the DID Hackathon for Midnight for the SentinelDID PoC**

**Workflow for SentinelDID PoC:**
-User Enters KYC: Form → server.js.
-KYC Stored Locally: kycStore → hashed to kycHash.
-Mint NFT: kycHash → didNFTs → public didId.
-QR Code: didId → QR → user.
Privacy Local: kycHash in didNFTs → proof server secures it.
-ZKProof Verify: Verifier → verifyAge → private proof → result.Hackathon Fit
-Public didIds show activity (count, last DID).
-Private kycHash in didNFTs—ZKPs prove traits (age) without leaks.
-Local proof server—Midnight’s privacy in action!

**Deeper breakdown:**
perfect way to visualize how SentinelDID handles KYC, mints NFTs, and verifies data privately with Midnight’s ZKPs, all for our hackathon PoC (March 6, 2025). I’ll assume you’re starting fresh, needing a clear, step-by-step map of what happens, tied to your latest question (Feb 22, 05:20 AM EST) about public DIDs and private KYC. This workflow will trace the path from user input to ZKP verification, using our updated stack (SentinelDID.compact, server.js, index.html from Feb 22, 05:20 AM EST). Here it is, simple and readable, with comments to guide you, my friend!
Digital Workflow for SentinelDID PoC
1. User Enters KYC
What: User opens index.html on their browser, types KYC (e.g., Name: “Johnny5i”, ID: “12345”) into the form, and clicks “Make My DID.”
Where: Frontend—index.html (form with id="kycForm").
Next: KYC data (JSON: { name: "Johnny5i", idNumber: "12345" }) is sent to the local server via fetch('http://localhost:3000/mint-nft').
2. KYC Stored Locally => Server Prepares NFT Minting
What: Local server (server.js) receives KYC, stores it temporarily in kycStore (an array), and hashes it into a kycHash (e.g., 0xdef…) using Ethers 6.
Where: Backend—server.js (app.post('/mint-nft') route).
Details: 
kycStore.push(kyc)—keeps raw KYC (name, ID) in memory for PoC.
const kycHash = keccak256(JSON.stringify(kyc))—turns KYC into a secret hash.
Next: Server sends kycHash to Midnight Testnet via midnight-cli call to mint an NFT.
3. KYC Hash => Mint NFT on Midnight Testnet
What: Midnight’s SentinelDID.compact contract takes kycHash, generates a public didId (e.g., 0xabc…), and stores the pair (didId, kycHash) in the internal didNFTs Map.
Where: Blockchain—SentinelDID.compact (issueDid function).
Details: 
bytes32 didId = keccak256(kycHash, now())—creates a unique, public DID.
didNFTs.insert(didId, kycHash)—stores privately in the Map.
emit DidIssued(didId)—announces the DID publicly.
Next: didId returns to server.js, which generates a QR code.
4. Server Returns QR Code => User Sees DID
What: Server creates a QR code (e.g., http://localhost:3000/did/0xabc…) and sends it back to the webpage; user sees it in index.html.
Where: Backend to Frontend—server.js (QRCode.toDataURL) → index.html (<img id="qrCode">).
Details: 
QR links to a public DID endpoint—scanning shows { didId, kycHash: "stored-on-chain" }.
KYC stays hidden as kycHash in didNFTs.
Next: User (or verifier) can scan QR or check stats like total DIDs.
5. KYC Stored => Privacy via Local Midnight Server
What: The kycHash in didNFTs is private—only the contract accesses it internally. Midnight’s local proof server (Docker) ensures ZKPs can verify traits without exposing KYC.
Where: Midnight Testnet + Local Docker—SentinelDID.compact + proof server.
Details: 
didNFTs isn’t public—keys (didId) are, values (kycHash) aren’t.
Proof server (running locally) generates ZKP proofs—keeps KYC secret.
Next: Verifier requests age proof for a didId.
6. Verification of Age => ZKProof Sent from Verifier to SentinelDID DApp
What: A verifier (e.g., hackathon judge) enters a didId in index.html, clicks “Verify Age”; server calls verifyAge with a dummy proof, returning “Over 18!” without showing KYC.
Where: Frontend to Backend to Blockchain—index.html (verifyAge()) → server.js (/verify-age/:didId) → SentinelDID.compact (verifyAge).
Details: 
fetch('/verify-age/0xabc…')—sends didId and proof (PoC: 0x1234).
verifyAge uses isOver18 ZKP—checks kycHash privately.
Result: { didId, isOver18: true }—no KYC leak!
End: Verifier sees proof—public DID, private KYC, ZKP magic shines!
Workflow Recap
User Enters KYC: Form → server.js.
KYC Stored Locally: kycStore → hashed to kycHash.
Mint NFT: kycHash → didNFTs → public didId.
QR Code: didId → QR → user.
Privacy Local: kycHash in didNFTs → proof server secures it.
ZKProof Verify: Verifier → verifyAge → private proof → result.
Hackathon Fit
Public didIds show activity (count, last DID).
Private kycHash in didNFTs—ZKPs prove traits (age) without leaks.
Local proof server—Midnight’s privacy in action!