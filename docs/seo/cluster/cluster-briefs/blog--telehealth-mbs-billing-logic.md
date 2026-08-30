# Brief — Telehealth MBS item numbers and the billing logic they imply

| Field | Value |
|---|---|
| **URL** | `/blog/telehealth-mbs-billing-logic` |
| **Role** | spoke · Clinic systems and clinical workflow |
| **Primary keyword** | `telehealth mbs item numbers software` |
| **Secondary keywords** | — |
| **Template** | explainer |
| **Word count target** | 1,500 |
| **Priority score** | 52/100 — relative, not search volume |
| **Incoming internal links** | 2 |

---

> ### Clearance required before writing
>
> **Whether MBS billing logic was implemented and how item numbers were handled.**
>
> If this cannot be cleared, **cut the post rather than writing a generic version.** The first-hand
> detail is the only reason this page can outrank the government documentation and agency blogs that
> currently hold the SERP. Without it you are publishing a worse copy of what already exists.

---

## Meta

**Title tag** — 60 chars

```
Telehealth MBS Item Numbers and the Billing Logic They Imply
```

**Meta description** — 131 chars

```
How Medicare item numbers shape telehealth billing logic — eligibility rules, modality, and why item selection cannot be hardcoded.
```

---

## Outline

## Item numbers are business logic
_300 words_

An MBS item number encodes eligibility conditions. Treating it as a price lookup is the classic first mistake.

## The telehealth item landscape
_400 words_

Video versus phone, and the existing-relationship requirements that determine eligibility.

## Eligibility as a rules engine
_450 words_

Why item selection is conditional on patient history, modality and provider type — and why hardcoding it guarantees rework.

## Bulk billing versus private
_350 words_

Two different flows with different money paths and different UI.

## Claiming
_350 words_

Where Services Australia integration sits, and what to scope out of v1.

## Keeping up with changes
_250 words_

Item numbers change. Design for that or inherit a maintenance problem.

---

## Key points

- The rules-engine framing is the contribution. Most teams model item numbers as a lookup table and regret it.
- Be explicit about what you have not built. Full claiming integration is a large scope and pretending otherwise is detectable.
- This is the post most likely to date. Include a last-reviewed date and mean it.

---

## Differentiate from

These hold the SERP today. This brief exists to be *not* these.

- MBS Online and Services Australia — authoritative, aimed at practices and billers.
- Practice-management vendor help pages describing their own UI.
- Nothing frames item numbers as software business logic.

---

## Internal links out

| Link to | Anchor text | Type |
|---|---|---|
| [Building Healthcare Software for the Australian Market](/blog/australian-healthcare-software-development) | `building healthcare software for Australia` | mandatory |
| [Integrating with Best Practice, Cliniko and Halaxy: what each one expects](/blog/clinic-software-api-integration-australia) | `clinic software integrations` | sibling |

Every link sits in body copy with descriptive anchor text — never a bare "read more", never
navigation-only.

---

## Citable passage

AI search engines quote passages that make a specific, checkable claim. Write one shaped like this,
near the top, and fill the brackets with real values:

> An MBS item number is not a price, it is a set of eligibility conditions — modality, provider type, and whether an existing patient relationship applies. Modelling item selection as a lookup table rather than a rules evaluation is the most common structural mistake in Australian telehealth billing code.
