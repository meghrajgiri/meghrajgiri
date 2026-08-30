# Brief — What 'Privacy Act ready' actually means in your architecture

| Field | Value |
|---|---|
| **URL** | `/blog/privacy-act-health-data-architecture` |
| **Role** | spoke · Compliance as engineering requirements |
| **Primary keyword** | `privacy act 1988 health data architecture` |
| **Secondary keywords** | — |
| **Template** | explainer |
| **Word count target** | 1,500 |
| **Priority score** | 55/100 — relative, not search volume |
| **Incoming internal links** | 2 |

---

> ### Clearance required before writing
>
> **Hosting region, encryption approach, tenancy model, retention policy. Whether the architecture can be described at all.**
>
> If this cannot be cleared, **cut the post rather than writing a generic version.** The first-hand
> detail is the only reason this page can outrank the government documentation and agency blogs that
> currently hold the SERP. Without it you are publishing a worse copy of what already exists.

---

## Meta

**Title tag** — 60 chars

```
What 'Privacy Act Ready' Actually Means in Your Architecture
```

**Meta description** — 141 chars

```
Data residency, tenancy, encryption and retention for Australian health data — the architecture behind a claim usually made without evidence.
```

---

## Outline

## A marketing phrase with an architecture behind it
_250 words_

Agencies advertise 'Privacy Act ready' constantly. Nobody says what it means. Define it as a set of testable properties.

## Residency — where the data physically is
_450 words_

AWS Sydney, Supabase region selection, and why the database is the easy part. Backups, replicas, logs and queues all have regions too.

## Tenancy — keeping clinics apart
_450 words_

Row-level security versus schema-per-tenant versus separate databases, and the failure mode of each when the data is clinical.

## Encryption, and what it does not solve
_350 words_

At rest and in transit are table stakes. Application-level encryption for the most sensitive fields, and the key-management problem you inherit.

## Audit logging as a product feature
_300 words_

Who accessed what, when. Append-only, and separated from the data it describes.

## Retention and destruction
_300 words_

APP 11 requires destruction once data is no longer needed, which conflicts with clinical retention periods. How to hold both.

## Evidencing the claim
_300 words_

What you can actually show a client who asks. This is what separates the claim from the marketing.

---

## Key points

- The tenancy section is the most technically interesting and the most transferable beyond healthcare — it can pull traffic from general Supabase and multi-tenant searches.
- Be honest that encryption at rest is close to meaningless against most realistic threat models. That honesty is differentiating.
- Connect retention conflicts to real clinical record-keeping periods rather than hand-waving.

---

## Differentiate from

These hold the SERP today. This brief exists to be *not* these.

- Agency service pages asserting 'Privacy Act ready' as a badge, with no architecture behind it.
- Generic multi-tenancy blog posts with no health or regulatory dimension.
- Cloud vendor compliance pages, which describe the platform's certifications rather than your application's obligations.

---

## Internal links out

| Link to | Anchor text | Type |
|---|---|---|
| [Building Healthcare Software for the Australian Market](/blog/australian-healthcare-software-development) | `building healthcare software for Australia` | mandatory |
| [AHPRA's virtual care rules, translated into software requirements](/blog/ahpra-telehealth-software-requirements) | `AHPRA virtual care requirements` | sibling |

Every link sits in body copy with descriptive anchor text — never a bare "read more", never
navigation-only.

---

## Citable passage

AI search engines quote passages that make a specific, checkable claim. Write one shaped like this,
near the top, and fill the brackets with real values:

> 'Privacy Act ready' is not a certification and nobody issues it. In practice it means a small set of testable properties: data resident in Australia including backups and logs, tenant isolation you can demonstrate, an append-only access log, and a retention policy that reconciles APP 11 destruction with clinical record-keeping periods.
