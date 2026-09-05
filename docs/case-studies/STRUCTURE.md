# Case study structure

**Prepared:** 2026-09-05
**For:** meghrajgiri.com project pages
**Current state:** 7 of 8 projects have no case study. The one that does has 74 words.

---

## What the research actually says

Five findings shaped the structure below. Sources at the end.

**1. You get 5–10 minutes for the entire portfolio, not per project.**
The Interaction Design Foundation puts hiring-manager review of a whole portfolio at
5–10 minutes. With eight projects, a first pass gives each one **under a minute**. Every
structural decision follows from that: the page has to survive being skimmed, and only
reward reading if the skim earned it.

**2. Readers scan for the outcome first, then decide whether to read.**
Recorded behaviour: *"If the preview is not available, I usually just scroll down to see
it and back up to start reading."* People look for the result, then go back to the
beginning. So results belong **above** the narrative, not at the end of it — which is the
opposite of how most people write them.

**3. Decisions and trade-offs are the whole differentiator.**
Stated plainly in the engineering guidance: *"The decisions and trade-offs are what
separates you from someone who merely executed. For each major choice, explain why — and
what you rejected."* A list of features says a team shipped something. A rejected
alternative says you were in the room when it was chosen.

**4. Missing business metrics is normal — use proxies.**
*"If you do not have business metrics, use proxies: usage, time saved, performance gains,
reach."* This matters for you specifically: most of your work is client work where the
commercial numbers are not yours to publish. Delivery facts and performance numbers are
yours.

**5. NDA work has an established honest form.**
*"Present the constraint honestly, show the engineering rather than the product, and let
the depth of what you can discuss do the work."* Anonymise the client, keep the
engineering. Never publish an unfilled placeholder in place of a number you cannot share
— say what you cannot share instead.

**Media balance:** 60–80% text, 20–40% media. Your project pages currently sit near the
opposite. The galleries are strong; the writing is what is missing.

---

## The structure

Two tiers. Every project gets the **Core**. Two or three flagship projects also get the
**Depth** blocks. This is deliberate: the research is consistent that a few strong case
studies beat eight thin ones, and eight identical-length write-ups is how a portfolio
becomes unreadable.

### Core — every project (target 250–400 words)

| # | Block | What it is | Why it earns its place |
|---|---|---|---|
| 1 | **Summary** | 2–3 sentences: what it is, who it is for, what was hard. | The only thing most readers will read. Must stand alone with no context — this is also the passage an AI answer can quote. |
| 2 | **Facts strip** | Role · Timeline · Team size · Stack · Status | Answers "what did *you* do here" in three seconds. The research is explicit that on team projects you must state what you owned. |
| 3 | **Outcome** | Up to 3 numbers, or delivery facts if metrics are not publishable. | Placed high because readers scan for it first. |
| 4 | **The problem** | In the user's or client's terms. No technology. | If the problem is only stated technically, nobody can judge whether the solution was good. |
| 5 | **What I built** | The shape of the solution: 3–5 sentences or a short list. | Orients the reader before any detail. |

### Depth — flagship projects only (adds 300–500 words)

| # | Block | What it is | Why it earns its place |
|---|---|---|---|
| 6 | **Constraints** | What made this not a normal build — regulation, offline, payment rails, app-store review, a legacy system. | Constraints are what make a project interesting. Without them every project reads the same. |
| 7 | **Key decisions** | 2–4 decisions, each with **what was rejected and why**. | The single highest-value block per the research. Without rejected options it is not a decision, it is a description. |
| 8 | **Where it got hard** | One specific thing that broke, and what fixing it required. | Specificity is unfakeable. This is the block that reads as first-hand. |
| 9 | **What I'd do differently** | Honest reflection, one paragraph. | IxDF lists this as mandatory. It signals judgement, and its absence is conspicuous. |

### Never include

- A features list with no problem attached to it.
- Process theatre — "then I did discovery, then I wireframed" — unless a step changed the outcome.
- Team achievements written as if they were yours. State the boundary.
- **An unfilled placeholder.** `/projects/cannabiz-elite` shipped `[N] Clinics onboarded`
  to production for weeks. If a number is not publishable, write the sentence that says so.

---

## How it maps to the existing schema

`caseStudy` already holds `summary`, `metrics[]` and `sections[]`, which covers blocks
1, 3 and 4–9. Block 2 needs a new field:

```jsonc
"caseStudy": {
  "summary": "…",                     // block 1
  "facts": {                          // block 2 — new
    "role": "Sole developer",
    "timeline": "2026 — ongoing",
    "team": "Solo, with a designer",
    "status": "In production"
  },
  "metrics": [                        // block 3 — omit entirely if empty
    { "value": "30%", "label": "Faster initial load" }
  ],
  "sections": [                       // blocks 4-9, in order
    { "heading": "The problem",             "body": "…" },
    { "heading": "What I built",            "body": "…" },
    { "heading": "Constraints",             "body": "…" },
    { "heading": "Key decisions",           "body": "…" },
    { "heading": "Where it got hard",       "body": "…" },
    { "heading": "What I'd do differently", "body": "…" }
  ]
}
```

`metrics` renders nothing when the array is empty, so a project with no publishable
numbers simply has no metrics row rather than a row of blanks.

---

## Worked example — Thriftverse

Built only from facts already published on the site or in the Toptal resume. **Gaps are
marked; they are yours to fill, not mine to invent.**

> **Summary**
> Thriftverse is a thrift marketplace where any seller gets their own storefront on a
> unique URL. It was built for the Nepali market, which meant local payment rails and a
> local courier rather than Stripe and a shipping API — and it shipped to both the App
> Store and Google Play.
>
> **Facts** — Role: ⟨fill⟩ · Timeline: ⟨fill⟩ · Team: ⟨fill⟩ · Stack: React Native,
> React, Next.js, Node.js, TypeScript, Supabase · Status: Live
>
> **Outcome** — ⟨fill: sellers onboarded, orders processed, or "shipped to both stores
> in N weeks" if commercial numbers are not publishable⟩
>
> **The problem**
> Someone selling second-hand clothes in Nepal has Instagram and a phone number. There is
> no storefront, no order record, and every delivery is arranged by DM.
>
> **What I built**
> A marketplace where a seller gets a storefront URL, products with photos and stock, and
> orders that move through a real status flow — with eSewa for payment and Nepal Can Move
> for delivery.
>
> **Constraints**
> Stripe does not serve Nepal. Neither does any courier with a mature API. ⟨fill: what
> eSewa and Nepal Can Move actually demanded — callback shape, reconciliation, manual
> steps⟩
>
> **Key decisions**
> ⟨fill: 2–3 decisions. For each: what you chose, what you rejected, why. Candidates —
> React Native over two native apps; storefront-per-seller over a single catalogue;
> Supabase over a hand-rolled backend.⟩
>
> **Where it got hard**
> ⟨fill: the specific failure. A payment that succeeded while delivery booking failed is
> the obvious candidate if that happened.⟩
>
> **What I'd do differently**
> ⟨fill⟩

Note how much is already writable from what is public. The gaps are mostly **decisions
and failures** — the two things only you know, and the two the research says matter most.

---

## Suggested order of work

1. **Cannabiz Elite** — most impressive, currently the only one with a case study, and
   the one whose numbers you said were pending clearance. If they are still not clear,
   write the constraint sentence instead and stop leaving it empty.
2. **Thriftverse** — richest public detail, most complete gallery.
3. **Khatapata** — a 7-word description today, and offline-first PWA in a low-connectivity
   market is a genuinely distinctive constraint.
4. Everything else to Core only.

Two flagships at full depth plus six at Core is roughly **2,500 words total** and would
take the project pages from 109–377 words each to a portfolio that can carry a non-brand
search query. It also directly serves the AI-search goal: blocks 1, 4 and 7 are where
self-contained, quotable claims live.

---

## Sources

- [How to Write Great Case Studies for Your UX Design Portfolio — Interaction Design Foundation](https://ixdf.org/literature/article/how-to-write-great-case-studies-for-your-ux-design-portfolio) — 5–10 minute portfolio review, scan-for-results behaviour, 60–80% text ratio, mandatory hook and outcomes sections
- [How to Write a Portfolio Case Study — TailorCV](https://thetailorcv.com/blog/how-to-write-portfolio-case-study) — decisions and trade-offs as the differentiator; metric proxies when business numbers are unavailable
- [What hiring managers look for in a UX portfolio — UX Design Institute](https://www.uxdesigninstitute.com/blog/hiring-managers-ux-portfolio/) — skim behaviour, stating what you owned on team projects
- [How to Build a Software Engineering Portfolio — Intuit](https://www.intuit.com/blog/global-stories/software-engineer-portfolio/) — engineering-specific emphasis on architecture and trade-offs
- [Working Under NDA as a Freelance Engineer — Hassan Javed](https://www.hassanjaved.work/blog/working-under-nda-freelance-engineer-guide) — showing the engineering rather than the product
- [How to Handle NDAs When You Write Your UX Case Study — IxDF](https://ixdf.org/literature/article/how-to-handle-non-disclosure-agreements-ndas-when-you-write-your-ux-case-study) — anonymisation and disclosure practice
