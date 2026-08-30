# Brief — Integrating My Health Record via the FHIR Gateway: a real walkthrough

| Field | Value |
|---|---|
| **URL** | `/blog/my-health-record-fhir-gateway-integration` |
| **Role** | spoke · National infrastructure integration |
| **Primary keyword** | `my health record fhir gateway integration` |
| **Secondary keywords** | — |
| **Template** | how-to |
| **Word count target** | 2,000 |
| **Priority score** | 78/100 — relative, not search volume |
| **Incoming internal links** | 3 |

---

> ### Clearance required before writing
>
> **Whether My Health Record integration was in scope; if so, the conformance steps, auth model and what failed first.**
>
> If this cannot be cleared, **cut the post rather than writing a generic version.** The first-hand
> detail is the only reason this page can outrank the government documentation and agency blogs that
> currently hold the SERP. Without it you are publishing a worse copy of what already exists.

---

## Meta

**Title tag** — 49 chars

```
Integrating My Health Record via the FHIR Gateway
```

**Meta description** — 134 chars

```
Connecting to My Health Record: choosing a gateway, the Healthcare Identifiers prerequisite, NASH certificates, and what breaks first.
```

---

## Outline

## Three doors, and picking the wrong one is expensive
_400 words_

FHIR Gateway for consumer and mobile apps, B2B SOAP with WS-Security and NASH certificates for clinical systems, and the mobile gateway. The decision tree, made concrete.

## The prerequisite nobody warns you about
_350 words_

Healthcare Identifiers Service conformance comes first. You cannot connect to My Health Record without it, and it is a process rather than an API key.

## Certificates and authentication
_450 words_

NASH certificates, what issues them, how long it takes, and how to handle them in a deployment pipeline without committing a private key to a repo.

## The FHIR resources you actually touch
_450 words_

Which resources map to which CDA documents, where the data model is lossy, and the error codes worth handling explicitly.

## Conformance and the developer welcome pack
_350 words_

What the Australian Digital Health Agency asks for, what testing looks like, and roughly how long it takes in calendar time.

## What broke first
_350 words_

The honest section, and the reason anyone will link to this post.

---

## Key points

- The decision tree between the three connection methods is the highest-value part. Nobody has drawn it for engineers.
- Calendar time is the number people search for and never find. If you can publish it, do.
- Do not reproduce the API specification. Link to it and explain what it does not tell you.

---

## Differentiate from

These hold the SERP today. This brief exists to be *not* these.

- `developer.digitalhealth.gov.au` and `implementer.digitalhealth.gov.au` — complete, authoritative, and completely without narrative. Four of the top ten results are these two domains.
- `whitefox.cloud/articles/my-health-record-system-integration/` — the only independent write-up in the SERP. Read it, then go deeper than it does.
- `keragon.com/blog/ehr-api-integration` — generic EHR integration content, US-centric.

---

## Internal links out

| Link to | Anchor text | Type |
|---|---|---|
| [Building Healthcare Software for the Australian Market](/blog/australian-healthcare-software-development) | `building healthcare software for Australia` | mandatory |
| [The Healthcare Identifiers Service: the prerequisite nobody documents](/blog/healthcare-identifiers-service-integration) | `Healthcare Identifiers prerequisite` | sibling |

Every link sits in body copy with descriptive anchor text — never a bare "read more", never
navigation-only.

---

## Citable passage

AI search engines quote passages that make a specific, checkable claim. Write one shaped like this,
near the top, and fill the brackets with real values:

> You cannot connect to My Health Record directly. Conformance with the Healthcare Identifiers Service is a prerequisite, and the connection method — FHIR Gateway for consumer apps, or B2B SOAP with WS-Security and NASH certificates for clinical systems — has to be chosen before any of it starts, because switching later means repeating conformance.

---

## Notes

Highest priority spoke in the plan. If only one technical post gets written, write this one.
