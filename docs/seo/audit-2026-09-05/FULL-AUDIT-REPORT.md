# Full SEO + GEO Audit — meghrajgiri.com

**Date:** 2026-09-05
**Scope:** all 9 live URLs, plus off-site entity footprint
**Objective:** rank for "top developers in nepal", "frontend developers in nepal", "full-stack
developers in nepal", and be named in Google AI Overviews / ChatGPT / Perplexity answers
**Positioning (owner-confirmed):** additive — keep the international product-minded/startup pitch,
add explicit Nepal signals. Not a Nepal-only repositioning.

**SEO Health Score: 51 / 100**

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 62 |
| Content Quality | 23% | 34 |
| On-Page SEO | 20% | 48 |
| Schema / Structured Data | 10% | 55 |
| Performance (CWV) | 10% | 70 |
| AI Search Readiness | 10% | 38 |
| Images | 5% | 75 |

Detailed per-specialist findings live in `findings/` — `technical.md`, `content.md`, `schema.md`,
`geo.md`, `cluster.md`.

---

## 0. The strategic finding, stated first

**You cannot rank this site at #1 for "top developers in Nepal", and no amount of on-page work will
change that.** Verified: that SERP returns Clutch, GoodFirms and TechBehemoths; "frontend developers
in Nepal" returns Twine, Upwork and Truelancer. These are *list* queries with B2B vendor intent.
Google resolves them to "give me a directory of suppliers." A single person's portfolio is the wrong
document type for that intent and will not be promoted into it.

That is not a dead end, because **AI Overviews are assembled from those same directory and listicle
pages.** Your name appears in an AI answer when (a) you are present in the corpora those answers are
built from, and (b) your entity is resolvable enough that a model can attach claims to you with
confidence. Neither is true today.

So the strategy has three layers, in dependency order:

1. **Entity** — make "Meghraj Giri" resolve to one distinct, credentialed person.
2. **Barnacle** — get onto the third-party pages that already rank and already get cited.
3. **Long tail** — own the individual-hire queries a one-person site can genuinely win.

**And there is a proven local playbook you are not running.** `kokil.com.np`,
`sarojdangol012.com.np`, `aditya-gupta.com.np`, `ashimgautam01.com.np`, and the Butwal-based
`samikshyakafle.com.np` and `ujjwall.com.np` all rank for your target terms by publishing
"Best/Top [Role] Developer in Nepal [Year]" articles about themselves. They cannot be the list
either, so they became a list of one. It works, and it is directly copyable.

---

## 1. Critical — fix before anything else

### C1. A project page is publishing an unfilled template to the world

`/projects/cannabiz-elite` — your longest, most impressive case study — currently renders eight
placeholder blocks live:

> "…built on Medusa v2 and shipped in **[N weeks]**. The hardest part was not the application — it
> was **[specific constraint]**, which required **[specific solution]**."
>
> **[N]** Weeks to launch · **[N]** Clinics onboarded · **[N]** Consults processed
>
> The problem — **[State it concretely, in the clinic's terms rather than technical ones.]**
>
> Integrations — **[Named, with what each one demanded in practice. Pending clearance.]**
>
> What I would do differently — **[The retrospective. This section does more for credibility than
> any other on the page.]**

It is the only page affected (all 9 checked). Worse, **the placeholder also ships inside the
production JSON-LD**, in `CreativeWork.abstract` — so it is being fed to structured-data consumers
and AI crawlers, not just to human readers. Source: the `projects` section of the Supabase
`site_config`, mirrored at `src/config/fallback.json:314-349`.

Either finish the page or unpublish it. Nothing else in this audit matters more.

### C2. The canonical domain is not the domain Google is showing

A live search for `"Meghraj Giri" developer Nepal` returns **www.meghrajgiri.com.np** — not `.com` —
carrying a *stale* title ("Meghraj Giri - Full Stack Developer") and a stale description. `.com.np`
still returns HTTP 200 with full duplicate content and only a cross-domain canonical; there is no
301. `docs/seo/SEO-STRATEGY.md` flagged this on 2026-08-30 and it remains open.

A cross-domain canonical is a hint. A 301 is a directive. Until the redirect exists at the Vercel
domain level, your equity stays split and the stale URL keeps winning.

**Caveat you should weigh before pulling the trigger:** every competitor listed in §0 ranks on a
`.com.np` domain. For Nepal-intent queries that ccTLD is an asset. Consolidating on `.com` is still
the right call for a practice serving Australian and US clients — running two domains is strictly
worse than either one alone — but it does surrender a real local edge, and the 301 makes that
permanent. Decide deliberately, not by default.

### C3. Your entity does not resolve

`"Meghraj Giri" developer Nepal` returns mostly unrelated Wikipedia entities — Meghraj Sharma Nepal,
Deepak Raj Giri, Amar Giri, Pramila Giri, Gehendra Giri, Prajwol Giri — plus a Behance profile for
"Meghraj Dangi". There is no knowledge panel. Your Toptal profile does not surface at all.

An AI Overview will not name a person it cannot disambiguate from six other people.

---

## 2. High — the content that already exists but never renders

### H1. Your entire employment and education history is invisible

`site_config` holds a complete, fully-written `experience` section — SCSS Consulting, Inseed,
Gurzu Inc., Prabidhi Labs, Lightweb Group, each with dates, descriptions and tech — and a complete
`education` section (BSc CSIT, Institute of Science and Technology, Tribhuvan University). Both have
working CMS editors at `/cms/config/experience` and `/cms/config/education`.

**No public component renders either.** The only consumer anywhere is
`src/components/sections/AboutSection.tsx:20`, which reads `experiences.length` to print the
number "5". The roles themselves never reach the DOM.

This is the single highest-leverage, lowest-effort fix in the audit: the `alumniOf` and `worksFor`
evidence that would resolve your entity is already written and sitting in your database. Render it.

### H2. Dead navigation

Nav links "Services" (`#expertise`) and "Journey" (`#journey`) point at IDs that exist nowhere in
the DOM. Present IDs: `about`, `contact`, `email`, `featured-work`, `mobile-nav`, `password`,
`skills`, `testimonials`. Two of five nav items are broken on every page of the site.

`TestimonialsSection` is mounted in the RSC tree but renders no testimonial text.

### H3. Your strongest credential is nowhere on the site

The Toptal profile — "Verified Expert in Engineering", Butwal, Nepal — is absent from body copy,
absent from `sameAs`, and unlinked. It is a high-authority, third-party, independently-verifiable
credential on a domain Google trusts, and it is doing nothing for you.

Also absent: all five named employers, the Tribhuvan University degree, the freeCodeCamp
certification, and every hard metric on that resume (5× admin-panel load-time reduction, +35%
Bookvid adoption, +25% retention, −30% initial load via SSR, 95% on-time delivery).

### H4. Thin content, and unsupported numbers

Homepage: 502 words of real copy (the headless render confirms 2,565 characters of extracted text —
`SEO-STRATEGY.md`'s claim of "~2,500 words" counted Next.js script payload and is wrong). Project
pages: 109–377 words each. Only two contain any metric at all.

The homepage claims "20+ Products Shipped" while displaying 7 projects, and "5 roles ·
2 qualifications" while showing neither. Unsupported numbers next to no evidence weaken every other
number on the page.

### H5. Factual error in a regulated domain

The SCSS Consulting entry claims "HIPAA compliance and Australian health policies", and
`/projects/cannabiz-elite` carries a "HIPAA compliance" highlight tag. HIPAA is US law and does not
apply to Australian clinics; the applicable frameworks are the Privacy Act and AHPRA. The page's own
unfilled text acknowledges this. Publishing the wrong regulatory regime undercuts precisely the
healthcare expertise being claimed.

---

## 3. Medium — schema and entity graph

Current implementation is structurally sound — JSON-LD, one `@graph` per page, stable `@id`
references. The problem is what it omits.

- `Person.address.addressLocality: "Nepal"` — Nepal is a country, not a locality. This both violates
  the field's meaning and throws away **Butwal**, the one fact that would disambiguate you.
- `/projects` emits `BreadcrumbList` + `ItemList` but drops the `Person` node — inconsistent with
  every other page, and a broken link in the entity graph.
- Missing from `Person`: `image` (an unused headshot already sits at `/Meghraj.jpg`), `description`,
  `alumniOf`, `worksFor`, `hasCredential`, `hasOccupation`, `nationality`, `homeLocation`,
  `knowsLanguage`, and the Toptal URL in `sameAs`.
- `knowsAbout` lists 27 skills, well beyond what the shipped work evidences. Trim to ~14 defensible
  topics; a padded list is a weaker signal than a short credible one.
- `genre: "Other"` on project nodes; trailing-slash mismatch between `BreadcrumbList` items and
  canonical URLs.

Recommended additions: `ProfilePage` on `/`, `CollectionPage` around the existing `ItemList`,
`SoftwareApplication` per project carrying real metrics. A `Service` node **only after** the
services section actually ships visible content — markup without matching visible content is a
guideline violation. `FAQPage` is informational only: Google retired FAQ rich results, so any
benefit is unverified AI-search upside.

Complete copy-pasteable JSON-LD and the exact `src/lib/schema.ts` wiring are in `findings/schema.md`.

---

## 4. Medium — technical and performance

- **Wasted LCP preload.** `src/app/layout.tsx` preloads `/Meghraj.jpg` (149 KB raw), but the
  rendered `<img>` requests `/_next/image?url=%2FMeghraj.jpg&w=…`. Different URL — so the preload
  downloads a file the browser never uses *and* fails to preload the actual LCP resource. Net
  negative on both bandwidth and LCP.
- `/logo.png` is a 211 KB unoptimised PNG.
- Missing security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Content-Security-Policy`, `Permissions-Policy`. `x-powered-by: Next.js` is exposed unnecessarily.
- Stale `© 2024` in `navigation.mobileMenu.footer`.
- No `/about`, `/contact` or `/services` URLs — About and Contact exist only as same-page anchors,
  so neither can rank or be cited independently.

**What is already right, and should not be disturbed:** sitemap and robots.txt are correct and
point at the right host; the homepage is statically prerendered and edge-cached; all primary copy is
server-rendered with no JS dependency (`is_spa: false`); the OG image exists and works; `next/image`
is used correctly with sensible `sizes` and genuinely descriptive alt text; HSTS is set; every AI
crawler tested (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot) receives
a 200.

`llms.txt` is **not** recommended. Google Search ignores it, and the real bottleneck is content that
never renders into the HTML crawlers already fetch successfully.

---

## 5. Measurement gaps — stated honestly

- **No Core Web Vitals field data.** The keyless PageSpeed Insights quota was exhausted; CrUX
  requires an API key. All performance commentary above is structural, not measured. Add a Google
  API key to close this.
- **No keyword volume data.** No DataForSEO MCP is configured. Every difficulty and priority
  judgement in `findings/cluster.md` is qualitative SERP-shape analysis, not measured volume. Treat
  the ordering as directional and validate in Search Console and Keyword Planner.
- **No backlink data.** No Moz or Bing Webmaster credentials configured.
- Search results were retrieved from a US-based index; actual Nepal-local SERPs will differ in
  ordering, though the *page types* that rank will not.

---

## 6. Correction to the existing strategy doc

`docs/seo/SEO-STRATEGY.md` states the homepage carries "~2,500 words" of body copy and lists that
among the things that are "already correct — do not disturb". That measurement counted Next.js
script payload. The real figure is ~500 words. The conclusion built on it — that homepage content
depth is adequate — does not hold.
