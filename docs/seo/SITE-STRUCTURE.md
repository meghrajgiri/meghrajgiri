# Site Structure — meghrajgiri.com.np

**Prepared:** 2026-08-30
**Canonical host:** `https://www.meghrajgiri.com` (apex 301s to `www` — verified working)
**Legacy host:** `https://www.meghrajgiri.com.np` — must 301 to the canonical; currently still serving content

---

## 1. Current structure

```
https://www.meghrajgiri.com
├── /                              Home — ~2,500 words, all sections as anchors
│   ├── #projects                  (no independent URL)
│   ├── #skills                    (no independent URL)
│   ├── #about                     (no independent URL)
│   └── #contact                   (no independent URL)
├── /projects                      Listing — 277 words
│   ├── /projects/thriftverse      ~123 words
│   ├── /projects/cannabiz-elite   ~120 words
│   ├── /projects/lyve             ~120 words
│   ├── /projects/khatapata        ~120 words
│   ├── /projects/college-cost-secrets
│   ├── /projects/bookvid
│   └── /projects/yume
│
├── /cms/**                        CMS — noindex + disallowed in robots.txt ✓
└── /api/**                        Disallowed in robots.txt ✓
```

**9 indexable URLs — served in duplicate.** Both `www.meghrajgiri.com` and `www.meghrajgiri.com.np` return all 9 with no redirect between them, so the real count Google sees is 18. The sitemap route still emits the old `meghraj.dev` host until the next deploy. See [SEO-STRATEGY.md](SEO-STRATEGY.md) §0.

### Structural problems

1. **Everything of substance is an anchor.** About, skills, and contact content exists but has no URL, so it cannot rank, cannot be linked to, and cannot carry its own schema.
2. **Two levels of depth, no middle tier.** There is nothing between "the whole person" and "one project". No service, no topic, no capability page.
3. **Seven thin leaves.** `/projects/*` at ~120 words each, all from one template — a doorway-page pattern.
4. **No internal linking beyond navigation.** Project pages link back to `/projects` and to `/#contact`. Nothing links laterally.

---

## 2. Target structure (12 months)

```
https://www.meghrajgiri.com
│
├── /                                          Home — hub, links to every pillar
│
├── /services/                                 Service index (ProfessionalService)
│   ├── /services/mvp-development              MVP builds for startups
│   ├── /services/react-native-apps            Cross-platform mobile
│   └── /services/marketplace-development      Multi-sided / multi-tenant platforms
│
├── /work/                                     Case study index (ItemList)   ← renamed from /projects
│   ├── /work/thriftverse                      DEEP: marketplace + eSewa + NCM logistics
│   ├── /work/cannabiz-elite                   DEEP: Australian telehealth, Medusa v2
│   ├── /work/khatapata                        DEEP: offline-first inventory PWA
│   ├── /work/lyve                             DEEP: ticket & costume resale marketplace
│   ├── /work/college-cost-secrets             Card only (or noindex stub)
│   ├── /work/bookvid                          Card only
│   └── /work/yume                             Card only
│
├── /blog/                                     Article index
│   ├── /blog/{article-slug}                   12 in year one
│   └── /blog/tag/{topic}                      Only once ≥5 articles share a tag
│
├── /about                                     ProfilePage — bio, education, experience, credentials
├── /contact                                   ContactPage — form, availability, response time
├── /uses                                      Optional: stack/tooling page (cheap link magnet)
│
├── /sitemap.xml                               ← must emit meghrajgiri.com.np
├── /robots.txt                                ✓ correct today
└── /opengraph-image                           ← does not currently exist
```

### On renaming `/projects` → `/work`

The agency template favours `/work`, and "case study" reads more commercially than "project". **But renaming costs 7 redirects and resets whatever equity those URLs hold, for a marginal semantic gain.**

**Recommendation: keep `/projects`.** The URL is not what makes these pages weak — 120 words is. Spend the effort on depth, not on a redirect map. If the rename ever happens, do it in the same change as the Option B domain migration, not on its own.

*The remainder of this document uses `/projects` accordingly.*

---

## 3. URL conventions

| Rule | Value |
|---|---|
| Protocol | `https` only |
| Host | `www.meghrajgiri.com` — apex 301s to `www`; all `.com.np` URLs 301 here |
| Case | lowercase |
| Word separator | hyphen |
| Trailing slash | none (Next.js default; stay consistent) |
| Depth | max 3 segments |
| Dates in URLs | never — articles must be updatable without a redirect |
| Stop words | drop them (`/blog/supabase-rls-marketplace-sellers`, not `/blog/how-to-use-supabase-rls-for-your-marketplace-sellers`) |

---

## 4. Internal linking model

Hub-and-spoke, with the homepage as the top hub and each service page as a topical hub.

```
                          ┌──────────┐
                          │   HOME   │
                          └────┬─────┘
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
      ┌──────────────┐  ┌────────────┐  ┌───────────┐
      │  /services   │  │ /projects  │  │   /blog   │
      └──────┬───────┘  └─────┬──────┘  └─────┬─────┘
             │                │                │
   ┌─────────┼────────┐       │          ┌─────┴─────┐
   ▼         ▼        ▼       ▼          ▼           ▼
 mvp   react-native  marketplace   case studies   articles
   │         │        │       │          │           │
   └─────────┴────────┴───┬───┴──────────┘           │
                          │                          │
              proof: each service page links to      │
              2–3 case studies that demonstrate it   │
                          │                          │
                          └──────────┬───────────────┘
                                     ▼
                          articles link "up" to the
                          service page they support
```

### Linking rules

| From | To | Rule |
|---|---|---|
| Home | Every service page, `/projects`, `/blog`, `/about`, `/contact` | Real `<a href>` in nav and body — not anchor jumps |
| Service page | 2–3 case studies proving that service | Descriptive anchor text ("the Thriftverse marketplace build"), never "read more" |
| Service page | 2–4 supporting articles | Contextual, in-body |
| Case study | 1 service page + 1–2 related case studies | "Related work" block |
| Article | 1 service page (the money link) + 1–2 sibling articles | In-body, contextual |
| Every page | `/contact` | One clear CTA |

**Orphan rule:** no page ships without at least two internal inbound links from outside the global nav. Add this to the pre-publish checklist.

**Anchor-text rule:** vary it. Six articles all linking to `/services/react-native-apps` with the identical phrase reads as manipulation.

---

## 5. Sitemap architecture

Single `sitemap.xml` is correct at this scale — do not split until ~500 URLs.

Required changes to [src/app/sitemap.ts](../../src/app/sitemap.ts):

1. ~~**Base URL must resolve.**~~ Fixed 2026-08-30 — the Supabase `metadata.url` row and the code fallback both read `https://www.meghrajgiri.com`. **Still to do:** harden the code so a non-matching host cannot be published from the admin UI, and redeploy so the build-time sitemap output picks up the new value.
2. **`lastModified` is `new Date()` for every URL** — i.e. "everything changed just now," on every crawl. That is noise, and crawlers learn to ignore it. Use the config row's `updated_at`, or a per-project timestamp.
3. **Add the new URLs** as they ship: `/about`, `/contact`, `/services/*`, `/blog`, `/blog/*`.
4. **`priority` and `changeFrequency` are ignored by Google.** Harmless to keep; do not spend time tuning them.

Quality gate before any URL enters the sitemap:

- [ ] Returns 200
- [ ] Self-referencing canonical on the canonical host
- [ ] Not `noindex`
- [ ] 600+ words of unique content (project stubs fail this today)
- [ ] At least two internal inbound links
- [ ] Unique title and meta description

---

## 6. Page-type template requirements

| Page type | Min words | H1 | Schema | Required elements |
|---|---|---|---|---|
| Home | 1,500 | Value proposition | `Person` + `WebSite` + `ProfilePage` | Links to all pillars, one primary CTA |
| Service | 800 | Service name + audience | `Service`, `ProfessionalService` | Deliverables, process, 2–3 proof case studies, FAQ, CTA |
| Case study | 1,000 | Project name + outcome | `CreativeWork`/`Article` + `BreadcrumbList` | Problem, constraints, approach, architecture, **measurable result**, tech list, related work |
| Article | 1,200 | Question or claim | `BlogPosting` + `Person` author + `BreadcrumbList` | Author bio, publish + updated date, code samples, link to a service page |
| About | 800 | Name + specialism | `ProfilePage` + `Person` | Photo, bio, education, experience, `knowsAbout`, verified `sameAs` |
| Contact | 300 | Clear ask | `ContactPage` | Form, real email on the canonical domain, availability, response time |

---

## 7. Crawl-budget and index-hygiene notes

At 9–40 URLs crawl budget is a non-issue. Index *hygiene* is not:

- Keep `/api/` disallowed. ✓ already correct.
- The CMS lives at `/cms` on the canonical host — `noindex, nofollow` on its layout and `Disallow: /cms` in robots.txt. `/admin` no longer exists and returns 404 by design; it was never indexed, so there is nothing to redirect.
- ~~Keep `/hd` `noindex`.~~ Route removed 2026-08-30. If `hd.meghrajgiri.com` is still attached to this Vercel project, detach it — the subdomain now resolves to a 404.
- Add `noindex` to any project stub that will not be deepened, and drop it from the sitemap in the same change.
- Never let `/blog/tag/*` pages exist with fewer than 5 posts — thin archive pages are index bloat.
- Watch for a query-string duplicate if the `/projects` category filter ever becomes URL-driven; it must be client-side, or canonicalised to the clean URL.

---

*Companion documents:* [SEO-STRATEGY.md](SEO-STRATEGY.md) · [COMPETITOR-ANALYSIS.md](COMPETITOR-ANALYSIS.md) · [CONTENT-CALENDAR.md](CONTENT-CALENDAR.md) · [IMPLEMENTATION-ROADMAP.md](IMPLEMENTATION-ROADMAP.md)
