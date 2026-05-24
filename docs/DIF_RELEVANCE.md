# DIF Relevance for SentinelDID

> **Canonical source**: [`/home/js/DIDzMonolith/monolith-docs/DIF_KNOWLEDGE_BASE.md`](/home/js/DIDzMonolith/monolith-docs/DIF_KNOWLEDGE_BASE.md)
>
> This file is a short pointer. The deep content (specs, ecosystem, integration patterns, anti-patterns) lives in the canonical knowledge base. Refresh this file only when SentinelDID's DIF needs materially change.

## Why DIF matters for SentinelDID

SentinelDID security-grade DID requirements map cleanly onto KERI (Key Event Receipt Infrastructure), which provides self-certifying identifiers with key rotation history independent of any ledger. Well-Known DID Configuration provides the domain-binding layer that security-sensitive deployments require.

## DIF specs to adopt

- **KERI**: self-certifying DIDs with key rotation receipts, ledger-independent (the right fit for security-sensitive DIDs)
- **Well-Known DID Configuration**: bind SentinelDID identifiers to verified domains
- **DID Methods WG**: track conventions for security-grade methods
- **Universal Resolver**: serve SentinelDID alongside other methods

## Integration patterns from the canonical doc

- Pattern A (Universal Resolver as shared infra)

## Concrete next steps

1. Evaluate KERI as the underlying mechanism for SentinelDID key rotation logs.
2. Publish Well-Known DID Configurations for all SentinelDID-anchored domains.
3. Register the SentinelDID method with the Universal Resolver community.

## Last refreshed

May 24, 2026 from DIF homepage and GitHub org listing.
