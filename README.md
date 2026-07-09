# ⚕️ SentinelDID, Decentralized Identity, Saving Lives

> **Privacy-first emergency workforce management powered by zero-knowledge proofs on [Midnight Network](https://docs.midnight.network).**

[![Website](https://img.shields.io/badge/Website-SentinelDID.com-10B981?style=for-the-badge)](https://sentineldid.com)
[![Built on Midnight](https://img.shields.io/badge/Built_on-Midnight_Network-6C3FC5?style=for-the-badge)](https://midnight.network)
[![Live Demo](https://img.shields.io/badge/Demo-YouTube-FF0000?style=for-the-badge)](https://youtube.com/shorts/qHZ2wJPjNK0?si=3JSDjAnZJHk7BqXy)
[![Pitch Video](https://img.shields.io/badge/Pitch-YouTube-FF0000?style=for-the-badge)](https://youtu.be/27p2M7FLx8E?si=hIlEii9oOcJ-mMbl)

**[Miro Whiteboard](https://miro.com/app/board/uXjVIX2ym9A=/?share_link_id=681872678766)** · Part of the **[DIDz ecosystem](https://github.com/bytewizard42i/DIDzMonolith)**

---

## What Is SentinelDID?

SentinelDID is a cutting-edge proof-of-concept for **decentralized identity management in emergency response**. Built on [Midnight Network](https://docs.midnight.network), it showcases privacy-first DID-NFT creation and ZK proof-based verification for managing identities, hierarchies, and victim data in crisis situations.

### The Vision

Easily buildable, highly scalable emergency workforce management that revolutionizes hierarchical delegation, communication, and victim coordination, with effective, secure, and **selectively private** data handling.

### Key Capabilities

- **Real-time chain of command**, Never wonder who is in charge or where an individual is supposed to be. With Starlink and World Mobile integration, no one gets left behind.
- **Instant victim alerts**, When victims are found, those closest are alerted along with the chain of command. Gone are the days of searching for someone who's already been found.
- **LegacyKey switch**, Groundbreaking inactivity detection alerts superiors and team if someone is unresponsive or loses contact. *(Powered by [LegacyKey](https://github.com/bytewizard42i/DownMan) protocol.)*
- **Dynamic hierarchy**, When better qualified leaders arrive on scene, the AI-assisted protocol passes the baton and automatically updates the entire workforce's hierarchy schema.
- **Approval-gated AI**, All delegations, workloads, and AI assistance must be approved and may be modified in real time for fast, effective leadership.
- **Instant volunteer onboarding**, Volunteers can quickly join the workforce with just their KYC and a smart phone.
- **Full situational awareness**, Rescuers always know who they report to, where those individuals are, and what they themselves are tasked with.
- **Privacy-preserving victim management**, Superiors, subordinates, victims, and their families, all protected, all in contact, in real time. Victim identity is preserved whether alive or otherwise.
- **AI-assisted first aid**, Dedicated medical AI model with Bluetooth proprietary devices that communicate with the system in real time for victim vitals tracking as part of the [SafeHealthData](https://github.com/bytewizard42i/safeHealthData_me) protocol.
- **Biometric identity verification**, KYC hashing with biometric variation enables reproducible, provable identity management in real time. Workers are verified beyond doubt before being placed in charge of life-and-death tasks.

**The future is now for emergency response. Crisis management will never be the same.** 

---
![SentinelDID Hero](images/SentinelDID-hero.png)




# SentinelDID PoC

**This is the main repo for the DID Hackathon for Midnight for the SentinelDID Proof of Concept (PoC).**

![SentinelDID Cover Page](images/SentinelDID-cover.png)

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

## **🚀 Starting the Application**

To launch the SentinelDID form and backend services, execute this command from the root directory (`/SentinelDID-poc`):

yarn turbo run start

Install the Midnight protocol on your local machine and spin up the testnet proof server. https://docs.midnight.network/develop/tutorial/

## **🚀 What Happens When You Start?**

Fire up the engines with `yarn turbo run start`,here’s the magic it unleashes:

- **🔧 Backend API**:  
  Ignites `server.js` in `sentineldid-api-folder`,powers DID minting and zero-knowledge proof (ZKP) verification like a pro!

- **🎨 Frontend UI**:  
  Serves `index.html` from `sentineldid-ui-folder`,your sleek portal to decentralized identity management.

- **🔗 Seamless Connection**:  
  Links the frontend and backend for a flawless, smooth-as-silk experience.

---

## **🌐 Accessing the App**

- **Auto-Launch**:  
  Once the server’s humming, your default browser should pop open the app,ready to roll!

- **Manual Navigation**:  
  No auto-open? No sweat,point your browser to:  
  **`http://localhost:3001`**  
  *(Tweak the port if you've customized it,3001 is the default!)*

---

## **🛑 Stopping the Program**

Need to dock the ship? Easy peasy!

- **In the Terminal**:  
  Hit **`CTRL + C`** where the app’s running,shuts it down faster than a blink.

### **Restarting**
- Ready to sail again? Just rerun:  
  ```bash
  yarn turbo run start
  ```

  📌 Additional Notes


# 🌟 Hashing Schema for Immutable KYC Data 🌟

In the **SentinelDID system**, ensuring the **uniqueness and integrity** of Decentralized Identifiers (**DIDs**) is critical. To prevent individuals from creating multiple DIDs using the same **immutable Know Your Customer (KYC) information**, we’ve implemented a robust **hashing schema**.  

This schema leverages **cryptographic hashing** to securely and efficiently detect duplicate or fraudulent attempts while preserving **user privacy**.

---

## 🔐 Purpose of the Hashing Schema

The hashing schema is designed to:  

- **Prevent duplicate DIDs** by ensuring that each unique combination of **immutable KYC data** (e.g., **full name, DOB, Social Security Number**) corresponds to **only one DID**.  
- **Detect altered or fraudulent data** by flagging inconsistencies in **immutable fields**, such as slight modifications to **SSNs or driver’s license numbers**.

---

## 🛠️ How the Hashing Schema Works

### **1️⃣ Selection of Immutable Fields**
We use fields that are **unique to an individual and rarely change**:
- **Full Name** (first name + last name)
- **Driver’s License Number (DL#)**
- **Social Security Number (SSN)**
- **Date of Birth (DOB)**

### **2️⃣ Normalization of Data**
To ensure consistency and prevent variations (**e.g., extra spaces or capitalization**) from affecting the hash:
- **Full Name** → Converted to **lowercase** and **stripped of spaces or special characters**  
  _(e.g., "John Doe" → "johndoe")_
- **DL#, DOB, and SSN** → **Spaces, dashes, and separators removed**  
  _(e.g., "DL123 456" → "dl123456", "123-45-6789" → "123456789")_

### **3️⃣ Concatenation and Hashing**
- The **normalized fields** are combined into a **single string**  
  _(e.g., "johndoedl123456123456789")_
- The string is **hashed using the Keccak-256 algorithm**, a secure, **one-way cryptographic function** commonly used in **blockchain systems**.
- This produces a **unique hash value** tied to the **immutable KYC data**.

### **4️⃣ Duplicate Check**
Before creating a new **DID**, the system **checks if the computed hash already exists** in storage.  

- **If the hash exists** → The request is **rejected**, indicating a **duplicate DID attempt**.  
- **If the hash does not exist** → The **DID creation proceeds**, and the new hash is **stored for future checks**.

---

## 🔍 Benefits of the Hashing Schema
✅ **Enhanced Security**  
- By using a **one-way hash**, the original **KYC data is never stored or exposed**, ensuring **user privacy** and **compliance with data protection standards**.

✅ **Duplicate Prevention**  
- The schema guarantees that **only one DID** can be created per **unique set of immutable KYC data**, preventing abuse of the system.

✅ **Fraud Detection**  
- Any **alteration** to the **immutable fields** (e.g., a modified SSN) results in a **different hash**, flagging the attempt for **further review**.

---

## 💻 Implementation Details
🔹 **Hashing Algorithm**  
- We use **Keccak-256**, a widely adopted **cryptographic hash function** in blockchain ecosystems, ensuring both **security and performance**.

🔹 **Storage**  
- For the **proof of concept**, hashes are stored in an **in-memory array (`kycStore`)**.  
- In a **production environment**, this will be replaced with a **secure, persistent database** or **blockchain-based storage solution**.

🔹 **Normalization**  
- Ensures that **minor formatting differences** (e.g., extra spaces or capitalization) **do not bypass the duplicate check**.

---

## 🚀 Conclusion
The **hashing schema** is a **cornerstone** of the **SentinelDID system’s integrity**.  

By securely **hashing immutable KYC data**, we:  
✔️ **Prevent duplicate DIDs**  
✔️ **Detect fraudulent attempts**  
✔️ **Protect user privacy**  

All while maintaining a **simple and efficient process**.  

This approach ensures that **each DID is uniquely tied to an individual’s identity**, fostering **trust** and **reliability** in **decentralized emergency management**.  

---

## Three-pillar connection

SentinelDID is a **consumer product** built on the DIDz three-pillar model:

- **DIDz (root identity):** Emergency responders hold a DIDz; SentinelDID verifies their credentials without revealing identity.
- **AgenticDID (agent authority):** Response agents can be delegated authority to verify identities in the field.
- **RWAz (object identity):** Not directly used.

SentinelDID uses `sentineldid.compact` (4 circuits).

---

## DIDz Ecosystem

This project is part of the DIDz ecosystem, a suite of privacy-preserving
identity, credential, and application tools built on Midnight Network.

![DIDz Ecosystem Map](docs/DIDz-ecosystem-map.png)

See the full ecosystem map above, or visit [didz.io](https://didz.io) for details.
