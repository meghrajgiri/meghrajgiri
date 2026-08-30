# SEO Strategy — meghrajgiri.com.np

**Prepared:** 2026-08-30
**Canonical property:** https://www.meghrajgiri.com (decided 2026-08-30)
**Redirecting property:** https://www.meghrajgiri.com.np — holds the existing index; must 301 to the canonical
**Business type:** Solo full-stack developer / independent consultancy (agency template, adapted for a one-person practice)
**Stack:** Next.js 15 App Router, React 19, Supabase-backed config, Vercel

---

## 0. Executive summary

The site is technically well-built, but it was shipped with **every canonical URL, Open Graph URL, sitemap entry, and schema `url` pointing at `https://meghraj.dev`** — a domain with no DNS records at all. Google was being told, on every page, that the authoritative copy of this content lived at an address that does not resolve. Compounding it, **two live domains served that identical broken output**: `www.meghrajgiri.com` and `www.meghrajgiri.com.np`.

**Status: the canonical defect is fixed (2026-08-30).** `metadata.url` in the Supabase `site_config` table now reads `https://www.meghrajgiri.com`, and because the config is read at runtime the correction went live without a redeploy. Canonical, `og:url`, JSON-LD `url`, and the contact email are all verified correct in production. The sitemap and `robots.txt` are build-time artifacts and still need a deploy.

What remains is the consequence of that fix: `.com` is the canonical domain and `.com.np` is not, so **`.com.np` must now 301 to `.com` at the host level.** Until it does, two domains serve the same content and split every signal between them.

Secondary structural problem, unchanged: the site is effectively **9 URLs, 7 of which are ~120-word project pages**. There is no service page, no case study with a metric in it, no article, no indexable About or Contact URL. There is nothing for a non-brand query to rank *with*.

**The strategy in one line:** complete the domain consolidation, convert thin project pages into metric-bearing case studies, add three service pages and a technical blog, and build the personal entity so AI search engines can attribute the work.

---

## 1. Current state assessment

### Verified findings

| # | Finding | Evidence | Severity |
|---|---|---|---|
| 1 | ~~Canonical points to a dead domain~~ | `dig meghraj.dev A`/`NS` both empty | ~~Critical~~ **FIXED 2026-08-30** |
| 2 | Sitemap lists 9 URLs on the dead domain | `/sitemap.xml` still returns `https://meghraj.dev/...` — route output is build-time cached | **Critical — awaiting deploy** |
| 3 | `robots.txt` declares the wrong sitemap host | Hardcoded `.com.np`; corrected in `robots.ts` | **Critical — awaiting deploy** |
| 4 | ~~Person schema `url`/`email` on the dead domain~~ | now `https://www.meghrajgiri.com` / `meghrajgiri56@gmail.com` | ~~High~~ **FIXED 2026-08-30** |
| 5 | Indexed snippet is stale | Google shows title "Meghraj Giri - Full Stack Developer" and old description; live HTML title is "Meghraj Giri — Product-Minded Full Stack Developer" | High |
| 6 | No OG image exists | `/opengraph-image` → 404, `/og-image.png` → 404; `twitter:card` is `summary_large_image` with no image to show | High |
| 7 | Project pages are thin | `/projects/thriftverse` renders ~123 words of body copy; all 7 are comparable | High |
| 8 | `sameAs` partially mis-attributed | GitHub corrected to `meghrajgiri` (verified via API: 8 repos, links back to the site); dead Twitter link removed; **`linkedin.com/in/meghraj` still unverified** | **Partly fixed — LinkedIn outstanding** |
| 9 | `force-dynamic` on all public routes | `export const dynamic = "force-dynamic"` in `(site)/layout.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx` — full SSR on every request; TTFB measured 0.47–0.53 s | Medium |
| 10 | `generateStaticParams` is inert | Declared in `projects/[slug]/page.tsx` but overridden by `force-dynamic` | Medium |
| 11 | ~~No `metadataBase`~~ | added to the root layout | ~~Medium~~ **FIXED — awaiting deploy** |
| 12 | Schema coverage is minimal | Only `Person` (home) and `CreativeWork` (project). No `WebSite`, `BreadcrumbList`, `ItemList`, `ProfessionalService`, `FAQPage` | Medium |
| 13 | Favicon declares a nonsense size | `<link rel="icon" ... sizes="422x401">` | Low |
| 15 | **Two live domains serving identical content** | `www.meghrajgiri.com` and `www.meghrajgiri.com.np` both return 200 with the same pages and no redirect between them | **Critical — open** |
| 16 | Placeholder phone number published | `+977-9841234567` — replaced with the real number | ~~Medium~~ **FIXED 2026-08-30** |
| 14 | Deprecated Next config key | `experimental.serverComponentsExternalPackages` — renamed to `serverExternalPackages` in Next 15 | Low |

### What is already correct — do not disturb

- Apex → `www` 301 redirect works (`meghrajgiri.com.np` → `www.meghrajgiri.com.np`).
- `robots.txt` correctly disallows `/admin` and `/api/`.
- Google Search Console verification file is present (`public/google54d9091d891bd219.html`).
- The `/hd` staging landing page was removed on 2026-08-30 — the ad-attribution work it supported no longer needs it. It was correctly `noindex` while it existed, so its removal has no indexation consequence.
- Homepage body copy is ~2,500 words, all server-rendered — no JS-rendering dependency for the primary content.
- Vercel Analytics and Speed Insights are already wired in.

### The domain decision — RESOLVED 2026-08-30

Three domains were in play. `meghraj.dev` is registered but has no A record and no nameservers; it was never the site and is now removed from every configuration. That left the two real properties, **both live, both serving byte-identical pages, with no redirect between them**:

| Domain | Age | Index status | DNS |
|---|---|---|---|
| `www.meghrajgiri.com.np` | Older; published first | **Indexed**, ranks #2 for brand | Vercel nameservers |
| `www.meghrajgiri.com` | ~25 days newer | Not yet established | Registrar DNS → Vercel |

**Decision: `https://www.meghrajgiri.com` is canonical.** Chosen for international positioning — `.com.np` reads as Nepal-local, which works against a practice targeting startup clients abroad.

This is a **domain migration**, and it is being run now on purpose: with 9 URLs and one ranking brand term there is almost nothing to lose, and every week of content added under `.com.np` first would raise the cost. Doing it after the content phases would be several times more expensive.

**The migration is half-done.** The canonical signal now points at `.com` everywhere it is generated at runtime. The remaining half is making `.com.np` stop serving content and start redirecting:

1. In the Vercel project, set `meghrajgiri.com.np` and `www.meghrajgiri.com.np` to **redirect** to `www.meghrajgiri.com` (Vercel's domain settings do this at the edge — do not implement it in `next.config.ts`, which would still serve the app on the old host).
2. Keep that redirect **permanently**. There is no point at which removing it is safe.
3. Add `www.meghrajgiri.com` as a new Search Console property, verify it, and use the Change of Address tool from the `.com.np` property.
4. Expect 4–8 weeks of turbulence. Brand rank will dip before it recovers.

Until step 1 is done, two domains serve the same content and Google must guess which to trust — the one condition worse than the original bug, because it is self-inflicted duplication rather than a broken pointer.

---

## 2. Goals and positioning

### Business goals, in priority order

1. **Inbound project enquiries** from startup founders and small product teams — the contact form is the conversion event.
2. **Credibility on arrival** — when a recruiter, client, or investor searches the name after a referral, the site should be the first result and should answer "can this person build my thing?" in under 30 seconds.
3. **Entity presence in AI answers** — being cited by ChatGPT/Perplexity/AI Overviews when someone asks for a React Native developer with marketplace or telehealth experience.

### Positioning

Not "a full-stack developer" — that term is contested by marketplaces with domain authority in the 90s and cannot be won. The defensible position is the intersection the existing work already occupies:

> **Product-minded full-stack developer building marketplaces, telehealth, and fintech products for startups — React Native, Next.js, TypeScript, Supabase/Medusa.**

Every project in the portfolio is a *transactional multi-sided product*: Thriftverse (marketplace + storefronts + logistics), Lyve (ticket/costume resale), Cannabiz Elite (Australian telehealth clinic management), Khatapata (inventory PWA), College Cost Secrets (fintech advisory), Bookvid, Yume. That is a coherent specialism, and it is currently invisible because it is never stated as one.

### Target audience segments

| Segment | Search behaviour | Landing target |
|---|---|---|
| Startup founder needing an MVP | "build a marketplace app MVP", "react native developer for startup" | Service page |
| Technical hiring manager / CTO | Brand name, GitHub handle, LinkedIn | Home + case studies |
| Agency subcontracting overflow | "freelance next.js developer", "medusajs developer" | Service page + case studies |
| Developer researching a problem | "supabase RLS multi-tenant storefront", "expo eas build …" | Blog article |

That last row is the traffic engine. It does not convert directly, but it is the only category where a solo site can outrank a marketplace, and it feeds the entity signals everything else depends on.

---

## 3. Keyword strategy

No paid keyword tooling was available for this plan (no DataForSEO MCP configured), so volumes below are **directional estimates, not measured figures**. Validate them in Google Search Console and Keyword Planner in Week 2 and revise this table.

### Tier 1 — Brand and entity (defend, already partly won)

| Keyword | Current state | Target |
|---|---|---|
| meghraj giri | Ranks #2; competing entities "Meghraj Ghimire", `meghraj.me` | #1 with sitelinks and a knowledge panel |
| meghraj giri developer / react native | Unverified | #1 |
| meghrajgiri (handle) | GitHub/LinkedIn dominate | Own the SERP with consistent `sameAs` |

**Action:** brand SERPs are lost to entity confusion, not to competitors. Fixing `sameAs` (Finding 8) and adding `WebSite` + `ProfilePage` schema is the whole fight here.

### Tier 2 — Commercial long-tail (the realistic wins, 6–12 months)

Low-volume, low-competition, high-intent. Each maps to a service page or case study.

- `react native marketplace app developer`
- `medusajs developer for hire`
- `supabase next.js developer freelance`
- `telehealth clinic management system developer`
- `mvp developer for startups nepal`
- `expo react native developer remote`

### Tier 3 — Informational (the traffic engine, ongoing)

Derived directly from problems already solved in the portfolio, which is what makes them credible and citable:

- multi-tenant storefront subdomains with Next.js + Supabase
- eSewa payment integration in a React Native app
- Nepal Can Move (NCM) logistics API integration
- Medusa v2 workflows for clinic/telehealth ordering
- Supabase RLS patterns for marketplace sellers
- PWA offline inventory sync patterns

### Tier 4 — Explicitly out of scope

`hire react native developer`, `full stack developer nepal`, `best web developer` — these SERPs are held by Upwork, Arc, Truelancer, and agency sites (Logica Beans, Bytecode). A 9-page personal site does not enter that auction. Do not spend a single hour on them.

---

## 4. Technical foundation

### Rendering and performance

Current: `force-dynamic` on every public route means each request re-renders on the server and hits Supabase (60 s `unstable_cache` softens the DB load but not the render). Measured TTFB 0.47–0.53 s — acceptable, not good, and it scales badly.

Target: **ISR instead of forced dynamic.** Remove `force-dynamic` from `(site)/layout.tsx`, `projects/page.tsx`, and `projects/[slug]/page.tsx`; keep `revalidate` at 60 s (or move to on-demand `revalidateTag("site-config")` fired from the admin config save route). This makes `generateStaticParams` actually work, so project pages become statically generated, and TTFB drops toward edge-cache latency.

**Core Web Vitals targets** (no CrUX field data was pulled for this plan — establish the real baseline in PageSpeed Insights and Search Console before optimising):

| Metric | Target | Notes |
|---|---|---|
| LCP | < 2.0 s | `/Meghraj.jpg` is already preloaded with `fetchPriority="high"` — verify it is genuinely the LCP element and that it is served as WebP/AVIF |
| INP | < 200 ms | Watch the marquee (`react-fast-marquee`) and the animated background blur layers |
| CLS | < 0.1 | Hero image and project cards need explicit dimensions |
| TTFB | < 200 ms | Achieved by the ISR change above |

Also: `next.config.ts` defines no `images` block. Confirm every image goes through `next/image`; raw `<img>` tags bypass format negotiation and sizing entirely.

### Schema plan by page type

| Page | Schema | Status |
|---|---|---|
| Home | `Person` + `WebSite` (with `potentialAction`) + `ProfilePage` | `Person` exists but carries a dead `url`/`email` and suspect `sameAs` |
| `/services/*` | `Service` + `ProfessionalService` | Pages do not exist yet |
| `/projects` | `ItemList` + `BreadcrumbList` | Missing |
| `/projects/[slug]` | `CreativeWork` (or `Article` once case studies land) + `BreadcrumbList` | `CreativeWork` present; no breadcrumbs |
| `/blog/[slug]` | `BlogPosting` + `Person` author + `BreadcrumbList` | Does not exist yet |
| `/about` | `ProfilePage` + `Person` with `knowsAbout`, `alumniOf`, `worksFor` | Does not exist as a URL |
| `/contact` | `ContactPage` | Does not exist as a URL |

The `Person` node is the spine of the whole graph. It should be defined once, given a stable `@id` (`https://www.meghrajgiri.com.np/#person`), and referenced by `@id` from every other node rather than re-declared per page.

### AI search / GEO readiness

- Fix `sameAs` to the *verified* profiles: the real GitHub, the real LinkedIn, and `himalayas.app/@meghrajgiri` (which already exists and is indexed). Remove `twitter.com/meghrajgiri` — it 404s, and a broken `sameAs` actively damages entity resolution. Remove the `mailto:` from `sameAs`; it does not belong there.
- Write case studies with **specific, quotable numbers**. AI engines cite passages containing concrete claims. "Reduced checkout abandonment by 34% after moving eSewa to a single-step flow" is citable; "improved the user experience" is not.
- Keep answers extractable: one clear claim per paragraph, real `<h2>`/`<h3>` structure, no key information locked inside client-side tabs or accordions.
- `llms.txt` is optional and ignored by Google — low priority, add it only if it costs ten minutes.

---

## 5. Content strategy

### The gap

| Content type | Have | Need |
|---|---|---|
| Home | 1 (~2,500 words, single-page anchors) | Keep, but link out to real URLs |
| Service pages | **0** | 3 |
| Case studies | 7 stubs @ ~120 words | 4 deep (1,000+ words), rest stay as cards |
| About (as a URL) | 0 (anchor only) | 1 |
| Contact (as a URL) | 0 (anchor only) | 1 |
| Articles | **0** | 12 in year one |
| FAQ | 0 | 1 (or a block on each service page) |

### Thin content is the acute risk

Seven near-identical ~120-word pages sharing a template is the classic doorway-page pattern. They are currently in the sitemap and indexable. Two acceptable resolutions, per page:

1. **Deepen it** — expand to a 1,000+ word case study (problem → constraints → approach → architecture → measurable result → what I'd change).
2. **De-index it** — `noindex` the stub and let the `/projects` listing carry the content.

Pick per project based on whether there is a real story with numbers behind it. Four deep case studies beat seven shallow ones, and the four should be Thriftverse, Cannabiz Elite, Khatapata, and Lyve — the ones with the most distinctive technical substance.

### E-E-A-T plan

For a solo practitioner, E-E-A-T *is* the personal entity. There is no brand to hide behind.

- **Experience:** first-person case studies describing decisions actually made, including the ones that went wrong. This is the strongest asset available and it is currently unused.
- **Expertise:** an `/about` page with the real education and work history already in the config (`education`, `experience` sections), plus `knowsAbout` in schema.
- **Authoritativeness:** consistent identity across GitHub, LinkedIn, Himalayas, dev.to/Hashnode. Cross-link from every profile to the canonical domain.
- **Trustworthiness:** a real, reachable email on the canonical domain; client testimonials with attribution; visible response-time and availability (already in the `contact` config — surface it on an indexable URL).

---

## 6. KPI targets

Baselines marked *TBC* must be pulled from Search Console and GA4 in Week 1. Do not treat the targets as commitments until the baseline is real — and expect the Month-3 numbers to look flat, because Phase 1 is repair work whose payoff shows up in Month 4+.

| Metric | Baseline (2026-08-30) | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| Organic sessions / month | TBC — assume < 100 | 150–250 | 500–800 | 1,500–2,500 |
| Indexed pages | 9 submitted, count indexed TBC (canonical defect suppresses this) | 14 | 25 | 35–40 |
| Ranking keywords (top 100) | TBC — likely < 20 | 60 | 150 | 350 |
| Top-10 non-brand keywords | ~0 | 3 | 12 | 30 |
| Brand SERP position | #2 | #1 | #1 + sitelinks | #1 + knowledge panel |
| Referring domains | TBC | +5 | +15 | +35 |
| LCP (75th pct, field) | TBC | < 2.5 s | < 2.0 s | < 2.0 s |
| INP (75th pct, field) | TBC | < 200 ms | < 200 ms | < 200 ms |
| Contact enquiries from organic | TBC | 1–2 / mo | 3–5 / mo | 6–10 / mo |
| AI engine citations (manual audit) | 0 | 0–1 | 2–4 | 6+ |

**Leading indicators to watch weekly** (they move before traffic does): GSC "Pages" report — canonical mismatches resolving; impressions on non-brand queries; average position on Tier-2 terms.

---

## 7. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Canonical fix is applied in code but not in the Supabase `site_config` row, so nothing changes in production | High | Critical | The URL comes from the DB at runtime — update the `metadata` row *and* redeploy; verify with `curl` against production, not localhost |
| `.com.np` is left serving content instead of redirecting | **Currently true** | Critical | Set the Vercel domain redirect (§0 step 1). This is the single highest-priority open item |
| Thin project pages accumulate as more are added via `yarn add-project` | High | High | Enforce a minimum: no project page ships without 600+ words and one measurable outcome, or it ships `published: false` |
| Migration turbulence is mistaken for a failing strategy, prompting a reversal mid-flight | Medium | High | Expect 4–8 weeks of dips. Do not revert the canonical — a half-reverted migration is worse than either end state |
| Content cadence slips (a solo operator's default failure mode) | High | Medium | Two articles a month is the plan; one a month sustained beats four then zero. Batch-draft quarterly |
| Removing `force-dynamic` breaks admin-edit freshness | Medium | Low | Pair the change with on-demand `revalidateTag("site-config")` in the config save route |
| Chasing Tier-4 head terms | Medium | Medium | The scope boundary is written down in §3; re-read it before starting any "hire a developer" page |

---

## 8. Success criteria by phase

- **Phase 1 (weeks 1–4):** every canonical, OG URL, sitemap entry, and schema `url` resolves to `www.meghrajgiri.com`; `.com.np` 301s to it; GSC Change of Address submitted; zero canonical errors on the 9 known URLs; an OG image renders in the LinkedIn/Slack preview validators.
- **Phase 2 (weeks 5–12):** 3 service pages and 4 deep case studies live and indexed; `/about` and `/contact` exist as URLs; first 4 articles published; first non-brand impressions in GSC.
- **Phase 3 (weeks 13–24):** 12+ non-brand keywords in the top 10; 15+ referring domains; CWV green in field data; first verified AI citation.
- **Phase 4 (months 7–12):** 30+ non-brand top-10 keywords; inbound enquiries attributable to organic in GA4; brand knowledge panel present.

---

*Companion documents:* [SITE-STRUCTURE.md](SITE-STRUCTURE.md) · [COMPETITOR-ANALYSIS.md](COMPETITOR-ANALYSIS.md) · [CONTENT-CALENDAR.md](CONTENT-CALENDAR.md) · [IMPLEMENTATION-ROADMAP.md](IMPLEMENTATION-ROADMAP.md)
