# SentinelDID PoC

**The main repo for the DID Hackathon for Midnight for the SentinelDID Proof of Concept (PoC).**

## Workflow for SentinelDID PoC

- **User Enters KYC:** Form submission in `index.html` → processed by `server.js`.
- **KYC Stored Locally:** Data stored in `kycStore` → hashed into `kycHash`.
- **Mint NFT:** `kycHash` sent to Midnight Testnet → stored in `didNFTs` → public `didId` generated.
- **QR Code Generation:** `didId` linked to a QR code → displayed for user.
- **Privacy Protection:** `kycHash` stored privately in `didNFTs` → Proof server secures it.
- **ZKProof Verification:** Verifier requests proof via `verifyAge` → private proof generated → result validated.

## Recap of SentinelDID PoC Workflow

| Step                     | Description |
|--------------------------|-------------|
| **User Enters KYC**      | Form → `server.js` |
| **KYC Stored Locally**   | `kycStore` → hashed to `kycHash` |
| **Mint NFT**             | `kycHash` → `didNFTs` → public `didId` |
| **QR Code**              | `didId` → QR → user |
| **Privacy Protection**   | `kycHash` remains hidden, proof server ensures security |
| **ZKProof Verification** | Verifier → `verifyAge` → private proof → result |

## Setup & Instructions

**SentinelDID PoC: A privacy-first DID system on Midnight Testnet for Johnny5i’s hackathon (March 6, 2025).**

### Running the Project
```sh
yarn install && yarn turbo run start
```

## Project Structure

- **UI:** `sentineldid-ui`
- **API:** `sentineldid-api`
- **Smart Contract:** `sentineldid-contract`

## Contact & Contributions
For any questions or contributions, feel free to submit issues or pull requests! 🚀

