# 🧬 KYCz, Zero-Knowledge KYC with Biometric Liveness

**Future Identity Verification Integration for SentinelDID**

**Date**: February 20, 2026  
**Related**: [KYCz App Repo](https://github.com/bytewizard42i/KYCz_us_app) | [DIDz DApp System](https://github.com/bytewizard42i/didz-dapp-system) | [AgenticDID](https://github.com/bytewizard42i/AgenticDID_io_me_MAIN)

---

## What Is KYCz?

**KYC + zkProofs = KYCz**, Privacy-preserving identity verification powered by the Midnight blockchain.

KYCz takes traditional Know Your Customer (KYC) data, stores it in Midnight's **private state**, and uses **zero-knowledge proofs** to make assertions about that data, **without ever revealing the underlying information**.

Identity is verified through **multi-factor biometric liveness detection**, ensuring a real human is behind every verification, not a deepfake, bot, or synthetic identity.

---

## How KYCz Relates to SentinelDID

SentinelDID provides the DID infrastructure on Midnight. KYCz provides the **human verification layer** that feeds into it:

```
Human → KYCz Biometric Liveness → Midnight Private State → zk-Proof Credentials → SentinelDID Identity
```

---

## 8-Factor Weighted Liveness Score

| Factor | Weight | Technique |
|--------|--------|----------|
| **3D Parallax** | 17% | Depth variation detection, defeats flat screen/photo spoofs |
| **Eye Blink Rate** | 15% | Eye Aspect Ratio (EAR) via 68-point facial landmarks |
| **Face Micro-Movements** | 15% | Involuntary movement signatures, frame-to-frame landmark drift |
| **Face Movement Challenge** | 15% | Random head-turn/nod/blink-on-command prompts |
| **BPM Detection** | 10% | Remote photoplethysmography (rPPG) from skin color changes |
| **Signal Quality** | 10% | rPPG signal reliability monitoring |
| **Prominence** | 10% | Frequency peak strength in cardiac signal |
| **Consistency** | 8% | BPM stability across time windows |

**Behavioral factors** = **62%** of score. Plus voice/speech liveness and document OCR layers.

---

## KYCz vs Other Approaches

| Traditional KYC | BlockSign-style | **KYCz (Ours)** |
|-----------------|-----------------|------------------|
| Centralized DBs | Zero storage / ephemeral | Midnight private state |
| Honeypot for hackers | Can't prove later | zk-proofs for ongoing assertions |
| Full data exposed | Privacy-first but one-shot | Privacy-preserving AND provable |

---

## Zero-Knowledge Proof Assertions

| Assertion | Proves | Hides |
|-----------|--------|-------|
| "Is this person over 18?" | Yes/No | Date of birth |
| "Has this person passed KYC?" | Yes/No | All PII |
| "Is this the same person?" | Yes/No | Biometric data |
| "Is their ID valid?" | Yes/No | Document details |

---

## References

- [KYCz App Repo](https://github.com/bytewizard42i/KYCz_us_app)
- [BlockSign Verify Reference PDF](https://github.com/bytewizard42i/KYCz_us_app/tree/main/docs)
- [DIDz DApp System](https://github.com/bytewizard42i/didz-dapp-system)
- [Midnight Docs](https://docs.midnight.network)

---

**Status**: 🚧 Early concept phase  
**Last Updated**: February 20, 2026  
**Author**: John (bytewizard42i)
