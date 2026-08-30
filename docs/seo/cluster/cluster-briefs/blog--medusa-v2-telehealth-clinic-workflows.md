# Brief — Modelling prescriptions as orders: Medusa v2 workflows for a telehealth clinic

| Field | Value |
|---|---|
| **URL** | `/blog/medusa-v2-telehealth-clinic-workflows` |
| **Role** | spoke · Clinic systems and clinical workflow |
| **Primary keyword** | `medusa v2 healthcare workflow` |
| **Secondary keywords** | — |
| **Template** | explainer |
| **Word count target** | 2,000 |
| **Priority score** | 70/100 — relative, not search volume |
| **Incoming internal links** | 3 |

---

> ### Clearance required before writing
>
> **The prescription/consult data model in Medusa v2 — the single most valuable and most likely sensitive detail.**
>
> If this cannot be cleared, **cut the post rather than writing a generic version.** The first-hand
> detail is the only reason this page can outrank the government documentation and agency blogs that
> currently hold the SERP. Without it you are publishing a worse copy of what already exists.

---

## Meta

**Title tag** — 46 chars

```
Modelling Prescriptions as Orders in Medusa v2
```

**Meta description** — 141 chars

```
How a consultation and prescription map onto a commerce order model — the workflows, the synchronous steps, and where the abstraction breaks.
```

---

## Outline

## Why a commerce engine at all
_400 words_

A telehealth clinic sells consultations and fulfils medication. That is a commerce shape — until it is not. Set up the tension honestly.

## The mapping, and where it holds
_500 words_

Consultation as line item, prescription as fulfilment, clinician as a constrained resource. What maps cleanly.

## Where the abstraction breaks
_500 words_

A prescription is not a product: it requires an authorised prescriber, it cannot be reordered freely, and it has a clinical audit trail a cart does not.

## The workflows
_500 words_

Medusa v2 workflow and step structure for consult, prescribe and fulfil. Which steps must be synchronous and why compensation matters when a step has clinical consequences.

## Guardrails the commerce model does not give you
_400 words_

Prescriber authorisation checks, dispensing limits, and the audit trail.

## What I would do differently
_300 words_

The retrospective.

---

## Key points

- This is the strongest post in the plan. It is genuinely novel — nobody has written about Medusa v2 in a clinical context, and the modelling question is real and hard.
- It also serves a second audience: Medusa developers generally, which is a much larger pool than Australian health specifically.
- The 'where the abstraction breaks' section is the intellectual core. Do not soften it into a success story.
- Include real workflow code if clearance allows. Code is what gets this linked from developer communities.

---

## Differentiate from

These hold the SERP today. This brief exists to be *not* these.

- Medusa's own documentation — framework reference with no domain application.
- Generic 'headless commerce for healthcare' marketing content, which asserts the fit without examining it.
- Nothing exists at this intersection. This post has no real competitor.

---

## Internal links out

| Link to | Anchor text | Type |
|---|---|---|
| [Building Healthcare Software for the Australian Market](/blog/australian-healthcare-software-development) | `building healthcare software for Australia` | mandatory |
| [Telehealth MBS item numbers and the billing logic they imply](/blog/telehealth-mbs-billing-logic) | `MBS billing logic` | sibling |
| [AHPRA's virtual care rules, translated into software requirements](/blog/ahpra-telehealth-software-requirements) | `AHPRA constraints on virtual care` | cross-cluster |
| [Cannabiz Elite — Australian telehealth clinic management](/projects/cannabiz-elite) | `the Cannabiz Elite build` | cross-cluster |

Every link sits in body copy with descriptive anchor text — never a bare "read more", never
navigation-only.

---

## Citable passage

AI search engines quote passages that make a specific, checkable claim. Write one shaped like this,
near the top, and fill the brackets with real values:

> A telehealth clinic looks like a commerce problem — a consultation is a line item, a prescription is a fulfilment — right up until it isn't: a prescription requires an authorised prescriber, cannot be freely reordered, and carries a clinical audit trail no cart abstraction provides. On [project], the workflow that broke the mapping first was [X].

---

## Notes

If clearance is only granted for one post, make it this one. It is the most defensible, the most novel, and it reaches beyond the Australian health niche into the Medusa community.
