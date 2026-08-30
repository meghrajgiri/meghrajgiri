# Implementation Roadmap — meghrajgiri.com.np

**Prepared:** 2026-08-30
**Decision applied:** canonical is **`https://www.meghrajgiri.com`** (see [SEO-STRATEGY.md](SEO-STRATEGY.md) §0). `www.meghrajgiri.com.np` must 301 to it.
**Progress:** tasks marked ✅ were completed on 2026-08-30. Tasks marked 🚀 are done in the repo/DB but need a deploy to take effect.

Effort estimates assume one person working part-time on this alongside client work.

---

## Phase 1 — Foundation (weeks 1–4)

**Objective:** stop the bleeding. Every signal on the site currently points at a domain that does not exist. Nothing else matters until that is true no longer.

### Week 1 — Canonical identity (critical path)

| # | Task | Where | Status |
|---|---|---|---|
| 1.1 | Set `metadata.url` to `https://www.meghrajgiri.com` | Supabase `site_config` row `key='metadata'` | ✅ **done** — verified live |
| 1.2 | Replace `hello@meghraj.dev` with `meghrajgiri56@gmail.com` | `metadata`, `personal`, `contact` rows | ✅ **done** |
| 1.3 | Verify in production, not localhost | `curl` against the live host | ✅ **done** — canonical, `og:url`, JSON-LD `url` all correct |
| 1.4 | Sitemap emits the canonical host, with a pinned origin and truthful `lastmod` | [src/app/sitemap.ts](../../src/app/sitemap.ts) | ✅ done — 🚀 needs deploy |
| 1.5 | Add `metadataBase` | [src/app/layout.tsx](../../src/app/layout.tsx) | ✅ done — 🚀 needs deploy |
| 1.6 | Fix the hardcoded sitemap host in robots | [src/app/robots.ts](../../src/app/robots.ts) | ✅ done — 🚀 needs deploy |
| 1.7 | Remove `mailto:` from `sameAs` — it is not a profile URL | [src/lib/schema.ts](../../src/lib/schema.ts) | ✅ done — 🚀 needs deploy |
| **1.8** | **Redirect `meghrajgiri.com.np` → `www.meghrajgiri.com` in Vercel domain settings** | Vercel dashboard | ⚠️ **OPEN — highest priority** |
| 1.9 | Correct `sameAs`: GitHub → `github.com/meghrajgiri`; drop the 404ing Twitter link | `contact.socialLinks` | ✅ **done** |
| 1.10 | **Verify the real LinkedIn URL** — config still claims `linkedin.com/in/meghraj`, which is unconfirmed | `contact.socialLinks` | ⚠️ **OPEN — needs your input** |
| 1.11 | Add `himalayas.app/@meghrajgiri` to `sameAs` | `contact.socialLinks` | open |
| 1.12 | Harden the sitemap so a bad admin edit can't republish a foreign host | [src/app/sitemap.ts](../../src/app/sitemap.ts) | ✅ done — origin is pinned |

> **1.8 is now the blocking task.** Two domains currently serve identical content with no redirect between them. Every day that persists, Google splits signals across both.


### Week 3–4 — Rendering, resilience, images, social cards — ✅ COMPLETED 2026-08-30

| # | Task | Where | Status |
|---|---|---|---|
| 4.1 | Remove `force-dynamic` from the three public routes | `(site)/layout.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx` | ✅ `/` and `/projects` now Static, `/projects/[slug]` now SSG |
| 4.2 | `generateStaticParams` actually pre-renders | project route | ✅ verified in build output |
| 4.3 | **Committed config snapshot as an outage fallback** | [src/config/fallback.json](../../src/config/fallback.json), [src/lib/config.ts](../../src/lib/config.ts) | ✅ verified: full site builds and serves 200s with Supabase unreachable |
| 4.4 | `yarn config:snapshot` to refresh the snapshot | [scripts/snapshot-config.mjs](../../scripts/snapshot-config.mjs) | ✅ **run this after content edits and commit the result** |
| 4.5 | Revalidate `/sitemap.xml` and `/robots.txt` on admin save | [src/app/api/config/route.ts](../../src/app/api/config/route.ts) | ✅ new projects now reach the sitemap without a deploy |
| 4.6 | Site-wide OG card | [src/app/opengraph-image.tsx](../../src/app/opengraph-image.tsx) | ✅ `og:image` + `twitter:image` now exist; both were absent |
| 4.7 | Per-project OG cards | [projects/[slug]/opengraph-image.tsx](../../src/app/(site)/projects/[slug]/opengraph-image.tsx) | ✅ replaces raw screenshots that platforms cropped |
| 4.8 | `WebSite` + `Person` with stable `@id`, `BreadcrumbList`, `ItemList` | [src/lib/schema.ts](../../src/lib/schema.ts) | ✅ single `@graph` per page, all nodes reference one Person |
| 4.9 | Favicon was a 212 KB PNG at 422×401 renamed `.ico` | `src/app/favicon.ico`, `icon.png`, `apple-icon.png` | ✅ 212 KB → 9 KB, correct square sizes |
| 4.10 | Project images through `next/image` with measured intrinsic sizes | [src/lib/image-size.ts](../../src/lib/image-size.ts), `ProjectDetail.tsx` | ✅ hero thumbnail 803 KB → 10 KB AVIF (−98.7%), no CLS, no crop |
| 4.11 | AVIF/WebP + year-long derivative cache; fix the Next 15 config key rename | [next.config.ts](../../next.config.ts) | ✅ `serverComponentsExternalPackages` → `serverExternalPackages` |
| 4.12 | Admin panel moved from `/admin` to `/cms` | `src/app/cms/` | ✅ same host, no middleware, no redirect — `/admin` 404s by design |
| 4.13 | Public footer link to the CMS removed | `(site)/layout.tsx` | ✅ no crawlable pointer to the CMS remains |
| 4.14 | RLS policies re-evaluating `auth.role()` per row | [supabase/migrations/003_rls_initplan.sql](../../supabase/migrations/003_rls_initplan.sql) | ✅ all 4 linter warnings cleared; applied live |
| 4.15 | `scripts/add-project.mjs` wrote to a deleted file | [scripts/add-project.mjs](../../scripts/add-project.mjs) | ✅ rewritten against Supabase |
| 4.16 | `scripts/seed-config.mjs` parsed deleted TS files | [scripts/restore-config.mjs](../../scripts/restore-config.mjs) | ✅ replaced with a snapshot-restore tool (`yarn config:restore`) |
| 4.17 | 1.8 MB of unreferenced images in `public/` | — | ✅ removed (git-recoverable) |
| 4.18 | Pre-existing `exhaustive-deps` warning | `ConfigEditor.tsx` | ✅ fixed with `useCallback`; build is now warning-free |

### Database notes

- **Leaked-password protection is disabled.** Dashboard toggle, [remediation guide](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Worth enabling — the admin is a single password-auth account.
- **`contact_submissions` allows unauthenticated INSERT** (`with_check: true`). That is correct for a public contact form, but there is no rate limit at the database level. If it gets spammed, add one at the API route.
- **Two "unused index" notices are false signals.** The table has one row, so no index would register as used. Do not drop them.
- **Five config rows are unused by the site but are real drafted content** — `testimonials`, `process`, `expertise`, `journey`, `featured_work`, all written 2026-06-14. They look like a planned redesign. `testimonials` and `process` map directly onto E-E-A-T needs and the service page. Left in place deliberately.

**Measured:** local TTFB fell from ~0.5 s (SSR per request) to ~2 ms (prerendered).

### Week 1 — Measurement

| # | Task | Effort |
|---|---|---|
| 1.13 | **Add `www.meghrajgiri.com` as a new GSC property and verify it** — the existing verification covers `.com.np` | 20 min |
| 1.14 | **Submit Change of Address** in the `.com.np` property, pointing at `.com` (requires 1.8 to be live first) | 10 min |
| 1.8 | Record the baseline: impressions, clicks, average position, indexed page count, top queries. **Fill the *TBC* cells in the strategy KPI table.** | 30 min |
| 1.15 | Resubmit `sitemap.xml` on the `.com` property; request re-indexing of the 9 URLs | 20 min |
| 1.10 | Confirm GA4 is receiving organic sessions (Vercel Analytics is present but is not a GSC/GA4 substitute) | 30 min |
| 1.11 | Set up Bing Webmaster Tools — free backlink data | 20 min |
| 1.12 | Run PageSpeed Insights on `/`, `/projects`, and one project page; record LCP/INP/CLS field values | 20 min |

### Week 2 — Entity and schema

| # | Task | Where | Effort |
|---|---|---|---|
| 2.1 | **Fix `sameAs`.** Verify the real GitHub and LinkedIn handles (the config claims `github.com/meghraj` and `linkedin.com/in/meghraj`; the actual handle appears to be `meghrajgiri`). Remove `twitter.com/meghrajgiri` — it 404s. Remove the `mailto:` entry. Add `himalayas.app/@meghrajgiri`. | `contact.socialLinks` config | 30 min |
| 2.2 | Give `Person` a stable `@id` of `https://www.meghrajgiri.com/#person`; reference it by `@id` elsewhere instead of redeclaring | [src/app/(site)/page.tsx](../../src/app/(site)/page.tsx) | 45 min |
| 2.3 | Add `WebSite` schema with `url` and `name` | Site layout | 30 min |
| 2.4 | Add `BreadcrumbList` to `/projects` and `/projects/[slug]` | Project pages | 45 min |
| 2.5 | Add `ItemList` to `/projects` | [src/app/(site)/projects/page.tsx](../../src/app/(site)/projects/page.tsx) | 30 min |
| 2.6 | Validate everything in Google's Rich Results Test and schema.org validator | — | 30 min |
| 2.7 | Update GitHub bio, LinkedIn contact info, and Himalayas profile to link to the canonical domain (reciprocal links resolve the entity) | External | 30 min |

### Week 3 — Social preview and images

| # | Task | Effort |
|---|---|---|
| 3.1 | Create `src/app/opengraph-image.tsx` (Next.js ImageResponse) — 1200×630, name + specialism + domain. Currently `/opengraph-image` and `/og-image.png` both 404 while `twitter:card` claims `summary_large_image` | 2 h |
| 3.2 | Add per-project OG images, or a templated fallback using project title + tech | 2 h |
| 3.3 | Validate in the LinkedIn Post Inspector, X card validator, and a Slack unfurl | 30 min |
| 3.4 | Audit every image: `next/image` everywhere, explicit width/height, WebP/AVIF. Confirm `/Meghraj.jpg` is genuinely the LCP element it is preloaded as | 2 h |
| 3.5 | Fix the favicon's bogus `sizes="422x401"` declaration | 15 min |

### Week 4 — Rendering and performance

| # | Task | Where | Effort |
|---|---|---|---|
| 4.1 | Remove `export const dynamic = "force-dynamic"` from the three public routes; rely on `unstable_cache`'s 60 s revalidate | `(site)/layout.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx` | 1 h |
| 4.2 | Add on-demand `revalidateTag("site-config")` to the admin config save route so edits still publish instantly | [src/app/api/config/route.ts](../../src/app/api/config/route.ts) | 1 h |
| 4.3 | Confirm `generateStaticParams` now actually pre-renders project pages | — | 30 min |
| 4.4 | Re-measure TTFB (baseline 0.47–0.53 s) | — | 15 min |
| 4.5 | Rename the deprecated `experimental.serverComponentsExternalPackages` → `serverExternalPackages` | [next.config.ts](../../next.config.ts) | 10 min |
| 4.6 | Audit INP against the marquee and animated blur layers | — | 1 h |

**Phase 1 exit criteria**
- [ ] Every canonical, OG URL, sitemap entry, and schema `url` resolves to `www.meghrajgiri.com`
- [ ] `www.meghrajgiri.com.np` 301s to `www.meghrajgiri.com`; GSC Change of Address submitted
- [ ] GSC shows zero canonical errors on the 9 known URLs
- [ ] OG image renders in all three preview validators
- [ ] `sameAs` contains only verified, 200-returning profiles
- [ ] Real KPI baselines recorded in the strategy doc

---

## Phase 2 — Expansion (weeks 5–12)

**Objective:** build something for a non-brand query to rank with. The site currently has no service page, no case study, and no article.

### Weeks 5–6 — Missing core pages

| Task | Effort |
|---|---|
| `/about` as a real URL — bio, education, experience (data already in the config), `ProfilePage` + `Person` schema, 800+ words | 4 h |
| `/contact` as a real URL — form, availability, response time, `ContactPage` schema | 2 h |
| Update global nav to link real URLs rather than homepage anchors | 1 h |
| Add both to the sitemap | 15 min |

### Weeks 7–9 — Service pages

Three pages, 800+ words each, per the template in [SITE-STRUCTURE.md](SITE-STRUCTURE.md) §6:

| Page | Angle | Effort |
|---|---|---|
| `/services/mvp-development` | Idea → shipped product for startups | 6 h |
| `/services/react-native-apps` | Cross-platform mobile, Expo, store deployment | 6 h |
| `/services/marketplace-development` | Multi-sided platforms, payments, logistics — **the strongest differentiator** | 6 h |
| `/services` index + `Service`/`ProfessionalService` schema | | 3 h |

### Weeks 10–12 — Deep case studies

Convert four ~120-word stubs into 1,000+ word case studies. Each needs at least one measurable outcome — that is the non-negotiable part, and the thing AI engines cite.

| Case study | Why this one | Effort |
|---|---|---|
| Thriftverse | Marketplace + eSewa + NCM logistics — nothing comparable is documented anywhere | 8 h |
| Cannabiz Elite | Australian telehealth + Medusa v2; regulated-domain credibility | 8 h |
| Khatapata | Offline-first inventory PWA; distinct technical story | 6 h |
| Lyve | Ticket/costume resale marketplace | 6 h |
| Decide `noindex` vs. card-only for the remaining three stubs | | 1 h |

**Phase 2 exit criteria**
- [ ] 3 service pages + 4 deep case studies live and indexed
- [ ] `/about` and `/contact` exist as URLs
- [ ] No indexable page under 600 words
- [ ] First non-brand impressions visible in GSC
- [ ] Brand SERP at #1

---

## Phase 3 — Scale (weeks 13–24)

**Objective:** consistent publishing, first real links, AI-search presence.

| Area | Work |
|---|---|
| **Content** | Launch `/blog` with `BlogPosting` schema. Publish 2 articles/month per [CONTENT-CALENDAR.md](CONTENT-CALENDAR.md). Target 8 articles by week 24. |
| **Links** | Submit to dev.to / Hashnode with canonical pointing home. Answer Stack Overflow questions in your niche. Contribute to the Supabase/Medusa/Expo communities. Get listed in Nepali developer directories. Target: +15 referring domains. |
| **GEO** | Manually audit ChatGPT, Perplexity, and Google AI Overviews for brand and Tier-2 terms. Log which passages get cited and write more of that shape. |
| **Internal linking** | Retro-fit the hub-and-spoke model across everything published so far. Enforce the two-inbound-links orphan rule. |
| **Performance** | Get LCP/INP/CLS green in *field* data, not just lab. |
| **Hygiene** | Monthly: GSC coverage, broken links, thin-content check on anything new. |

**Phase 3 exit criteria** — 12+ non-brand keywords in the top 10; 15+ referring domains; CWV green in field data; ≥1 verified AI citation.

---

## Phase 4 — Authority (months 7–12)

| Area | Work |
|---|---|
| **Thought leadership** | One substantial original piece per quarter — a teardown, a benchmark, or original data. This is what earns links rather than asking for them. |
| **Case study depth** | Add testimonials with attribution; revisit the four deep studies with post-launch results. |
| **Advanced schema** | `FAQPage` on service pages; `HowTo` where genuinely applicable; `knowsAbout` expansion on `Person`. |
| **Entity consolidation** | Push for a brand knowledge panel: consistent NAP-equivalent identity across every profile, plus Wikidata if a notability case exists. |
| **Optional: `/uses`** | Cheap, well-linked page type in developer circles. |
| **Migration cleanup** | Confirm the `.com.np` redirect is still serving 301s and that the old property shows the address change as complete. Never remove the redirect. |

**Phase 4 exit criteria** — 30+ non-brand top-10 keywords; organic-attributed enquiries in GA4; knowledge panel present.

---

## Dependencies and sequencing

```
1.1 Fix metadata.url  ✅ DONE
        │
1.8 Redirect .com.np → .com   ← now blocks everything downstream
        │
        ├──> 1.13 verify .com in GSC ──> 1.14 Change of Address
        ├──> deploy ──> 1.4 sitemap emits correct host
        └──> 1.15 resubmit + reindex ──> meaningful GSC baseline
        └──> 2.2 Person @id ──> 2.3 WebSite ──> 2.4/2.5 Breadcrumb/ItemList
                                                        │
1.5 metadataBase ──> 3.1 OG image ──> 3.2 per-project OG images
                                                        │
4.1 remove force-dynamic ──> 4.3 static project pages ──> 4.4 TTFB gain
                                                        │
Phase 2 pages ──> Phase 3 internal linking ──> Phase 3 link building
```

Two hard rules:
- **Nothing in Phases 2–4 should start before the `.com.np` redirect (1.8) is live.** Content published under a broken canonical accrues nothing.
- **Do not build a page you have not planned an internal link to.** Orphans are wasted work.

---

## Resource summary

| Phase | Duration | Est. hours | Cash cost |
|---|---|---|---|
| 1 — Foundation | 4 weeks | ~20 h | $0 (all free tooling) |
| 2 — Expansion | 8 weeks | ~60 h | $0 |
| 3 — Scale | 12 weeks | ~80 h | $0–50/mo optional tooling |
| 4 — Authority | 6 months | ~100 h | $0–50/mo |

The dominant cost is writing, not engineering. Phase 1's engineering work is roughly a day; the remaining ~240 hours are content. Plan accordingly — that is the constraint that actually determines whether this plan succeeds.

---

*Companion documents:* [SEO-STRATEGY.md](SEO-STRATEGY.md) · [SITE-STRUCTURE.md](SITE-STRUCTURE.md) · [COMPETITOR-ANALYSIS.md](COMPETITOR-ANALYSIS.md) · [CONTENT-CALENDAR.md](CONTENT-CALENDAR.md)
