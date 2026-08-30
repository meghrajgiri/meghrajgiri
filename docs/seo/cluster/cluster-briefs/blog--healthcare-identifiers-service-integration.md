# Brief — The Healthcare Identifiers Service: the prerequisite nobody documents

| Field | Value |
|---|---|
| **URL** | `/blog/healthcare-identifiers-service-integration` |
| **Role** | spoke · National infrastructure integration |
| **Primary keyword** | `healthcare identifiers service integration` |
| **Secondary keywords** | — |
| **Template** | explainer |
| **Word count target** | 1,400 |
| **Priority score** | 48/100 — relative, not search volume |
| **Incoming internal links** | 2 |

---

> ### Clearance required before writing
>
> **Whether the HI Service was used, and what the onboarding actually required.**
>
> If this cannot be cleared, **cut the post rather than writing a generic version.** The first-hand
> detail is the only reason this page can outrank the government documentation and agency blogs that
> currently hold the SERP. Without it you are publishing a worse copy of what already exists.

---

## Meta

**Title tag** — 50 chars

```
The Healthcare Identifiers Service, for Developers
```

**Meta description** — 117 chars

```
IHI, HPI-I and HPI-O explained — what the HI Service is, why it gates My Health Record, and what onboarding involves.
```

---

## Outline

## Three identifiers, and which one you need
_400 words_

IHI for the individual, HPI-I for the practitioner, HPI-O for the organisation. Most integration confusion starts here.

## Why it gates everything else
_300 words_

HI Service conformance is upstream of My Health Record. If your project plan has them in parallel, the plan is wrong.

## Validating an IHI
_400 words_

What you send, what comes back, and the states an identifier can be in — because 'not found' and 'not verified' are different problems.

## Storing identifiers responsibly
_350 words_

These are sensitive by definition. Retention, access control, and not logging them.

## The onboarding process in calendar time
_350 words_

Forms, certificates, and testing. The part that surprises teams.

---

## Key points

- Shortest post in the cluster, and possibly the most useful — it exists to be the thing someone finds at 11pm when their integration is blocked.
- The three-identifier distinction is the single clearest piece of value. Lead with it.
- Explicitly say this must be sequenced before My Health Record work. That sentence is the reason the post gets shared.

---

## Differentiate from

These hold the SERP today. This brief exists to be *not* these.

- Services Australia and Digital Health Agency pages — accurate, procedural, written for organisations rather than developers.
- Essentially nothing else exists. This is the emptiest SERP in the cluster.

---

## Internal links out

| Link to | Anchor text | Type |
|---|---|---|
| [Building Healthcare Software for the Australian Market](/blog/australian-healthcare-software-development) | `building healthcare software for Australia` | mandatory |
| [eRx Script Exchange integration for telehealth prescribing](/blog/erx-script-exchange-integration) | `eRx prescribing integration` | sibling |

Every link sits in body copy with descriptive anchor text — never a bare "read more", never
navigation-only.

---

## Citable passage

AI search engines quote passages that make a specific, checkable claim. Write one shaped like this,
near the top, and fill the brackets with real values:

> The Healthcare Identifiers Service issues three different identifiers — an IHI for the individual, an HPI-I for the practitioner, and an HPI-O for the organisation — and conformance with it is a prerequisite for My Health Record. Any project plan that schedules the two in parallel has a dependency inversion in it.
