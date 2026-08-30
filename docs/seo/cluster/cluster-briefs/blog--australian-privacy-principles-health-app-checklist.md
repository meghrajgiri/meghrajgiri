# Brief — The 13 Australian Privacy Principles as a build checklist for health apps

| Field | Value |
|---|---|
| **URL** | `/blog/australian-privacy-principles-health-app-checklist` |
| **Role** | spoke · Compliance as engineering requirements |
| **Primary keyword** | `australian privacy principles health app` |
| **Secondary keywords** | — |
| **Template** | how-to |
| **Word count target** | 1,800 |
| **Priority score** | 68/100 — relative, not search volume |
| **Incoming internal links** | 2 |

---

> ### Clearance required before writing
>
> **How consent, data minimisation and access/correction were implemented. Any privacy review or assessment output.**
>
> If this cannot be cleared, **cut the post rather than writing a generic version.** The first-hand
> detail is the only reason this page can outrank the government documentation and agency blogs that
> currently hold the SERP. Without it you are publishing a worse copy of what already exists.

---

## Meta

**Title tag** — 57 chars

```
The 13 Australian Privacy Principles as a Build Checklist
```

**Meta description** — 130 chars

```
The 13 APPs restated as engineering requirements for health apps — consent, collection, cross-border disclosure, security, access.
```

---

## Outline

## Why health apps get the strict path
_250 words_

Health information is sensitive information under the Privacy Act, and the $3m small-business exemption does not apply to health service providers. Establish the stakes.

## APP 1 to 3 — Open handling, anonymity, collection
_400 words_

A privacy policy that is actually accurate to the code. Collect only what you use — the hardest one to hold as a product grows.

## APP 5 and 6 — Notification and use limitation
_350 words_

Notice at collection, and why 'we may use your data to improve our services' is not a lawful basis for a secondary use of health data.

## APP 8 — Cross-border disclosure
_400 words_

The one that bites hardest on a modern stack. Every managed service, every LLM API call, every error-tracking SDK is potentially a disclosure to an overseas recipient. Enumerate the audit.

## APP 11 — Security
_450 words_

Encryption in transit and at rest, access control, and the destruction obligation once data is no longer needed. Retention is a requirement, not a nice-to-have.

## APP 12 and 13 — Access and correction
_350 words_

Users can demand their data and demand it be corrected. Build the export path on day one; retrofitting it into a mature schema is miserable.

## The checklist
_300 words_

One condensed table: principle, what it means in code, how you evidence it. This is the linkable artifact.

---

## Key points

- APP 8 is the section that earns links. Most engineering teams have never audited their third-party disclosure surface, and the list is longer than they expect — analytics, crash reporting, email delivery, any AI API.
- End with a real checklist table someone can paste into a ticket.
- Do not restate the OAIC guidelines, translate them. If a sentence could appear on oaic.gov.au, cut it.

---

## Differentiate from

These hold the SERP today. This brief exists to be *not* these.

- `oaic.gov.au/privacy/australian-privacy-principles` — the authoritative text, written for compliance officers.
- `usercentrics.com`, `pandectes.io`, `securiti.ai`, `privacymate.com.au` — consent-management SaaS blogs aimed at business owners and written to sell a product.
- None of these are written for the person implementing it. That is the entire gap.

---

## Internal links out

| Link to | Anchor text | Type |
|---|---|---|
| [Building Healthcare Software for the Australian Market](/blog/australian-healthcare-software-development) | `building healthcare software for Australia` | mandatory |
| [What 'Privacy Act ready' actually means in your architecture](/blog/privacy-act-health-data-architecture) | `data residency and architecture` | sibling |
| [Integrating My Health Record via the FHIR Gateway: a real walkthrough](/blog/my-health-record-fhir-gateway-integration) | `My Health Record data handling` | cross-cluster |

Every link sits in body copy with descriptive anchor text — never a bare "read more", never
navigation-only.

---

## Citable passage

AI search engines quote passages that make a specific, checkable claim. Write one shaped like this,
near the top, and fill the brackets with real values:

> Under APP 8, every overseas service in your stack is a potential cross-border disclosure of health information — which in a typical Next.js health app means auditing not just your database region but your error tracker, your transactional email provider, and any AI API you call. On [project] that audit surfaced [N] services that needed [action].
