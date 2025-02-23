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


# 🚀 SentinelDID: Decentralized Identity Unleashed

Welcome to **SentinelDID**, a cutting-edge proof-of-concept for decentralized identity management built on Midnight Testnet. This project showcases privacy-first DID creation and verification, powered by a sleek frontend and robust backend. Ready to dive in? Let’s get started!

---

## **🚀 Starting the Application**

To launch the SentinelDID form and backend services, execute this command from the root directory (`/SentinelDID-poc`):

```bash
yarn turbo run start

## **🚀 What Happens When You Start?**

Fire up the engines with `yarn turbo run start`—here’s the magic it unleashes:

- **🔧 Backend API**:  
  Ignites `server.js` in `sentineldid-api-folder`—powers DID minting and zero-knowledge proof (ZKP) verification like a pro!

- **🎨 Frontend UI**:  
  Serves `index.html` from `sentineldid-ui-folder`—your sleek portal to decentralized identity management.

- **🔗 Seamless Connection**:  
  Links the frontend and backend for a flawless, smooth-as-silk experience.

---

## **🌐 Accessing the App**

- **Auto-Launch**:  
  Once the server’s humming, your default browser should pop open the app—ready to roll!

- **Manual Navigation**:  
  No auto-open? No sweat—point your browser to:  
  **`http://localhost:3000`**  
  *(Tweak the port if you’ve customized it—3000’s the default!)*

---

## **🛑 Stopping the Program**

Need to dock the ship? Easy peasy!

- **In the Terminal**:  
  Hit **`CTRL + C`** where the app’s running—shuts it down faster than a blink.

### **Restarting**
- Ready to sail again? Just rerun:  
  ```bash
  yarn turbo run start

  📌 Additional Notes
Setup Checklist
Dependencies:
Run yarn install first—grabs all the goodies (express, ethers, etc.) for a smooth launch!
Port Check:
Hiccups? Ensure ports (e.g., 3000) are free—peek with netstat -tulnp | grep 3000.
Debugging:
Spy on terminal logs—your trusty co-pilot for error hints!
Pro Tip
Watch sentineldid-api-folder/server.js—update contractAddress after deploying to Midnight Testnet for that extra ✨ magic!
🌟 Enjoy SentinelDID!
Dive into decentralized identity with SentinelDID—mint DIDs, link via Lace wallet, and verify with ZKPs. Built with ❤️ for privacy and innovation. Happy hacking, captain! 🚀


