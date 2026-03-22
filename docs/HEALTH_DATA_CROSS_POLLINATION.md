# SentinelDID × Health Data — Cross-Pollination Reference

*SentinelDID's emergency protocol has direct applications across the Safe Health Data ecosystem.*

**Date**: March 22, 2026

---

## Overview

SentinelDID was built for emergency workforce management and victim identification. The same patterns — DID-based identity, ZK-verified credentials, emergency disclosure, Downman switch, workforce hierarchy, and satellite connectivity — apply directly to three health data platforms in the DIDz ecosystem:

| Platform | Focus | Key Emergency Integration |
|----------|-------|--------------------------|
| **Safe Health Data** | Human healthcare | First responder → hospital handoff, emergency drug interaction checking, advance directives, HIPAA-compliant emergency disclosure |
| **PetProData** | Companion animals | Disaster animal rescue, emergency vet access, shelter coordination, domestic violence safe surrender |
| **EquineProData** | Equine / RWA | Wildfire evacuation, competition incidents, transport emergencies, multi-stakeholder treatment authorization |

---

## What SentinelDID Provides to Health Data

| SentinelDID Feature | Health Data Application |
|---------------------|------------------------|
| **DID-NFT + QR** | Medical identity wristband (human), collar tag (pet), competition ID (equine) |
| **ZK proof verification** | Verify responder/vet credentials without revealing personal identity |
| **Workforce hierarchy** | Emergency chain-of-command for data access authorization |
| **Downman switch** | Medical dead-man's switch → advance directives, pet safety alerts, foaling watch |
| **AI-assisted delegation** | Triage workflow based on ZK-verified medical data |
| **Volunteer onboarding** | Disaster medical/animal rescue volunteers verified in minutes |
| **Victim management** | Privacy-preserving patient/animal tracking across facilities |
| **Satellite connectivity** | Off-grid emergency health data access (Starlink/World Mobile) |
| **KYCz biometric liveness** | Verify the human requesting emergency health data is real |

---

## What Health Data Provides Back to SentinelDID

| Health Data Feature | SentinelDID Enhancement |
|--------------------|------------------------|
| **Selective health disclosure** | SentinelDID victims can have critical medical info released to responders without full record exposure |
| **Drug interaction checking** | Emergency treatment can be validated against existing medications via ZK proofs |
| **Advance directives** | Downman switch can push DNR/medical POA when triggered |
| **Vaccination verification** | Rescue volunteers' vaccination status verified without revealing medical history |
| **Epic/FHIR integration** | SentinelDID emergency data can flow into hospital clinical workflows via SMART on FHIR / CDS Hooks |
| **TEFCA portability** | Emergency health data follows the victim across any TEFCA-connected facility nationwide |

---

## Detailed Integration Documents

Each health data repo has a dedicated cross-pollination document:

1. **Safe Health Data**: `DIDzMonolith/safeHealthData/docs/SENTINELDID_EMERGENCY_PROTOCOL.md`
   - Emergency triage with selective health disclosure
   - Hospital pre-arrival data push
   - Mass casualty victim privacy preservation
   - Downman switch → medical power of attorney
   - Adverse drug interaction emergency override
   - Schools/camps/assisted living institutional access

2. **PetProData**: `DIDzMonolith/petProData/docs/SENTINELDID_EMERGENCY_PROTOCOL.md`
   - Natural disaster animal rescue coordination
   - Emergency veterinary access by non-owners
   - Shelter/foster coordination during mass intake
   - Domestic violence safe pet surrender
   - Hoarding/cruelty seizure evidence chain
   - Elderly/disabled owner Downman switch for pet safety

3. **EquineProData**: `DIDzMonolith/equineProData/docs/SENTINELDID_EMERGENCY_PROTOCOL.md`
   - Wildfire/disaster evacuation with triage prioritization
   - Competition incident management with drug testing awareness
   - Transport emergency response
   - Colic emergency with pre-arrival surgical data push
   - Barn fire evacuation coordination
   - RWA multi-stakeholder emergency treatment authorization
   - Foaling watch Downman switch

---

## RFID / NFC Identity Bridge — Physical-to-DID Layer

SentinelDID's QR-based identity extends naturally to RFID and NFC hardware — the physical scan layer that bridges the real world to on-chain DIDs.

### Scan → DID Resolution Across All Platforms

| Platform | Primary Scan | Secondary | Tertiary | Hardware |
|----------|-------------|-----------|----------|----------|
| **Safe Health Data** (human) | NFC medical alert bracelet | NFC hospital wristband / phone tap | QR on bracelet | Any NFC smartphone |
| **PetProData** (companion animal) | ISO 11784/11785 RFID microchip | NFC smart collar tag | QR collar tag | Universal ISO scanner or NFC phone |
| **EquineProData** (equine) | ISO 11784/11785 RFID + UELN | NFC smart halter tag | QR halter plate / freeze brand OCR | Professional ISO scanner (extended range) |
| **SentinelDID** (emergency workforce) | NFC badge / wristband | QR code | KYCz biometric re-verify | NFC smartphone |

**All scan methods resolve to the same DID on Midnight.** The physical tag is just a lookup key — the identity, health records, credentials, and disclosure policies all live on-chain.

### The Binding Protocol (Universal)

```
Physical tag (RFID/NFC/QR) → Read identifier → Hash with domain separator
     → persistentHash("[platform]:rfid:", identifier)
     → Deterministic DID on Midnight
     → ZK-verified credential check on requester
     → Selective disclosure per policy
     → On-chain audit log
```

### Key Privacy Property

**The physical identifier (chip number, NFC UID) is never stored on-chain** — only the hash. This means:
- Scanning the physical tag is the ONLY way to resolve to a DID
- The on-chain ledger cannot be scraped to find animals/patients
- Even if someone obtains the DID, they cannot reverse-engineer the chip number
- Compliant with HIPAA, GDPR, and veterinary privacy requirements

### Animals Already Have the Infrastructure

Over 100 million pets and millions of horses worldwide carry ISO-compliant RFID microchips. Many equine registries (FEI, EU regulation) **mandate** chipping. PetProData and EquineProData don't need to deploy new hardware — they bridge existing chips to Midnight DIDs.

For humans, NFC medical alert jewelry is a growing market. SentinelDID + Safe Health Data makes these tags **intelligent** — instead of engraved text, they carry a DID that resolves to a living, updatable, privacy-controlled health record.

---

## Proposed Contract Extensions

### Emergency Disclosure Circuit (for sentineldid.compact)

A new circuit that bridges SentinelDID identity verification with health data access:

```
// Proposed addition to sentineldid.compact or companion contract

export circuit requestEmergencyHealthAccess(
  responderDidId: Bytes<32>,     // Responder's SentinelDID
  victimDidId: Bytes<32>,        // Victim/patient/animal DID
  emergencyType: Field,          // Triage level / emergency classification
  requestedFields: Field         // Bitmask of requested health data categories
): Bytes<32>                     // Access token (if authorized)
```

This circuit would:
1. Verify the responder's DID is active and has emergency credentials
2. Check the victim's emergency disclosure policy
3. If authorized, return an access token for the requested health data fields
4. Log the access event on-chain

---

*Cross-pollination by: Penny 🎀*
