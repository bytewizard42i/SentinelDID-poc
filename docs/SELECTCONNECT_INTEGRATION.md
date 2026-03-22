# SentinelDID × SelectConnect — Emergency Contact Protocol

*How SelectConnect's progressive reveal extends SentinelDID's emergency protocol with controlled contact sharing for first responders, victim support, and post-emergency follow-up.*

---

## Emergency Override Pattern

SentinelDID manages emergency workforce identity and victim data access. SelectConnect adds the **contact channel**:

### Normal Mode (Non-Emergency)

Standard SelectConnect progressive reveal:
- Victim's emergency contacts are stored as SelectConnect cards
- Access requires bonds + progressive reveal
- Full protection against unauthorized contact

### Emergency Mode (SentinelDID-Activated)

When SentinelDID declares an emergency:

```
SentinelDID verifies responder → Emergency override circuit:
  → Bypasses bond requirement
  → Immediately reveals Level 3 (emergency contacts, medical info)
  → Access auto-expires after 72 hours
  → Full audit trail on-chain (who accessed what, when, why)
  → Post-emergency: victim can review all access and revoke
```

### Key Circuits

| Scenario | Normal SelectConnect | Emergency Override |
|----------|--------------------|--------------------|
| Access Level 1 | Free | Immediate |
| Access Level 2 | Bond required | Immediate (responder-verified) |
| Access Level 3 | High bond + mutual consent | Immediate (emergency declaration) |
| Access Level 4 | Persistent link | 72-hour auto-expiring |
| Revocation | Manual | Auto-revoke + victim review |

### Post-Emergency

After the emergency:
- Victim receives full audit: "Responder X accessed Levels 1-3 at [time] for [reason]"
- Victim can extend access (e.g., for ongoing medical care)
- Victim can report inappropriate access → responder's SentinelDID reputation affected
- Emergency contacts notified of who accessed what

---

## Workforce Contact Coordination

SentinelDID's hierarchical delegation + SelectConnect:
- **Commander → Team**: Progressive briefing levels (need-to-know basis)
- **Team → Victims**: Bonded first contact with audit trail
- **Inter-agency**: SelectConnect privacy routes for cross-organization coordination

---

## Related Documents

- SentinelDID Emergency Protocols: `safeHealthData/docs/SENTINELDID_EMERGENCY_PROTOCOL.md`
- Health Data Cross-Pollination: `SentinelDID/docs/HEALTH_DATA_CROSS_POLLINATION.md`
- SelectConnect Ecosystem Map: `selectConnect/docs/ECOSYSTEM_INTEGRATIONS.md`

---

*Last updated: March 22, 2026 — Penny 🎀*
