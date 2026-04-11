# PP DID and Compliance — Edda Labs / Brick Towers RWA Patterns for SentinelDID

**Source**: Edda Labs deep dive video by Erick (Part 2: ZK Identity for RWA)
**Video**: https://www.youtube.com/watch?v=l6hMb942sOA
**Repo analyzed**: https://github.com/BrickTowers/midnight-rwa
**Date**: April 11, 2026
**Focus**: Privacy-Preserving DID and Compliance patterns for SentinelDID's security monitoring, identity threat detection, and credential integrity verification.

---

## Executive Summary

SentinelDID monitors and protects the DIDz identity ecosystem. Brick Towers' midnight-rwa demonstrates several security-critical patterns that SentinelDID should leverage for threat detection, authorization integrity monitoring, and credential validation. This doc focuses on the security implications.

---

## 1. Sealed Ledger as Security Anchor

### The Pattern

```compact
export sealed ledger identityProviderPublicKey: CurvePoint;
```

**Security property**: Sealed fields cannot be changed by ANY party after deployment — not the deployer, not an admin, nobody. The compiler enforces this at the language level.

### SentinelDID Monitoring Implications

SentinelDID should treat sealed fields as **ground truth** when monitoring contract state:

- **Sealed fields are trustworthy** — if `identityProviderPublicKey` is sealed, SentinelDID doesn't need to monitor it for unauthorized changes. The compiler guarantees immutability.
- **Non-sealed fields need monitoring** — any mutable ledger state (Maps, Sets, Counters, MerkleTree contents) could be changed by authorized or unauthorized parties.
- **Sentinel alert**: If a contract claims to use sealed parameters but the field isn't actually `sealed` in the Compact source, that's a security finding.

### Sentinel Rule Set for Sealed Fields

```
RULE: sealed-field-integrity
  IF contract_claims_immutable_parameter AND field_is_NOT_sealed
  THEN severity=CRITICAL, alert="Mutable field masquerading as immutable"

RULE: sealed-field-audit
  IF contract_deployment_detected
  THEN log_sealed_values_at_deployment_for_audit_trail
  NOTE: sealed values are only accessible at deployment time
```

---

## 2. Authorization Tree Integrity Monitoring

### Brick Towers' HistoricMerkleTree Pattern

```compact
export ledger authorizations: HistoricMerkleTree<32, ZswapCoinPublicKey>;
```

**Security properties**:
- Insertions are append-only (no removal from MerkleTree)
- Historical roots are preserved — old proofs remain valid
- Membership is not enumerable from outside

### SentinelDID Monitoring for Authorization Trees

**What to watch**:
1. **Rapid insertion rate** — sudden burst of authorizations could indicate compromised admin key
2. **Authorization without onboard** — if an authorization appears without a corresponding onboard transaction, something is wrong
3. **Repeated failed authorization checks** — someone probing for valid Merkle paths
4. **Stale root usage** — proofs using very old roots could indicate a replay attempt

```
RULE: auth-tree-burst
  IF auth_insertions_per_block > threshold
  THEN severity=HIGH, alert="Abnormal authorization rate"

RULE: auth-without-onboard
  IF authorization_insert_detected AND NOT preceded_by_onboard_circuit
  THEN severity=CRITICAL, alert="Authorization without compliance check"

RULE: stale-root-probe
  IF checkRoot_called_with_root_older_than(N_blocks)
  THEN severity=MEDIUM, alert="Stale authorization proof — possible replay"
```

---

## 3. Credential Signature Integrity

### The Schnorr Verification Circuit

```compact
export pure circuit verify<T>(credential: SignedCredential<T>, challenge: Field): Boolean {
  const lhs = ecMulGenerator(credential.signature.s);
  const rhs = ecAdd(credential.signature.r, ecMul(credential.pk, challenge));
  return lhs == rhs;
}
```

**What can go wrong**:
1. **Compromised IDP key** — if the Identity Provider's private key leaks, anyone can forge credentials
2. **Challenge reduction bypass** — the `reduceChallenge` witness reduces the hash modulo `FIELD_MODULUS`. If a malicious witness returns a different value, the signature check could be manipulated (though the ZK proof would still need to verify)
3. **Nonce reuse** — if deterministic k generation is broken, the same k for different messages reveals the secret key

### SentinelDID Credential Monitoring

```
RULE: idp-key-compromise-indicator
  IF multiple_different_identities_signed_with_same_pk
  AND identity_attributes_are_impossible (e.g., same person in two countries)
  THEN severity=CRITICAL, alert="Possible IDP key compromise or credential factory"

RULE: credential-replay
  IF same_signed_credential_submitted_to_multiple_contracts
  THEN severity=HIGH, alert="Credential replay across contracts"

RULE: nationality-disclosure-anomaly
  IF disclosed_nationality_changes_for_same_wallet_pubkey
  THEN severity=CRITICAL, alert="Identity inconsistency — same key, different nationality"
```

---

## 4. The ecMulGenerator Bug — Security Implications

### The Bug

Brick Towers documents:
```compact
// We are exporting these signing primitives instead of the pure sign circuit
// due to broken ecMulGenerator in CompactRuntime
```

The `sign` circuit doesn't work in the JavaScript runtime. Signing happens in TypeScript instead.

### Security Implications for SentinelDID

1. **Off-chain signing is less secure** than in-circuit signing — the TypeScript environment is more attackable than the ZK circuit
2. **The workaround moves trust** from the ZK prover to the JavaScript runtime
3. **SentinelDID should flag** any contract that claims to do signing in-circuit but actually does it in TypeScript — the security guarantees are different

```
RULE: signing-location-audit
  IF contract_exports_sign_circuit
  AND sign_circuit_is_commented_out
  THEN severity=INFO, alert="Signing done off-chain due to CompactRuntime bug — reduced security boundary"
```

---

## 5. Disclosure Pattern Analysis — Threat Modeling

### What Brick Towers Discloses

| Data | Disclosed | Threat if leaked further |
|------|-----------|------------------------|
| `nationality` | ✅ (for comparison) | Low — broad attribute, not personally identifiable |
| `inputCoin` (color, value) | ✅ (for verification) | Medium — reveals wealth bracket |
| `authPath` | ✅ (for root computation) | Low — path alone doesn't reveal other members |
| `recipient.is_left` | ✅ (for branching) | Low — public/contract distinction |
| Name, DOB, doc number | ❌ | HIGH if leaked — personally identifiable |
| Quiz answers | ❌ | Medium — could enable quiz bypass |
| Secret key | ❌ | CRITICAL — full identity compromise |

### SentinelDID Disclosure Monitoring

```
RULE: over-disclosure
  IF circuit_discloses_more_fields_than_minimum_required_for_logic
  THEN severity=HIGH, alert="Potential over-disclosure — review privacy boundary"

RULE: undisclosed-field-in-ledger
  IF witness_derived_value_stored_in_ledger_without_disclose
  THEN severity=CRITICAL, alert="Undeclared disclosure — compiler should catch this, investigate"
```

---

## 6. Witness Security — The Trust Boundary

### The Pattern

```typescript
export const witnesses = {
  localSecretKey(context): [RwaPrivateState, Uint8Array] {
    return [context.privateState, context.privateState.secretKey];
  },
  reduceChallenge(context, challenge): [RwaPrivateState, bigint] {
    return [context.privateState, challenge % FIELD_MODULUS];
  },
};
```

### Security Analysis

Witnesses run on the **user's machine** — they're outside the ZK trust boundary:

1. **A malicious witness** could return incorrect values, but the ZK proof would fail if the circuit logic depends on the correct value
2. **`reduceChallenge`** is a special case — it does math the circuit can't. A malicious witness could return a different reduced value, causing the signature check to fail (but not pass incorrectly, because the verifier recomputes)
3. **`findAuthorizationPath`** — a malicious witness could fail to find a valid path (denial of service) but can't forge one (the proof checks the root)

### SentinelDID Witness Monitoring

```
RULE: witness-failure-rate
  IF witness_errors_per_user > threshold
  THEN severity=MEDIUM, alert="High witness failure rate — possible DoS or corrupted local state"

RULE: witness-timing
  IF witness_execution_time > expected_range
  THEN severity=LOW, alert="Witness performance anomaly — possible attack or degraded service"
```

---

## 7. Cross-Contract Reference Security

### Brick Towers' Cross-Contract Token Reference

```compact
// tBTC comes from a separate contract
export sealed ledger tbtcCoinColor: Bytes<32>;
// In constructor: tokenType(pad(32, "brick-towers:coin:tbtc"), tBTCaddress)
```

The tBTC contract address is sealed — nobody can swap it for a malicious token contract.

### SentinelDID Monitoring for Cross-Contract References

```
RULE: cross-contract-reference-integrity
  IF contract_references_external_contract_address
  AND external_address_is_NOT_sealed
  THEN severity=HIGH, alert="Mutable cross-contract reference — potential token swap attack"

RULE: domain-separator-collision
  IF two_contracts_use_same_domain_separator_different_addresses
  THEN severity=CRITICAL, alert="Token type collision — potential confusion attack"
```

---

## 8. Action Items for SentinelDID

### Monitoring Rules to Implement
- [ ] Authorization tree burst detection
- [ ] Authorization without onboard detection
- [ ] Credential replay across contracts
- [ ] Nationality disclosure inconsistency
- [ ] Over-disclosure analysis
- [ ] Cross-contract reference integrity checks
- [ ] Witness failure rate tracking

### Security Analysis Tools
- [ ] Sealed field audit tool — verify sealed claims match actual Compact source
- [ ] Disclosure boundary analyzer — map which fields are disclosed per circuit
- [ ] Signing location detector — flag off-chain signing workarounds
- [ ] HistoricMerkleTree growth rate monitor

---

## 9. Resources

- **Edda Labs**: https://eddalabs.io | GitHub: https://github.com/eddalabs
- **Brick Towers midnight-rwa**: https://github.com/BrickTowers/midnight-rwa
- **Erick's video**: https://www.youtube.com/watch?v=l6hMb942sOA
- **Midnight explicit disclosure docs**: https://docs.midnight.network/compact/reference/explicit-disclosure

---

*Security analysis by Cassie for SentinelDID, April 11, 2026*
*Source: Edda Labs video series by Erick — https://eddalabs.io*
