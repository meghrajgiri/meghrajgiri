# SEO Audit — meghrajgiri.com

**Date:** 2026-09-08
**Scope:** 28 URLs, all fetched live. Previous audit: [audit-2026-09-05](../audit-2026-09-05/).
**Health score:** 82 / 100 (was 61)

Every finding below was verified against a live response. Where a specialist pass
reported something that did not survive checking, the correction is recorded rather than
the original claim — two such corrections are marked.

---

## What changed since 2026-09-05

| Then | Now |
|---|---|
| 8 `[N weeks]`-style placeholders live, including inside JSON-LD | **Zero** placeholders across 28 pages and every JSON-LD block |
| `.com.np` serving duplicate content, ranking instead of `.com` | All three `.com.np` hosts 308 → `www.meghrajgiri.com`, path-preserving |
| 9 URLs | 28 URLs, no orphans |
| 7 projects, 1 case study | 15 projects, 15 case studies |
| `© 2024` in the footer | `© 2026` |
| Person entity thin, `addressLocality: "Nepal"` | Person with stable `@id` on all 28 pages, Butwal / Lumbini / NP |

The structural work is done. What remains is almost entirely **accuracy of the copy**,
not architecture.

---

## Critical and high

### 1. The homepage H1 contains no space — HIGH

```html
<h1>Full stack developer in Nepal<span class="block">building products people love to use</span></h1>
```

`<span class="block">` breaks the line visually, so it looks correct. There is no
whitespace character, so every text extractor reads:

> Full stack developer in Nepal**building** products people love to use

`Nepalbuilding` is a nonsense token in the single most important on-page element, and it
is what a screen reader announces. Source: `src/components/sections/HeroSection.tsx:100`
— JSX strips the newline between `{mainTitle?.line1}` and the `<span>`.

Scanned all 28 pages for the same pattern; this is the only instance.

**Fix:** `{mainTitle?.line1}{" "}` before the span.

### 2. Three different case-study counts, none of them right — HIGH

The site has **15** published case studies. It claims:

| Page | Says |
|---|---|
| `/` (stat card) | **15** ✓ |
| `/projects` (visible copy **and** `CollectionPage.description`) | Seven |
| `/hire` | seven |
| `/blog/best-full-stack-developer-in-nepal-2026` | seven |
| `/skills` | thirteen |

`/projects` contradicts itself inside one JSON-LD graph: `CollectionPage.description`
says "Seven case studies" while the `ItemList` beside it carries
`numberOfItems: 15` with 15 entries.

This is the failure mode the owner has shipped before, in a new form: a number that was
true when written and was never re-derived. Any reader or AI engine can disprove it by
counting.

**Fix:** derive the count at render time from the projects array rather than restating it
in copy. It has now been wrong three separate ways.

### 3. Years of experience says six on the homepage, five everywhere else — HIGH

- `/` hero: "with **Six years** building web and mobile products"
- `/` stat card: "**6+** Professional experience"
- `/about`, `/skills`, `/experience`, `/hire`, `/blog/*`: "**five years**"

The `Experience` ItemList supports five — earliest `startDate` is 2020. The homepage is
the page that ranks for the brand query, and it is the one that disagrees.

### 4. A quantified claim on /about that the named project does not support — HIGH

`/about`:

> "Redesigning Bookvid's onboarding raised user adoption by 35% and retention by 25%."

`/projects/bookvid` contains none of: *onboarding*, *35%*, *25%*, *adoption*,
*retention*. The case study describes scheduling and video-provider work.

This is a legacy line: the Bookvid case study was rewritten to use Inseed's published
metrics, and the older claim survived on `/about` with nothing left to back it.

**Fix:** either restore the figures to the case study with their source, or drop the
sentence. A specific, quantified, attributable claim with no supporting page is the worst
kind to leave standing.

### 5. A repeated performance metric with no case study behind it — MEDIUM-HIGH

> "cut initial load time by 30%" · "an admin panel loaded five times faster"

Appears **four times** across `/about`, `/contact` and `/hire/nextjs-developer-nepal`,
attributed to Prabidhi Labs. `/experience` confirms the role (React Developer, 2022–2023)
but there is no Prabidhi Labs case study, so nothing on the site substantiates it.

Repetition makes it more prominent, not more supported.

---

## Medium

### 6. Every page ships every case study

`/contact` is 170.9 KB uncompressed and contains the full prose of all 15 case studies
while rendering none of them. The `(site)` layout filters *unpublished* projects but does
not strip the heavy fields.

Unused raw payload: **103 KB — 91%** of the projects data.

Measured rather than assumed: a partial strip saved **2.6 KB gzipped (6%)**. The wire
saving is modest; the real cost is JSON parse and hydration on mid-range phones, plus
shipping content the page cannot use. `/projects/[slug]` fetches its own project
server-side, so slimming the client config is safe.

### 7. Eleven meta descriptions are truncated, five titles are over length

Descriptions 185–223 characters (target ≤160): `/`, `/about`, `/skills`, `/contact`,
`/experience`, `/hire`, both `/hire/*`, all three `/blog/*`.
Titles over 60: two blog posts, `/projects/cannabiz-elite`, `/` (62).

No duplicates anywhere — 28 unique titles, 28 unique descriptions.

### 8. Five case studies stop before the structure does

Missing Constraints / Key decisions / Where it got hard / What I'd do differently:

| Page | Words | Gap |
|---|---|---|
| `/projects/epiphra` | 585 | no "what I owned" block; back half absent |
| `/projects/selfbet` | 488 | ends after "what I owned" |
| `/projects/artizan` | 513 | ends after "what I owned" |
| `/projects/khatapata` | 654 | four blocks collapsed into one paragraph |
| `/projects/hamrotrips` | 949 | stops after "why it is built the way it is" |

`/projects/react-weekly-availability-calendar` (1,718 words), `/projects/thriftverse` and
`/projects/thrive-rx` deliver every block and are the template.

### 9. Structured data states one thing the page never does

`Person.hasCredential` lists the freeCodeCamp *JavaScript Algorithms and Data Structures*
certificate. It appears in no visible copy on any page.

**Correction to the schema pass:** it also flagged `alumniOf` "Kalika Manavgyan Secondary
School" as unstated. Verified — it **is** visible on `/about`. Only freeCodeCamp is
unstated.

### 10. Internal linking is top-heavy

Ten hub pages get 27 inbound links each — the structure sitelinks are built on, and it is
correct. But **eight project pages and all three blog posts have exactly one inbound
link**, from their index. The blog posts targeting the priority commercial queries are the
least-linked pages on the site.

---

## Low

- **`BlogPosting` has no `image`** on all three posts. Not a validation error — Google
  lists no required properties for Article — but it forfeits thumbnail eligibility.
- **Sitemap `lastmod` for all three blog posts is frozen** at `2026-09-05T00:00:00.000Z`
  while other URLs carry `2026-09-06T14:44:26.193Z`.
- **`Person.image` is a single URL**, not an array of aspect ratios.
- **No `dateModified`** on any post.
- **Two `ProfilePage` nodes** (`/` and `/about`) for one Person. Not an error; it means the
  GSC Enhancement report tracks two URLs. `/about` is the safer long-term anchor — Google's
  ProfilePage guidance wants a page whose *primary* focus is one person, and the homepage
  mixes in a project grid and stats row.

---

## What is already right — do not change it

- **Zero placeholders.** All 28 pages and every JSON-LD block scanned for bracketed
  template text and lorem ipsum. Clean.
- **28 unique titles, 28 unique descriptions, one H1 per page, canonical on every page.**
- **Zero images missing alt text.** `og:image` on all 28, including per-project OG cards.
- **No orphan pages.**
- **Domain consolidation complete** — all three `.com.np` hosts and the `.com` apex 308,
  path-preserving.
- **Every AI crawler is permitted** — GPTBot, ClaudeBot, PerplexityBot, CCBot, Bingbot,
  OAI-SearchBot, Google-Extended all return 200. Naming them explicitly would change
  nothing functionally.
- **Server rendering is real.** Substantive text is in the raw HTML; `x-nextjs-prerender: 1`.
- **One `Person` `@id` referenced across all 28 pages** as author, publisher, about and
  mainEntity. This is a genuinely well-built entity graph and uncommon on a solo portfolio.
- **`BreadcrumbList` is textbook-correct** on every non-root page and correctly absent on
  the root.
- **`worksFor` cross-checks against the dated Experience data** and passes.
- **`ContactPage.description` matches the visible copy word for word.**
- **Honest writing where it costs something** — `/projects/selfbet`: "Not much of this is
  technically difficult, and saying otherwise would be dressing it up." That is the
  trustworthiness signal Google's guidelines reward, and it should be extended into the
  missing sections rather than diluted.

---

## Two corrections to the specialist passes

Recorded because the originals would have sent work in the wrong direction:

1. The content pass reported the College Cost Secrets `$100M` / Kevin Harrington claim as
   **hidden in JSON-LD and invisible on the page**. Verified: it appears in the visible
   copy *and* the JSON-LD. They agree, so it is not a hidden-schema leak. It remains a
   claim about a client's business rather than about the work, which is a judgement call
   for the owner — but it is not the severity it was reported at.
2. The schema pass reported `alumniOf` "Kalika Manavgyan Secondary School" as unstated on
   the page. Verified: it is visible on `/about`.

---

## Scoring

| Category | Weight | Score | Why |
|---|---|---|---|
| Technical SEO | 22% | 93 | Clean; sitemap `lastmod` not tracked per page |
| Content Quality | 23% | 72 | Unsupported claims; three wrong counts; five thin case studies |
| On-Page SEO | 20% | 82 | H1 bug; 11 long descriptions; otherwise fully unique |
| Schema | 10% | 85 | Valid throughout; CollectionPage count wrong; one unstated credential |
| Performance | 10% | 78 | Payload bloat; CWV not measurable (PSI quota) |
| AI Search Readiness | 10% | 74 | Entity contradictions; first-person passages; short answers |
| Images | 5% | 100 | Zero missing alt, correct dimensions, OG cards |
| **Overall** | | **82** | was 61 |

**Not measured:** Core Web Vitals. PageSpeed Insights' keyless API quota was exhausted.
Run it in a browser — same data, no quota — and this score should be revisited.
