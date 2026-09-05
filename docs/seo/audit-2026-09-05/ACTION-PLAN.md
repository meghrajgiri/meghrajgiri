# Action Plan — Nepal rankings + AI Overview presence

**Derived from:** `FULL-AUDIT-REPORT.md` (2026-09-05)
**Positioning:** additive — international startup pitch retained, Nepal signals added.

Ordered by dependency, not by effort. Phase 1 unblocks everything after it.

Legend: **[me]** = code/content changes I can make in this repo · **[you]** = requires your account,
your DNS, your identity, or your decision.

---

## Phase 1 — Stop the bleeding (this week)

| # | Action | Owner | Why now |
|---|---|---|---|
| 1.1 | Finish or unpublish `/projects/cannabiz-elite`. Eight `[N weeks]`-style placeholders are live, including inside production JSON-LD `CreativeWork.abstract`. | **[you]** supply the real numbers → **[me]** write | A prospective client currently reads "[N] Clinics onboarded". Nothing outranks this. |
| 1.2 | Remove the "Pending clearance" line — it publicly signals unapproved client disclosure. | **[me]** | Trust and client-confidentiality risk. |
| 1.3 | Decide `.com.np`: 301 to `.com` at the Vercel domain level, or deliberately keep it. See §C2 of the report — every ranking competitor uses `.com.np`. | **[you]** | Equity is split; the stale `.com.np` URL is what Google shows today. |
| 1.4 | Fix the HIPAA→Privacy Act/AHPRA error in the SCSS Consulting entry and the Cannabiz Elite highlight tag. | **[me]** | Wrong regulatory regime in a regulated domain. |
| 1.5 | Verify `www.meghrajgiri.com` in Search Console; if 1.3 is a redirect, run Change of Address from the `.com.np` property. | **[you]** | Nothing below is measurable without it. |

## Phase 2 — Render what already exists (week 1–2)

Highest return per hour in the whole plan. No new content required — the copy is already written and
sitting in Supabase.

| # | Action | Owner |
|---|---|---|
| 2.1 | Build a `Journey` section (id `journey`) rendering the 5 roles from `config.experience`, and an Education block from `config.education`. | **[me]** |
| 2.2 | Build the `Services`/expertise section (id `expertise`) so the nav link resolves — or remove both dead nav items until it ships. | **[me]** |
| 2.3 | Fix or remove `TestimonialsSection` (mounted, renders nothing). | **[me]** |
| 2.4 | Reconcile "20+ Products Shipped" with 7 displayed projects, or explain the gap on the page. | **[you]** decide the number → **[me]** |
| 2.5 | Add the Toptal profile to `sameAs` **and** to visible body copy as a credential line. | **[me]** |
| 2.6 | Fix the wasted LCP preload in `src/app/layout.tsx`; compress `/logo.png` (211 KB). | **[me]** |
| 2.7 | Update stale `© 2024` footer. | **[me]** |

## Phase 3 — Entity resolution (week 2–3)

Goal: make "Meghraj Giri" resolve to one person, distinct from the six unrelated Giri entities
currently occupying your brand SERP.

| # | Action | Owner |
|---|---|---|
| 3.1 | Rebuild the `Person` node per `findings/schema.md`: fix `addressLocality` to **Butwal** (+ Lumbini Province, NP), add `image`, `description`, `alumniOf` (IOST/Tribhuvan University), `worksFor`, `hasOccupation` + `occupationLocation`, `hasCredential` (Toptal Verified Expert, freeCodeCamp), `nationality`, `homeLocation`, `knowsLanguage`, Toptal in `sameAs`. Trim `knowsAbout` 27→~14. | **[me]** |
| 3.2 | Add the `Person` reference to `/projects` (currently dropped); add `ProfilePage` on `/`, `CollectionPage` on `/projects`. | **[me]** |
| 3.3 | Guard against placeholder text reaching JSON-LD (reject `[...]` patterns at build/render). | **[me]** |
| 3.4 | Make name/location/role identical across site, Toptal, LinkedIn, GitHub — same string everywhere. Inconsistency is what breaks entity matching. | **[you]** |
| 3.5 | Ensure LinkedIn and GitHub both link back to `www.meghrajgiri.com`. Reciprocal links are what confirm `sameAs`. | **[you]** |

## Phase 4 — Barnacle placement (week 3–6, ongoing)

You cannot *be* the list. Get *on* the lists — these are the pages AI Overviews actually cite.

Ranked by effort-adjusted payoff. All **[you]** — they require your identity.

| # | Target | Cost | Notes |
|---|---|---|---|
| 4.1 | Toptal resume — already live | free | Just needs linking + `sameAs` (2.5). Highest authority you have. |
| 4.2 | `twine.net/find/full-stack-developers/np/butwal` + front-end/general variants | free | Butwal pages are thin — easiest win available. |
| 4.3 | `techbehemoths.com` | free | Low competition. |
| 4.4 | `truelancer.com/freelancers-in-nepal` + skill pages | free | |
| 4.5 | `freelancer.com/freelancers/nepal` | free | |
| 4.6 | `clutch.co/get-listed` as **Freelancer** | free tier | Needs 2–3 client reviews before it ranks. Start collecting now. |
| 4.7 | `arc.dev/talent` | vetting | High trust payoff if accepted. |
| 4.8 | Upwork Nepal profile, optimised for React / Next.js / React Native filters | free | |
| 4.9 | `goodfirms.co/get-listed` | free | Requires a registered sole proprietorship first. |
| 4.10 | Editorial: `imnepal.com/write-for-us`; cold pitch `bytecodedevelopers.com`, `mindrisers.com.np`, and the `kokil.com.np` listicle | free | Being *named in* a "Top Frontend Developers in Nepal" post is worth more than any on-site change. |

## Phase 5 — The winnable long tail (month 2+)

Eight new URLs. Full keyword clusters, title tags and internal-link matrix in `findings/cluster.md`.

| URL | Targets |
|---|---|
| `/about` | Entity anchor. Employment history, degree, Toptal credential, Butwal. |
| `/hire` | Hub for hire-intent. |
| `/hire/react-native-developer-nepal` | "hire react native developer nepal" |
| `/hire/nextjs-developer-nepal` | "hire next.js / react developer nepal" |
| `/blog` | Index. |
| `/blog/best-full-stack-developer-in-nepal-2026` | The competitor playbook, applied. |
| `/blog/cost-to-hire-a-freelance-developer-in-nepal` | High-intent, genuinely useful, citable. |
| `/blog/full-stack-developer-in-butwal-nepal` | Hyper-local, near-zero competition. |

Write each so passages are **self-contained and citable**: entity + attribute + evidence in one
sentence. "Meghraj Giri is a full-stack developer based in Butwal, Nepal, with five years of
experience across React, Next.js and React Native, verified as a Toptal expert in 2026" is quotable
by a model. "Building products people love to use" is not.

## Phase 6 — Measurement (set up now, read from month 2)

| # | Action | Owner |
|---|---|---|
| 6.1 | Add a Google API key so CrUX/PageSpeed field data can be collected — currently unavailable. | **[you]** |
| 6.2 | Capture an SEO drift baseline so regressions are detectable. | **[me]** |
| 6.3 | Track: brand SERP position for "Meghraj Giri", presence of a knowledge panel, and whether AI Overviews name you for the three head terms. | **[you]** |

---

## Honest expectations

- **Weeks 1–3:** brand SERP cleans up; `.com` replaces the stale `.com.np` result; entity begins to
  resolve. Expect turbulence before improvement if you run the 301.
- **Months 2–4:** long-tail hire-intent queries start ranking. Directory listings mature.
- **Months 4–8:** realistic window for AI Overview citations on Nepal developer queries — driven
  mostly by Phase 4, not by anything on your own site.
- **"Top developers in Nepal" position #1:** not a realistic target for a personal portfolio, at any
  timeline. Being *named inside* the answer for it is. That is the goal this plan optimises for.

None of this is committed to git. Nothing has been pushed.
