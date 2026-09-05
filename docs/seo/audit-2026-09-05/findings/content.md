# Content Quality & E-E-A-T Audit — meghrajgiri.com
Audited: 2026-09-05 · 9 URLs · Builds on `../CONTEXT.md` crawl data (not re-verified)

## Content Quality Score: 34/100

This is a low score for a site with a genuinely strong underlying professional record. The gap
is not "the developer lacks a story" — it's that almost none of the verifiable story has been
published. Compounding that, one live project page is shipping unfinished template/brief text to
users and crawlers (see §1, Cannabiz Elite).

---

## 1. Thin content — project pages (109–377 words each)

All 7 project pages follow the same shallow template: category chip → status chip → year →
1–3 sentence description → tech stack tag list → 2–3 "Key Highlights" tags → "Screenshots"
(no images render as content, just a label) → generic footer. None contain a role/responsibility
statement, a timeline, a client, a problem statement, or an outcome metric, with two partial
exceptions (Yume, College Cost Secrets — see below).

| Project | Words | What's present | What's missing for a real case study |
|---|---|---|---|
| Khatapata (109w) | Shortest page. One descriptive sentence: *"Inventory Management System (PWA) for Small Businesses"* + tag list (PWA, Inventory tracking, Todo lists, Expense Tracking, Live Dashboard, Multi currency). | No role, no client, no user count, no before/after, no problem statement. Reads as a feature list, not a case study. | Who used it, how many, what it replaced, load/perf numbers, dev's specific contribution vs. team. |
| College Cost Secrets (138w) | Best-attributed page. States the dev's actual scope: *"Developed the subscriber dashboard, financial planning tools, and client portal using React and Next.js."* Cites a real third-party metric: *"The platform serves families that have collectively saved $100M in college expenses, with a Kevin Harrington endorsement and 15+ years of operation."* | The $100M figure is the *client's* lifetime business metric, not something the developer produced — it's not disambiguated, so it reads as if the developer is claiming credit for a $100M outcome. No dates worked, no dashboard-specific metric (e.g., load time, adoption), no link/citation for the Kevin Harrington claim. |
| Yume (146w) | Best metrics on the whole site: *"Delivered 10K+ users and 25%+ paying conversion rate within 3 months of launch. The app was acquired by National Debt Relief within 6 months."* | Still no stated role (built solo? with a team?), no dates, no link to verify the acquisition claim, no retrospective/lesson-learned. |
| Bookvid (167w) | Feature description only: *"Bookvid is a platform that facilitates the booking and managing of digital events and video sessions..."* | Zero metrics anywhere on this page — yet CONTEXT.md's Toptal resume has a concrete Bookvid stat (*+35% user adoption, +25% retention*) that is **not on the site at all**. This is the clearest missed opportunity: real metric exists, isn't published. |
| Lyve (152w) | Marketing-voice description: *"streamlines these transactions with a 100% guarantee on both purchases and sales"* | "100% guarantee" is a business/legal claim with no substantiation and no relevance to the developer's engineering contribution. No metrics, no role, no dates. |
| Thriftverse (183w) | Most technically specific description (eSewa checkout, Nepal Can Move logistics, subdomain provisioning). | No metrics, no role/ownership statement, no dates beyond "2026," no scale numbers (merchants onboarded, orders processed). |
| **Cannabiz Elite (377w) — CRITICAL** | Longest page by word count, but only because it is **shipping unfinished bracketed placeholder/brief text as live copy**. Verbatim, currently live and crawlable: | See below — this is a severe finding, not a "missing metrics" finding. |

### 1a. Cannabiz Elite is publishing draft instructions, not content

The `/projects/cannabiz-elite` page contains editorial-brief placeholders left in production. Exact quotes pulled from the live HTML:

> "Cannabiz Elite is a clinic management system for Australian cannabis and telehealth clinics, built on Medusa v2 and shipped in **[N weeks]**. The hardest part was not the application — it was **[specific constraint]**, which required **[specific solution]**."

> "**[N]** Weeks to launch **[N]** Clinics onboarded **[N]** Consults processed"

> "The constraint **[Australian telehealth is not a normal build. Describe what AHPRA, the Privacy Act and national prescribing infrastructure actually demanded of this system.]**"

> "The problem **[State it concretely, in the clinic's terms rather than technical ones.]**"

> "Approach and key decisions **[Why Medusa v2. Why the data model looks the way it does. What was deliberately excluded from v1.]**"

> "Integrations **[Named, with what each one demanded in practice. Pending clearance.]**"

> "Results **[Measurable outcomes. If commercial metrics are not publishable, use delivery facts — shipped in N weeks, N clinics, N consults.]**"

> "What I would do differently **[The retrospective. This section does more for credibility than any other on the page.]**"

This is the single most damaging content finding on the site. It is not a word-count problem, it is
a **published-in-error** problem: literal instructions-to-self ("Pending clearance," "This section
does more for credibility than any other on the page") are indexable, crawlable by every AI bot
listed in robots.txt, and visible to any human visitor who clicks the project. It actively signals
the opposite of care/craftsmanship — the exact inverse of what a "product-minded" developer's
portfolio should demonstrate. **Fix immediately, independent of any other recommendation in this
audit** — either unpublish the page or replace the brackets with real content before the next crawl.

Secondary accuracy flag on the same page: the "Key Highlights" tag list includes **"HIPAA
compliance"** for an *Australian* cannabis/telehealth clinic. HIPAA is US federal law and has no
jurisdiction here — the page's own unfilled placeholder text asks the author to describe "what
AHPRA, the Privacy Act and national prescribing infrastructure actually demanded," which is the
correct Australian framework. Shipping "HIPAA" as a tag while the body text acknowledges AHPRA/
Privacy Act is the applicable regime is a factual inaccuracy that undercuts the "technical
accuracy" component of Expertise.

### 1b. What a metric-bearing case study needs (template gap, all 7 pages)

None of the 7 pages currently answer: (1) the developer's specific role/ownership on a team vs.
solo, (2) start/end dates or duration, (3) team size, (4) a before/after or magnitude metric tied
to the developer's own work (not just the client's business), (5) a named or generalized
constraint/problem the developer solved, (6) a retrospective/lesson learned. The Toptal resume
(per CONTEXT.md) already contains exactly this kind of material — e.g. *"custom UI components
-30% feature time," "SSR -30% initial load," "admin panel 5x load-time reduction," "95%
on-time delivery, +30% sprint efficiency," "Bookvid +35% user adoption, +25% retention"* — and
none of it appears on any of the 7 live project pages. This is a content-production problem, not a
missing-facts problem: the raw material to close the gap already exists off-site.

---

## 2. E-E-A-T gaps: verifiable off-site record vs. what's on the site

Cross-referencing the Toptal resume facts in CONTEXT.md against the crawled site body copy:

| Signal | On Toptal resume | On the site | Verdict |
|---|---|---|---|
| Employer #1 | SCSS Consulting, Full-stack Dev, 2025–present | Not named anywhere. Only a bare, unexplained stat "5 roles" | Absent |
| Employer #2 | Inseed Tech, React Native Dev, 2024–2026 | Not named | Absent |
| Employer #3 | Gurzu Inc, Software Engineer, 2023–2024 | Not named | Absent |
| Employer #4 | Prabidhi Labs, React Dev, 2022–2023 | Not named | Absent |
| Employer #5 | Lightweb Group, React Dev, 2021 | Not named | Absent |
| Education | BSc CSIT, Institute of Science and Technology (IOST), **Tribhuvan University**, Kathmandu (2019–2023) | Site shows only the stat tile *"BSc CSIT Nepal"* — no institution name, no university, no dates | Degraded: institution/university identity is stripped out, which is exactly the detail a citation-hungry AI answer or a Nepali user would want ("which university?") |
| Secondary schooling | Kalika Manavgyan Secondary School, Butwal (2017–2019) | Not present | Absent |
| Certification | freeCodeCamp — JavaScript Algorithms and Data Structures (July 2023) | Site shows only *"2 qualifications"* as an unlabeled stat | Absent (the number exists, the credential itself does not) |
| Toptal "Verified Expert" credential | Verified Expert in Engineering, HTML5 Developer, member since 2026-03-10 | Not linked, not mentioned, not in `sameAs` (schema.ts confirmed missing per CONTEXT.md) | Absent — this is the single highest-authority third-party trust signal available and it is completely unused |
| Location specificity | Butwal, Mid-Western Development Region, Nepal | Site says only "Nepal (Remote)" / "Based Nepal (Remote)" — no city | Degraded — city-level geo signal (Butwal), which matters directly for "developers in Nepal" query intent, is present on Toptal but stripped from the site |
| Years of experience | 5+ years (matches) | *"5+ Years in tech"* stat tile | Matches — one of the only signals that is consistent |
| Quantified impact metrics | -40% dev time (reusable components), -30% feature time (custom UI), -30% initial load (SSR), 5x admin panel load-time reduction, 95% on-time delivery / +30% sprint efficiency, Bookvid +35% adoption / +25% retention | **None of these six metrics appear anywhere in the 9 crawled pages.** Only two comparable numbers exist on-site at all: Yume's "10K+ users / 25%+ paying conversion / 3 months / 6-month acquisition" and College Cost Secrets' client-level "$100M saved" | Near-total absence — this is the biggest single lever available: the resume already has hard, credible, quotable numbers and the site has almost none of them |

### E-E-A-T factor breakdown (this skill's internal weighting)

- **Experience — 25/100 (weight 20%).** The About section is written in first person and
  describes a real-sounding career pivot ("I started as a traditional developer obsessed with
  clean code... I quickly realized that beautiful architecture without user impact is just
  technical debt"), which is a first-hand narrative voice. But it is entirely unanchored: no
  named employer, no named project, no date, no artifact. It reads as generically plausible for
  any mid-level developer, not as evidence this specific person lived it. Zero named client logos,
  zero screenshots that resolve to real content (project pages label a "Screenshots" section that
  renders nothing per the raw text extraction), zero case-study specificity outside Yume and
  College Cost Secrets.

- **Expertise — 20/100 (weight 25%).** No author bio with credentials rendered anywhere in the
  body. Institution name (Tribhuvan University / IOST) present on Toptal, absent on-site.
  Certification (freeCodeCamp) reduced to an anonymous "2 qualifications" stat. Compounding this,
  the site's one long-form technical page (Cannabiz Elite) currently contains a live factual
  inaccuracy (HIPAA tag for an Australian clinic) plus visible unfinished draft text — both are
  direct hits against "technical accuracy," the core of this factor.

- **Authoritativeness — 15/100 (weight 25%).** The Toptal "Verified Expert" credential — a
  third-party vetting signal from a recognized, hard-to-obtain, industry-known network — is not
  linked from the site, not in `sameAs`, not mentioned in body copy anywhere in the 9 pages. No
  named employers to search/verify against (Gurzu Inc, Prabidhi Labs etc. are all discoverable,
  real companies per CONTEXT.md — none are named). No press mentions, no external citations, no
  backlinks-worthy assets. CONTEXT.md's SERP data confirms this concretely: the Toptal profile
  does not surface for the brand query, and the query itself resolves to unrelated Wikipedia
  entities.

- **Trustworthiness — 20/100 (weight 30%, the largest single weight).** Contact info is genuinely
  good and concrete (see §5). But: (a) no About *page* exists, only an anchor section on the
  homepage, so there's no dedicated, linkable "who is this and why should I trust them" URL; (b)
  a live project page currently contains admittedly-unfinished draft text with a note reading
  "Pending clearance" — this is the opposite of a trust signal; (c) unexplained/unverifiable bare
  numeric claims ("20+ Products Shipped" vs. only 7 projects displayed, 6 marked "Completed" — a
  ~3x unexplained gap) undermine confidence in every other number on the page; (d) security
  headers are missing per CONTEXT.md (no CSP, X-Frame-Options, etc.) — a technical trust signal,
  not a content one, but it compounds the same "diligence" impression; (e) the unresolved
  `.com.np` duplicate with stale title/description (per CONTEXT.md) means a visitor or crawler can
  land on outdated, unmaintained content and reasonably conclude the canonical site is also
  unmaintained.

**Weighted overall E-E-A-T score: (25×0.20)+(20×0.25)+(15×0.25)+(20×0.30) = 5.0+5.0+3.75+6.0 = 19.75/100**

---

## 3. Missing page types / structural gaps for a consultant-positioned site

- **No dedicated About URL.** "About" is a same-page anchor (`#about`) on the homepage, not a
  linkable page. There is no `/about` route in the 9 crawled URLs.
- **No dedicated Contact URL.** Same pattern — `#contact` anchor only, no `/contact` route.
- **No Services page**, despite the primary nav literally containing a link labeled "Services."
  Confirmed in the raw HTML: `<a href="#expertise">Services</a>` — the link target `#expertise`
  does not exist anywhere in the page's `id` attributes (`grep -oE 'id="[a-zA-Z-]+"'` on the
  homepage returns only `about`, `contact`, `contact-email`, `contact-message`, `contact-name`,
  `contact-subject`, `featured-work`, `skills` — **no `id="expertise"`**). This is a dead/broken
  in-page anchor on primary nav, on every one of the 9 pages (the same nav renders site-wide).
- **No Journey section**, same failure mode: `<a href="#journey">Journey</a>` exists in nav, no
  `id="journey"` exists anywhere on the homepage. For a "solo developer wants to show 5 named
  roles" use case, "Journey" is exactly where an employment timeline belongs — the nav promises
  it, the page doesn't have it.
- **Testimonials render nothing.** Confirmed via RSC payload: `TestimonialsSection` is a real,
  loaded component (`"app/(site)/page.tsx -> @/components/sections/TestimonialsSection"`) sitting
  in the component tree between AboutSection and SkillsSection, but the plain-text extraction of
  the fully rendered homepage contains zero testimonial content, zero quotes, zero client names.
  This is a shipped/wired-up feature producing no visible output — the same failure pattern as the
  Cannabiz Elite placeholders: infrastructure exists, content does not.
- **No experience/employment history anywhere in the 9 URLs.** The homepage promises a count
  ("5 roles · 2 qualifications") but never lists what the 5 roles are. This is the same
  "unsubstantiated stat" pattern flagged in §2 — worse for AI citation, since a stat with zero
  supporting detail is not a fact an AI system can safely restate or attribute.

Net effect: three of six primary nav items (Services, Journey, and — depending on how "Work"
routes — arguably testimonials as a sub-element of About) point at content that does not exist.
For a single-page-app style site this reads to both users and crawlers as unfinished.

---

## 4. Readability and first-person credibility (homepage copy)

Manual Flesch/Flesch-Kincaid computation over the Hero + About prose (161 words, 12 sentences,
excluding nav/stat chrome):

- Avg sentence length: **13.4 words** (short, good for scanability)
- Flesch Reading Ease: **45.6** → "Difficult" band (college-level), driven by multisyllabic
  jargon (*scalability, architecture, product-focused, GraphQL, MVP validation*) rather than
  sentence complexity
- Flesch-Kincaid Grade Level: **10.2**

Verdict: sentence structure is fine (short, direct), but word choice skews toward
startup-jargon register ("product mindset," "technical debt," "user outcomes," "solid
engineering") that reads as generic SaaS-marketing voice rather than a specific, personal voice.
This matters for both readability and E-E-A-T: an AI system or a human reader cannot distinguish
this copy from thousands of other developer-portfolio "product mindset" bios.

First-person signal is present and genuinely used throughout About ("I started...", "I quickly
realized...", "I specialize...", "I'm particularly excited...") — 8 of the section's ~12
sentences are first-person "I" statements, which is a correct structural choice for an Experience
signal. The failure is not voice, it's specificity: every one of those "I" statements is a general
claim about approach/philosophy, never tied to a name, date, or number. Contrast the vague
version actually on the page —

> "That shift changed everything."

— against what a specificity-anchored equivalent would need to look like (using the resume data
already available per CONTEXT.md): *"At Gurzu Inc in 2023, cutting admin-panel load time 5x
changed how I thought about performance work."* The raw material for the second version already
exists off-site; the first version is what's actually published.

---

## 5. AI citation readiness

Robots/AI-bot access is fully open (per CONTEXT.md: GPTBot, OAI-SearchBot, PerplexityBot,
ClaudeBot, Google-Extended, Bingbot all 200). The gating factor is not access, it's whether the
copy contains self-contained, attributable, quotable facts. Both patterns exist on the page,
in stark contrast to each other:

**Self-contained, citable (good) — real quotes from the crawl:**
- *"Delivered 10K+ users and 25%+ paying conversion rate within 3 months of launch. The app was
  acquired by National Debt Relief within 6 months."* (Yume project page) — specific numbers,
  specific timeframe, specific named acquirer. An AI system could restate this verbatim as an
  attributed fact.
- *"Developed the subscriber dashboard, financial planning tools, and client portal using React
  and Next.js."* (College Cost Secrets) — specific, attributable role statement.
- Contact block: *"Email meghrajgiri56@gmail.com … Phone +977-9804410241 … Based Nepal (Remote)
  … Usually within 24 hours … 9 AM — 6 PM (UTC +5:45)"* — fully self-contained, answerable facts
  (good for "how do I contact/hire Meghraj Giri" style AI queries).
- The Tech Stack list ("Frontend HTML5 React Next.js TypeScript Tailwind CSS JavaScript Vue.js
  Backend Python PostgreSQL MongoDB Express.js FastAPI Redis GraphQL Tools & Cloud Kubernetes AWS
  Docker Git Figma Vercel VS Code") — enumerable, unambiguous, quotable as-is.

**Vague, non-citable (bad) — real quotes from the crawl:**
- *"Building products people love to use"* (H1) — no entity, no location, no keyword; could be
  the H1 of almost any developer portfolio on the internet. Not attributable to "Nepal" or
  "full-stack" in any extractable way.
- *"I help startups and product teams turn ideas into fast, scalable web and mobile
  applications. From MVP validation to production growth, I focus on what matters: user
  experience, performance, and business outcomes."* — zero nouns an AI system could safely quote
  as fact; every clause is a category claim, not a specific one.
- *"I'm particularly excited about products at the intersection of great design and solid
  engineering. That's where real magic happens—and where I love to work."* — pure sentiment,
  unquotable, unfalsifiable, and reduces trust if surfaced verbatim in an AI answer (sounds like
  filler, not evidence).
- *"5 roles · 2 qualifications"* — presented as a stat but is not self-contained: an AI system
  cannot cite "5 roles" without knowing what they are, so this number is currently useless for
  citation despite looking like data.
- *"20+ Products shipped"* vs. only 6 "Completed" + 1 "In Progress" project actually shown across
  the 7 project pages — an unresolvable ~3x discrepancy that an AI system summarizing the site
  would either have to flag as inconsistent or silently drop; either outcome hurts citability of
  every other number on the page.

**Structural note for AI extraction:** the `/projects` listing page's own intro copy is stale
relative to its filter chips — it reads *"Innovative solutions across Fin-Tech, Ed-Tech,
E-Commerce, and Web3 industries"* while the actual category filters rendered on the same page are
*"E-Commerce, Healthcare, Fin-Tech, Ed-Tech, Other"* (no Web3 project exists anywhere in the 7;
"Healthcare" — the Cannabiz Elite category — isn't mentioned in the intro sentence at all). Small,
but it's another instance of the same pattern as Cannabiz Elite's placeholders: copy that wasn't
updated when the underlying data changed.

---

## Dual-goal judgment: "Nepal developer" findability + international startup positioning

The additive strategy (per CONTEXT.md) is achievable, but the current copy under-serves *both*
goals simultaneously rather than serving the international one well and the Nepal one poorly:

- For the **international/startup** goal: the "product mindset" narrative voice is directionally
  right but too generic to differentiate against any other portfolio using the same SaaS-founder
  register; the metrics that would prove the pitch (5x load-time reduction, +35% adoption on a
  named platform, 95% on-time delivery) exist on Toptal and are simply not deployed here.
- For the **Nepal/local** goal: the site actively strips out the most locally-relevant fact it
  has access to — city-level location. Toptal states "Butwal, Mid-Western Development Region,
  Nepal"; the site states only "Nepal (Remote)." A query like "developers in Butwal" or "Nepal
  full-stack developer" benefits from the city being present in body copy and schema
  (`addressLocality` is currently just `"Nepal"` per CONTEXT.md, with no `addressRegion` or
  `addressLocality` at city granularity).
- Both goals are blocked by the same missing infrastructure: no About/Contact/Services pages to
  target either "hire a Nepal developer" or "product-minded startup partner" search intent
  separately, and no employment history that would let either a Nepali recruiter or an
  international founder verify the "5 roles" claim against real, named, checkable companies.

---

## Priority fixes (content-only, ordered by leverage)

1. **Unpublish or finish `/projects/cannabiz-elite`** — it currently contains bracketed draft
   instructions and an internal note ("Pending clearance") live in production. This is urgent
   independent of everything else in this audit.
2. **Fix the HIPAA/AHPRA factual error** on the same page once rewritten.
3. **Port the six quantified metrics already on the Toptal resume** (-40% dev time, -30% feature
   time, -30% initial load, 5x admin-panel load-time reduction, 95% on-time delivery / +30% sprint
   efficiency, Bookvid +35% adoption / +25% retention) into the relevant project pages and/or a
   new Experience/Journey section — the raw material already exists, it just isn't published.
4. **Build the "Journey" section the nav already promises**, listing the 5 named employers with
   dates — this single change fixes a broken nav link, substantiates the "5 roles" stat, and adds
   Authoritativeness signal (named, verifiable companies) in one move.
5. **Add the Toptal "Verified Expert" credential** to body copy and `sameAs` — highest-authority
   third-party signal available, currently unused anywhere.
6. **Either populate or remove the Testimonials component** — it currently loads and renders
   nothing.
7. **Add city-level location** ("Butwal, Nepal") to visible copy, not just "Nepal (Remote)" — this
   is a zero-cost lever for the Nepal-query goal.
8. **Reconcile "20+ Products shipped" against the 7 displayed projects**, or provide the missing
   projects/evidence — an unexplained 3x gap undermines every other number on the site.
9. **Split About/Contact/Services out to dedicated, linkable routes** — currently anchors only,
   which limits both internal linking and AI/LLM citation of a specific, addressable "who is this"
   URL.

---

*Findings sources: `page_.html`, `page_projects.html`, `page_projects_thriftverse.html`,
`page_projects_cannabiz-elite.html`, `page_projects_lyve.html`, `page_projects_khatapata.html`,
`page_projects_college-cost-secrets.html`, `page_projects_bookvid.html`,
`page_projects_yume.html`, `home_text.txt`, and `../CONTEXT.md` (crawl/schema/resume facts, not
re-verified in this pass).*
