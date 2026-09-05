# Nepal Developer Keyword/Opportunity Map — meghrajgiri.com
Collected 2026-09-05. Builds on `scratchpad/audit/CONTEXT.md` (site inventory, resume, and
already-verified SERPs for the three head terms — those three are NOT re-verified here).

## Methodology note (read before using any number in this doc)
No DataForSEO / keyword-volume API and no `claude-seo` runtime were available in this session.
Every volume, rate, and "SERP shape" claim below comes from **qualitative WebSearch review**
(reading result titles/snippets and, for a few, fetching pages), not from measured search
volume, click, or ranking-position data. Treat all "high/medium/low" and NPR/USD rate figures
as **directional estimates for prioritization only** — verify with a real keyword tool (Ahrefs,
GSC, or DataForSEO once available) before betting a content calendar on exact numbers. A full
pairwise SERP-overlap scoring pass (the formal `seo-cluster` methodology) was not run; clustering
below is by qualitative SERP shape and intent, which is sufficient for a solo operator's
prioritization but not a substitute for the scored methodology once tooling exists.

---

## A. THE BARNACLE MAP

The three head terms and their close variants are **100% list/directory SERPs**. There is no
scenario where a single portfolio page outranks Clutch/GoodFirms/Twine for "top developers in
Nepal." The only lever is to **get onto the lists** (barnacle SEO) and to **win the individual-hire
long tail** the lists don't serve well (Section B).

### Directory / marketplace targets (can list as an individual)

| # | Domain / URL | Individual freelancer allowed? | How to get listed | Difficulty |
|---|---|---|---|---|
| 1 | `toptal.com/developers/resume/meghraj-giri` (already exists) | Yes — already has this profile | Already live. Action needed: link it from the site (nav/footer/about), add to Person `sameAs` in schema. This is the single highest-authority asset currently sitting **unused** per CONTEXT.md. | Trivial (already done, just needs linking) |
| 2 | `twine.net/find/developers/np`, `/find/front-end-developers/np`, `/find/full-stack-developers/np`, `/find/full-stack-developers/np/butwal` | Yes | Free signup at `twine.net/signup`, build profile + portfolio, appears automatically in country/city/skill-filtered pages | Low — the Butwal-specific page already exists and is thin; an actual Butwal dev filling out a real profile can plausibly win it fast |
| 3 | `techbehemoths.com` | Yes, freelancers accepted | "Get Listed" → claim/create profile at `techbehemoths.com/companies/get-listed`, no proof-of-registration enforced, free | Low |
| 4 | `truelancer.com/freelancers-in-nepal`, `/reactjs-freelancers-in-nepal`, `/react-native-freelancers-in-nepal` | Yes | Free profile creation, tag skills, appears on filtered listing pages | Low |
| 5 | `freelancer.com/freelancers/nepal`, `/freelancers/nepal/full-stack-development` | Yes | Free signup, standard freelancer profile | Low |
| 6 | `clutch.co/np/developers`, `clutch.co/np/app-developers` | Yes — confirmed precedent: [Harshil Khimasia's profile](https://clutch.co/profile/harshil-khimasia-freelance-web-developer) is listed as "Freelance Web Developer," proving Clutch accepts solo freelancers, not just incorporated agencies | `clutch.co/get-listed` → choose "Freelancer" as business type → sign in via LinkedIn/Google/company email → Basic tier is free, Verified/Advertiser are paid upsells | Medium — free listing is easy, but **ranking inside** the directory needs 2-3 real client reviews, which take lead time to collect |
| 7 | `upwork.com/hire/front-end-developers/np/`, `/react-native-developers/np/`, `/react-js-developers/np/`, `/next.js-freelancers/np/` | Yes, indirectly | No "add me to this page" mechanism — these are algorithmic pages populated by Upwork's own freelancer index. Join as a freelancer, complete profile + skill tests + Nepal location, and Upwork's index will surface you on the matching filtered page over time | Medium — requires job-history/tests to rank inside Upwork's own algorithm, slow to build |
| 8 | `arc.dev/remote-freelance-developers/nepal/reactjs`, `/nepal/react-native`, `/nepal/front-end` | Yes, application/vetting-gated | Apply at `arc.dev/talent`; vetting = profile review + English/communication check + technical interview; Arc states accepted candidates are "top 2%" | Medium-high effort, but high payoff — being featured is itself a citable, high-trust credential (useful for AI-answer sourcing, not just clicks) |
| 9 | `goodfirms.co/directory/country/top-software-development-companies/nepal`, `goodfirms.co/company/freelancers` | Conditional | GoodFirms' own eligibility help page states the business "needs to be legally registered and have an official website" — a personal portfolio site likely satisfies "official website," but the registration requirement means an individual should register a simple sole-proprietorship/firm (common and cheap in Nepal, PAN + firm registration) before applying at `goodfirms.co/get-listed` | Medium-high (registration friction) |
| 10 | Editorial/outreach: `imnepal.com/write-for-us` (Nepali general blog, has a Technology category and explicitly solicits contributor pitches), plus cold outreach to `bytecodedevelopers.com/blog/hire-best-software-developers-in-nepal` and `mindrisers.com.np/blogs/best-freelance-websites-for-nepali-developer-in-2025` requesting inclusion/mention | Yes, via pitch | Email pitch with a specific angle (e.g., "hiring a freelance full-stack dev in Nepal" guide, with an author-bio backlink) | Medium — acceptance criteria weren't published/confirmed; treat as a speculative outreach line, not a guaranteed placement |

### Important non-targets: solo-developer competitors, not "barnacles"

These are **not** places Meghraj can get listed — they are individual Nepali developers already
running the exact self-branding playbook this report recommends in Section C. They currently
occupy real SERP space for several of the long-tail terms Meghraj wants, and should be treated
as **competitive precedent to copy**, not outreach targets:

- `kokil.com.np` (Kokil Thapa) — a personal site publishing self-titled listicles that rank:
  "Top Frontend Developers in Nepal for Modern UI/UX Design," "Full Stack Developer in Nepal
  2026 — Hire Kokil Thapa," "Best Backend Developer in Nepal for API-Driven Systems,"
  "Freelance Developer Hourly Rate Nepal 2026," "Remote Freelance Developer Nepal 2026." This
  is the single most important competitive finding: **a solo dev's own blog, using
  "[Role] Developer in Nepal [Year]" title patterns, is already ranking for exactly the terms
  Meghraj wants.** The template is directly copyable (Section C).
- `sarojdangol012.com.np` — "Best Individual Web Developer in Nepal 2026: Lalitpur & Kathmandu"
- `aditya-gupta.com.np/blogs/16` — "Top Freelance Web Developer in Kathmandu, Nepal: A Portfolio Guide"
- `ashimgautam01.com.np` — ranks for "freelance next.js developer nepal"
- `samikshyakafle.com.np`, `ujjwall.com.np` — two other Butwal-based full-stack devs whose
  personal sites already surface for "full stack developer butwal." This means Meghraj's own
  hyper-local city term has **two live competitors** using this exact tactic today; the window
  to compete is open but not empty.

### SERP-occupying but not people-facing (monitor, don't target)
`necojobs.com.np` and `kumarijob.com` salary-guide posts ("Full Stack Developer Salary in Nepal
2026") absorb informational SERP real-estate on "full stack developers in nepal" variants but
serve job-seekers, not hiring clients — low priority.

### Top 10 barnacle targets, ranked by effort-adjusted payoff
1. Toptal profile → link + add to schema `sameAs` (near-zero effort, already exists)
2. Twine.net (general + front-end + full-stack + **Butwal city page**, which is thin today)
3. TechBehemoths (free, low competition among individuals)
4. Truelancer.com Nepal + skill-tagged pages
5. Freelancer.com Nepal profile
6. Clutch.co freelancer-type listing (start now — reviews take lead time to accrue)
7. Arc.dev application for React/React Native/Front-End Nepal pages (start now — vetting takes time)
8. Upwork Nepal profile, optimized for React/Next.js/React Native filters
9. GoodFirms, after registering a lightweight sole-proprietorship/firm
10. Editorial outreach to imnepal.com (write-for-us) + cold pitch to bytecodedevelopers.com / mindrisers.com.np

---

## B. THE WINNABLE LONG TAIL

37 queries with individual-hire intent, grouped into 7 clusters by intent + observed SERP shape.
Volumes are not measured (see methodology note) — clusters are ordered roughly by realistic
near-term winnability, not by assumed traffic.

### Cluster 1 — Hyper-local (Butwal) hire intent
SERP shape: thin — only 2 known competitor personal sites (Samikshya Kafle, Ujjwal Bhandari) plus
a mostly-empty Twine city page. **Lowest competition cluster available.**
Target page type: a location-specific hire/landing page.
1. full stack developer butwal
2. react developer butwal nepal
3. next.js developer butwal
4. hire developer in butwal
5. web developer butwal nepal
6. freelance developer butwal

### Cluster 2 — Skill + Nepal hire/freelance (transactional)
SERP shape: Upwork/Truelancer/Freelancer.com marketplace "hire" pages dominate, but individual
personal sites do break through (`ashimgautam01.com.np` ranks for the Next.js variant already).
Target page type: dedicated "Hire Me" / services page(s), one per specialty stack.
7. hire react native developer nepal
8. hire next.js developer nepal
9. freelance next.js developer nepal
10. freelance react developer nepal
11. nepal react developer for hire
12. hire full stack developer nepal for startup
13. hire remote developer nepal
14. react native app developer nepal for hire
15. hire mern stack developer nepal

### Cluster 3 — "Best/top individual developer" self-branding (proven-winnable pattern)
SERP shape: currently won by solo devs self-publishing "Best/Top [Role] Developer in Nepal
[Year]" posts about themselves (kokil.com.np, sarojdangol012.com.np, aditya-gupta.com.np — see
Section A). Zero real competitive moat; whoever refreshes the content wins.
Target page type: first-person listicle/guide blog post, refreshed yearly.
16. best individual web developer in nepal
17. best full stack developer in nepal 2026
18. best react native developer in nepal
19. best frontend developer in nepal for startups
20. top freelance web developer in nepal
21. best next.js developer in nepal

### Cluster 4 — Rate / cost / pricing (commercial investigation)
SERP shape: dominated by `necojobs.com.np`/`kumarijob.com` salary-for-employee guides and
`kokil.com.np`'s freelance-rate guide. Gap: most content is framed for job-seekers, not for a
client trying to budget a freelance hire.
Target page type: client-facing pricing/rate guide, ends in a hire CTA.
22. nepal react developer hourly rate
23. freelance developer rate nepal
24. cost to hire a developer in nepal
25. react developer cost nepal vs india
26. how much does a freelance developer cost in nepal

### Cluster 5 — Skill/portfolio proof (supports E-E-A-T, not direct hire intent)
SERP shape: weak, mostly agency portfolio pages; no dedicated URLs needed — strengthen existing
`/projects/*` pages instead of creating new ones.
27. react native developer nepal portfolio
28. next.js developer nepal case study
29. top react native apps built in nepal
30. nepal developer github projects

### Cluster 6 — Credential/Toptal-adjacent (near-zero competition, low volume, high trust)
Target page type: About/credentials section, citation-ready for AI answers.
31. toptal developer nepal
32. toptal verified expert nepal
33. toptal nepal react native

### Cluster 7 — Natural-language "ask an AI" queries (AI-Overview/ChatGPT/Perplexity bait)
These mimic how people actually phrase questions to AI assistants rather than Google — worth
targeting with direct-answer content since AI citation, not classic ranking, is the goal here.
34. who is a good full stack developer in nepal
35. recommend a react native developer from nepal
36. is there a good frontend developer in butwal
37. who are the top individual developers in nepal (not agencies)

---

## C. THE CONTENT ARCHITECTURE

Realistic for one person: **8 new URLs total**, phased, reusing the existing `/`, `/projects`,
and 7 project pages as the portfolio-proof layer (Cluster 5 — no new URLs needed there, just
on-page copy tightening to add explicit Nepal/stack framing to titles and body copy).

### Hub
**`/hire`** — hub page. Title tag: `Hire a Full-Stack Developer in Nepal (Butwal-Based, Remote-Ready) | Meghraj Giri`
Cluster targeted: 1 + 2 (all hyper-local + skill/Nepal hire-intent queries land here via H2
sections for React, Next.js, React Native, MERN).
Reason it earns its place: consolidates every transactional "hire X developer nepal/butwal"
query onto one conversion-built page instead of diluting the international homepage pitch —
keeps the additive positioning intact per the user's confirmed decision.

### Spokes under `/hire`
**`/hire/react-native-developer-nepal`** — Title: `Hire a React Native Developer in Nepal | Meghraj Giri`
Cluster: 2 (React Native subset). Reason: matches Upwork's own stack-specific SERP page pattern
and is backed by a real portfolio proof point (Thriftverse — React Native e-commerce app).

**`/hire/nextjs-developer-nepal`** — Title: `Hire a Next.js Developer in Nepal | Meghraj Giri`
Cluster: 2 (Next.js subset). Reason: his own site + several project pages are Next.js builds;
this is his strongest, most defensible stack claim and mirrors a query pattern
(`freelance next.js developer nepal`) a competitor (ashimgautam01.com.np) already ranks for.

### Credential / E-E-A-T infrastructure
**`/about`** — Title: `About Meghraj Giri — Full-Stack Developer, Butwal, Nepal (Toptal Verified Expert)`
Cluster: 6 (Toptal-adjacent) + supports 3, 4, 7 as the citable bio AI answers can pull from.
Reason: fixes two gaps CONTEXT.md flags directly — no employment history anywhere on the site,
and the Toptal Verified Expert credential existing but unused. This page is infrastructure the
rest of the architecture depends on for credibility.

### Blog (new section)
**`/blog`** — Title: `Blog | Meghraj Giri — Notes on Building Products from Nepal`
Cluster: hub for 3, 4, 7. Reason: none of the self-branding/pricing/AI-bait clusters have
anywhere to live without a blog section; this is the minimum infrastructure to compete with the
kokil.com.np-style playbook.

**`/blog/best-full-stack-developer-in-nepal-2026`** — Title: `Best Full-Stack Developers in Nepal (2026 Guide) | Meghraj Giri`
Cluster: 3. Reason: directly replicates the proven, zero-moat pattern three competitors are
already winning with — refresh the year annually.

**`/blog/cost-to-hire-a-freelance-developer-in-nepal`** — Title: `How Much Does It Cost to Hire a Freelance Developer in Nepal? (2026 Rates)`
Cluster: 4. Reason: fills the identified gap between job-seeker salary guides and a genuine
client-facing pricing page that ends in a hire CTA.

**`/blog/full-stack-developer-in-butwal-nepal`** — Title: `Full-Stack Developer in Butwal, Nepal — Available for Remote & Startup Work`
Cluster: 1 + 7. Reason: directly contests the two known Butwal competitor personal sites on
their own hyper-local term while the field is still only two deep.

### Phasing (do not build all 8 at once)
Phase 1 (highest leverage, lowest effort): link the existing Toptal profile + ship `/about`.
Phase 2: `/hire` (the transactional hub) + tighten `/projects/*` titles/copy for Cluster 5.
Phase 3: `/blog` + the Butwal post (thinnest competition, fastest realistic win).
Phase 4: the two `/hire/*` stack spokes + remaining blog posts, plus the barnacle listings
from Section A (Twine/TechBehemoths/Truelancer first — lowest friction).

### Internal link matrix
- `/` (homepage) → `/hire`, `/about` (mandatory, both directions back to `/`)
- `/about` → `/hire`, Toptal profile (external), LinkedIn/GitHub (external)
- `/hire` → `/hire/react-native-developer-nepal`, `/hire/nextjs-developer-nepal`, `/about`,
  relevant `/projects/*` pages as proof (Thriftverse from the React Native spoke, etc.)
- Each `/hire/*` spoke → `/hire` (mandatory parent link), `/about`, 1-2 relevant `/projects/*` pages
- `/blog` → all three blog posts; each blog post → `/blog`, `/hire`, `/about` (every blog post
  must link back to the hub and the credential page — no orphans)
- `/projects/*` pages → add a link to `/hire` ("available for similar work — hire me") to close
  the loop from portfolio proof back to the transactional hub

### Cannibalization check
No two proposed URLs target the same primary query. `/hire` is broad-intent and the two `/hire/*`
spokes are stack-specific subsets, which is the standard hub/spoke split, not duplication.
`/blog/best-full-stack-developer-in-nepal-2026` (Cluster 3, self-branding/listicle framing) and
`/hire` (Cluster 2, direct hire-intent framing) target different query phrasing ("best X in Nepal"
vs. "hire X in Nepal") and different intents (informational/branding vs. transactional) despite
topical overlap — keep them differentiated in on-page framing to avoid the two competing in the
same SERP.
