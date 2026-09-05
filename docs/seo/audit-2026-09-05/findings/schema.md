# Structured Data Audit & Redesign — meghrajgiri.com
_Audited 2026-09-05. Built entirely on `CONTEXT.md` facts and the live crawl/source already collected — nothing re-verified._

---

## 1. Detection — what's emitted today

Source: `src/lib/schema.ts` (`buildPerson`, `buildWebSite`, `buildBreadcrumbs`, `graph`), called from
`src/app/(site)/page.tsx`, `.../projects/page.tsx`, `.../projects/[slug]/page.tsx`. One `<script type="application/ld+json">`
per page, single `@graph`, JSON-LD only (no Microdata/RDFa anywhere) — correct format choice.

| Page | Nodes emitted |
|---|---|
| `/` | `Person` (`#person`), `WebSite` (`#website`) |
| `/projects` | `BreadcrumbList`, `ItemList` (untyped page wrapper, no `@id`) — **no `Person`** |
| `/projects/[slug]` (×7) | `Person`, `BreadcrumbList`, `CreativeWork` (`#work`) |

`@context` is `https://schema.org` everywhere (correct, no trailing slash issue on `https`). All confirmed by pulling
the live `<script>` block from `page_.html` and `page_projects_bookvid.html` and pretty-printing it — matches
`CONTEXT.md` exactly.

---

## 2. Validation results

| # | Block / property | Result | Detail |
|---|---|---|---|
| 1 | `Person.address.addressLocality: "Nepal"` | **FAIL (Critical)** | `addressLocality` must be a city/town. Nepal is the country and belongs in `addressCountry`. As written this is a malformed `PostalAddress` — it also throws away the one fact (Butwal) that would actually help disambiguate this Person from the other Giris polluting the brand SERP. |
| 2 | `Person.image` | **FAIL — missing** | No `image` on the Person node at all, on any page. Google's Person/entity guidance and every knowledge-panel heuristic weight this heavily; a real headshot already exists unused at `/Meghraj.jpg` in `public/`. |
| 3 | `Person.description` | **FAIL — missing** | No bio string on the entity itself (only scattered across page copy). |
| 4 | `Person.sameAs` | **FAIL — incomplete** | LinkedIn + GitHub only. The single highest-authority third-party profile — the Toptal Verified Expert resume — is absent from `sameAs` *and* absent from the site body (per `CONTEXT.md`). This is very likely a direct contributor to the entity-pollution problem: there is currently no machine-readable link at all between `meghrajgiri.com` and the Toptal credential that should be the strongest disambiguating signal available. |
| 5 | `Person.alumniOf`, `.worksFor`, `.hasCredential`, `.hasOccupation`, `.nationality`, `.homeLocation`, `.knowsLanguage` | **FAIL — missing** | None present. All are legitimate, well-supported additions per `CONTEXT.md`'s resume data (§4 below). |
| 6 | `Person.knowsAbout` (27 items) | **WEAK, not a spec fail** | Valid per schema.org (accepts `Text`), but it's a flattened dump of every tool in the skills widget, including process/tooling nouns (`Agile/Scrum`, `CI/CD`, `Git & GitHub`, `Testing (Jest)`, `Figma`) that (a) aren't topically distinguishing and (b) aren't evidenced by any shipped project in `CONTEXT.md`. Diluting `knowsAbout` with generic tooling weakens rather than strengthens topical authority for the actual target queries (frontend/full-stack developer, React/Next.js/React Native). |
| 7 | `Person.jobTitle: "Full Stack Developer — Product-Focused"` | **PASS, weak style** | Valid `Text`, no spec issue. The em-dash marketing tagline inside a structured `jobTitle` is unusual but not invalid; low priority. |
| 8 | `Person` re-declared in full on every page | **PASS (by design)** | `schema.ts`'s own comment explains this is deliberate — every page must independently resolve to the same entity rather than relying on cross-document `@id` merging, which Google doesn't guarantee. Correct approach; keep it. |
| 9 | `WebSite` node | **PASS** | Valid, `publisher` correctly references `Person` by `@id`. No `SearchAction` — fine, there's no site search to back one. |
| 10 | `BreadcrumbList` — item URLs | **WEAK** | Home crumb is hard-coded as `${baseUrl}/` (trailing slash) while the canonical tag and `og:url` on every page are `https://www.meghrajgiri.com` (no trailing slash) — confirmed by reading `page_.html`'s `<link rel="canonical">`. `ListItem.item` should match the canonical URL of the linked page exactly. Minor, but free to fix. |
| 11 | `/projects` — no `Person` node | **FAIL — inconsistent** | Every other page reinforces the entity; `/projects` silently drops it, breaking the "every page resolves to the same Person" pattern the codebase's own comment describes. |
| 12 | `/projects` — `ItemList` has no `@id`, no wrapping page-level node | **WEAK** | Works as bare structured data but isn't tied into the graph (no `@id` to reference from project pages, no `CollectionPage`/`WebPage` describing the page itself). |
| 13 | `CreativeWork.genre: project.category` | **WEAK** | For Bookvid and Yume this literally emits `"genre": "Other"` (confirmed against the live JSON-LD) — `genre` is meant for a real classificatory value; `"Other"` is a placeholder-grade non-value in a public field. |
| 14 | `CreativeWork.dateCreated: project.year` (bare `"2024"`, `"2026"`) | **PASS** | Reduced-precision ISO 8601 (`YYYY`) is valid when the month/day genuinely aren't known. No fix needed. |
| 15 | `CreativeWork.abstract` on `/projects/cannabiz-elite` | **FAIL (Critical) — placeholder text in production markup** | Pulled and parsed the live JSON-LD: `abstract` is `"Cannabiz Elite is a clinic management system for Australian cannabis and telehealth clinics, built on Medusa v2 and shipped in **[N weeks]**. The hardest part was not the application — it was **[specific constraint]**, which required **[specific solution]**."` — this is the unfilled `caseStudy.summary` template from `fallback.json`, shipped verbatim into structured data on the live site. This is exactly the "no placeholder text" checklist failure, and it's currently live, not hypothetical. **Fix this before anything else in this report** — either backfill the real case-study copy or have the page/JSON-LD builder omit `caseStudy.summary`/`abstract` whenever it still contains bracketed placeholders. |
| 16 | `CreativeWork` type choice | **WEAK, not a fail** | All seven are shipped software products (web/mobile apps), not editorial works. Plain `CreativeWork` is valid but underspecified — `SoftwareApplication` (a `CreativeWork` subtype) would carry the same properties plus `applicationCategory`/`operatingSystem`, and is a better entity match. No `aggregateRating`/`offers` should be added without real data — omitting them just means no App rich-result eligibility, which is fine; don't fabricate ratings to chase one. |

**Two Critical items, everything else Medium/Info:** the `addressLocality` mis-tag and the cannabiz-elite placeholder-text leak are the only true spec/policy violations; the rest are missed opportunities or style weaknesses.

---

## 3. Redesigned `Person` node

Every addition below is a fact already sitting in `CONTEXT.md`'s resume section — nothing invented, nothing pulled from generic knowledge about Nepal, Toptal, or Tribhuvan University beyond what's given.

| Property | Value | Why it disambiguates |
|---|---|---|
| `image` | `https://www.meghrajgiri.com/Meghraj.jpg` | Confirmed this file already exists in `public/` and is unused. A real photo is one of the strongest, cheapest signals against a same-name Wikipedia entity that (per `CONTEXT.md`) has no photo association with this person at all. |
| `description` | One-line bio in the person's own words/facts | Gives Google a canonical description string to prefer over the "stale" `.com.np` meta description currently surfacing in the SERP. |
| `address` / `homeLocation` | Butwal · Lumbini Province · NP | Fixes the `addressLocality: "Nepal"` bug and adds a real, specific, checkable location — country-level alone is useless for disambiguation among people who share a surname and a country; a city is not. |
| `nationality` | Country: Nepal | Reinforces the same geographic cluster as a distinct property Google's entity resolution reads independently of address. |
| `knowsLanguage` | English, Nepali | Both evidenced: the entire public resume/site is in English; Nepali is the home-country language. Signals a real bilingual professional profile rather than a name-only match. |
| `alumniOf` | Institute of Science and Technology (IOST), Tribhuvan University | A named, checkable institution is one of the highest-value disambiguators there is — none of the unrelated Giri/Sharma entities in the polluted SERP share this affiliation. |
| `worksFor` | SCSS Consulting (current, 2025–present) | Current employer anchors the entity to a real, present-tense professional context instead of a static "freelancer" claim. |
| `hasOccupation` | Full Stack Developer, `occupationLocation`: Butwal, NP | Ties the job title to the same specific place as the address — redundant on purpose; entity resolution rewards independently-corroborating properties, not single mentions. |
| `hasCredential` | Toptal Verified Expert in Engineering (member since 2026-03-10); freeCodeCamp JavaScript Algorithms and Data Structures (2023-07) | Two independently-verifiable, third-party-issued credentials. Toptal in particular is a vetting body with its own domain authority — linking to it in structured data (not just prose) is the single highest-leverage fix available here. |
| `sameAs` | LinkedIn, GitHub, **Toptal resume** (added) | Per `CONTEXT.md`, the Toptal resume is currently linked from *nowhere* on the site. Adding it to `sameAs` is the most direct fix for "Toptal profile does not surface" in the SERP-pollution finding — it's the connective tissue between the domain and the credential that actually vets this person. |
| `knowsAbout` | Trimmed from 27 → 14 | Kept only topics either (a) explicitly evidenced by a shipped project's tech stack in `CONTEXT.md`, or (b) directly matching the three target queries. Dropped generic process/tooling nouns (`Agile/Scrum`, `CI/CD`, `Git & GitHub`, `Testing (Jest)`, `Figma`, `Docker`, `AWS`, `GitHub Actions`, `Vercel`, `Framer Motion`, `React Query`, `Express`, `REST APIs`, `Native APIs`, `iOS Development`, `Android Development`) — none of these appear in any of the seven projects' actual `technologies` arrays, so they were unsupported claims diluting the topical signal, not adding to it. |

Note on `nationality`: this is inferred from residence + the Nepali secondary-school/university facts in `CONTEXT.md`, not from an explicit citizenship statement — reasonable, but worth a one-line confirmation from Meghraj before shipping, since `nationality` strictly implies citizenship rather than residence.

---

## 4. Additional node types and placement

| Node | Page | Status | Notes |
|---|---|---|---|
| `ProfilePage` (WebPage subtype) | `/` | **Add** | Homepage currently has no page-level node at all, only `Person` + `WebSite`. Since the homepage *is* Meghraj's own bio/portfolio page, `ProfilePage` with `mainEntity` → `Person` is the correct, specific type — stronger than generic `WebPage`. |
| `CollectionPage` | `/projects` | **Add**, wrapping existing `ItemList` | The `ItemList` already exists and is already correctly scoped to the 7 published projects (`hamro-motors` is `published: false` and is correctly excluded — verified against `fallback.json`). It just needs a page-level `CollectionPage` node with a stable `@id`, plus the missing `Person` reference this page currently drops. |
| `ItemList` | `/projects` | **Improve, don't replace** | Give it an `@id`, and add `image` to each `ListItem` alongside the existing `url`/`name` — low-effort, higher entity value. |
| `SoftwareApplication` (replacing bare `CreativeWork`) | each `/projects/[slug]` | **Upgrade** | Same properties as today's `CreativeWork` (it's a subtype) plus `applicationCategory` and `operatingSystem`, and — critically — real metrics carried as `additionalProperty` (`PropertyValue`) instead of nowhere: Bookvid's "+35% user adoption, +25% retention" and Yume's "10K+ users, 25%+ paying conversion, acquired by National Debt Relief" are already *visible on-page* in `fallback.json`'s `longDescription`, so mirroring them into structured data doesn't create a markup/content mismatch — it reflects what's already there. Do **not** add `aggregateRating` or `offers` — no real review/pricing data exists for any project, and Google's structured-data policy treats fabricated ratings as a manual-action risk. |
| `Service` (not `ProfessionalService`) | `/` `#services` | **Do NOT add yet** | `ProfessionalService` is scoped to regulated professions (legal, medical, etc.) and is the wrong fit for freelance software development; plain `Service` is correct *if and when* this section ships. But `CONTEXT.md` states the nav links to a "Services" anchor that **renders no content** — adding `Service` schema against an empty/non-existent section would be structured data with no matching visible content, which is the exact "markup misrepresents the page" problem Google's general guidelines warn against. **Sequencing matters: ship the Services section copy first, then add the schema** — draft block provided below, clearly marked, so it's ready the moment the content exists. |
| `FAQPage` | Nepal-intent content (if built) | **Info-priority only, optional** | Per current rules, Google retired FAQ rich results for all sites (May 7 2026) — there is **no SERP benefit** for this site regardless of content. Any value would be speculative AI/GEO citation benefit for ChatGPT/Perplexity-style answer engines, which directly matches the user's stated goal #2 but is explicitly **unconfirmed**. If pursued: (a) it must sit under genuine, visible, on-page Q&A copy — not a schema-only bolt-on — and (b) it should only be built if Meghraj explicitly accepts that the AI/GEO upside is unproven. Not recommended as a priority item; included here only because the brief asked where it would belong. `QAPage` does not apply — there is no user-submitted Q&A page on this site. |

---

## 5. Copy-pasteable JSON-LD

### 5a. Redesigned `Person` (home + every project page, replaces current `buildPerson()` output)

```json
{
  "@type": "Person",
  "@id": "https://www.meghrajgiri.com/#person",
  "name": "Meghraj Giri",
  "url": "https://www.meghrajgiri.com",
  "image": "https://www.meghrajgiri.com/Meghraj.jpg",
  "jobTitle": "Full Stack Developer — Product-Focused",
  "description": "Full-stack developer based in Butwal, Nepal, specializing in React, Next.js, TypeScript, and React Native for startups and product teams. Toptal Verified Expert in Engineering with 5+ years of experience.",
  "email": "meghrajgiri56@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Butwal",
    "addressRegion": "Lumbini Province",
    "addressCountry": "NP"
  },
  "homeLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Butwal",
      "addressRegion": "Lumbini Province",
      "addressCountry": "NP"
    }
  },
  "nationality": {
    "@type": "Country",
    "name": "Nepal"
  },
  "knowsLanguage": [
    { "@type": "Language", "name": "English" },
    { "@type": "Language", "name": "Nepali" }
  ],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Institute of Science and Technology (IOST), Tribhuvan University"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "SCSS Consulting"
  },
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Full Stack Developer",
    "occupationLocation": {
      "@type": "City",
      "name": "Butwal",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Lumbini Province",
        "addressCountry": "NP"
      }
    },
    "skills": ["React", "Next.js", "TypeScript", "React Native", "Node.js"]
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "certificate",
      "name": "Verified Expert in Engineering",
      "url": "https://www.toptal.com/developers/resume/meghraj-giri",
      "recognizedBy": { "@type": "Organization", "name": "Toptal" },
      "dateCreated": "2026-03-10"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "certificate",
      "name": "JavaScript Algorithms and Data Structures",
      "recognizedBy": { "@type": "Organization", "name": "freeCodeCamp" },
      "dateCreated": "2023-07"
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/in/meghrajgiri/",
    "https://github.com/meghrajgiri",
    "https://www.toptal.com/developers/resume/meghraj-giri"
  ],
  "knowsAbout": [
    "Full-Stack Web Development",
    "Frontend Development",
    "Mobile App Development",
    "React",
    "React Native",
    "Next.js",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "PostgreSQL",
    "Supabase",
    "Firebase",
    "Tailwind CSS",
    "Expo"
  ]
}
```

### 5b. `WebSite` (unchanged, kept for reference — no fix needed)

```json
{
  "@type": "WebSite",
  "@id": "https://www.meghrajgiri.com/#website",
  "url": "https://www.meghrajgiri.com",
  "name": "Meghraj Giri",
  "description": "Building fast, scalable web & mobile apps for startups. React, TypeScript, Next.js, React Native specialist. Available for new projects.",
  "inLanguage": "en-US",
  "publisher": { "@id": "https://www.meghrajgiri.com/#person" }
}
```

### 5c. `ProfilePage` — new, add to `/` graph

```json
{
  "@type": "ProfilePage",
  "@id": "https://www.meghrajgiri.com/#webpage",
  "url": "https://www.meghrajgiri.com",
  "name": "Meghraj Giri — Product-Minded Full Stack Developer",
  "description": "Building fast, scalable web & mobile apps for startups. React, TypeScript, Next.js, React Native specialist. Available for new projects.",
  "inLanguage": "en-US",
  "isPartOf": { "@id": "https://www.meghrajgiri.com/#website" },
  "mainEntity": { "@id": "https://www.meghrajgiri.com/#person" }
}
```

### 5d. `/projects` — `CollectionPage` + improved `ItemList` + `Person` (replaces current graph)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@id": "https://www.meghrajgiri.com/#person", "...": "full Person node from 5a" },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.meghrajgiri.com" },
        { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://www.meghrajgiri.com/projects" }
      ]
    },
    {
      "@type": "CollectionPage",
      "@id": "https://www.meghrajgiri.com/projects#webpage",
      "url": "https://www.meghrajgiri.com/projects",
      "name": "Projects | Meghraj Giri - Full Stack Developer",
      "description": "Explore my portfolio of projects spanning E-Commerce, Healthcare, Ed-Tech, Fin-Tech, and more. Built with React, Next.js, TypeScript, and modern technologies.",
      "isPartOf": { "@id": "https://www.meghrajgiri.com/#website" },
      "about": { "@id": "https://www.meghrajgiri.com/#person" },
      "mainEntity": { "@id": "https://www.meghrajgiri.com/projects#projects-list" }
    },
    {
      "@type": "ItemList",
      "@id": "https://www.meghrajgiri.com/projects#projects-list",
      "name": "Featured Projects",
      "numberOfItems": 7,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "url": "https://www.meghrajgiri.com/projects/thriftverse", "name": "React Native E-commerce App - Thriftverse", "image": "https://www.meghrajgiri.com/projects/thriftverse/thumbnail.png" },
        { "@type": "ListItem", "position": 2, "url": "https://www.meghrajgiri.com/projects/cannabiz-elite", "name": "Clinic Management System - Cannabiz Elite (Australia)", "image": "https://www.meghrajgiri.com/projects/cannabiz-elite/thumbnail.png" },
        { "@type": "ListItem", "position": 3, "url": "https://www.meghrajgiri.com/projects/lyve", "name": "The LYVE app", "image": "https://www.meghrajgiri.com/projects/lyve/lyve.webp" },
        { "@type": "ListItem", "position": 4, "url": "https://www.meghrajgiri.com/projects/khatapata", "name": "Inventory Management System - Khatapata (PWA)", "image": "https://www.meghrajgiri.com/projects/khatapata/khata_1.png" },
        { "@type": "ListItem", "position": 5, "url": "https://www.meghrajgiri.com/projects/college-cost-secrets", "name": "College Cost Secrets", "image": "https://www.meghrajgiri.com/projects/ccs/ccs.webp" },
        { "@type": "ListItem", "position": 6, "url": "https://www.meghrajgiri.com/projects/bookvid", "name": "Bookvid - Live Video Booking Marketplace", "image": "https://www.meghrajgiri.com/projects/bookvid/bookvid.webp" },
        { "@type": "ListItem", "position": 7, "url": "https://www.meghrajgiri.com/projects/yume", "name": "Gambling Recovery App - Yume", "image": "https://www.meghrajgiri.com/projects/yume/thumbnail.png" }
      ]
    }
  ]
}
```

### 5e. Per-project `SoftwareApplication` (example: Bookvid — replaces `CreativeWork` in `[slug]/page.tsx`)

```json
{
  "@type": "SoftwareApplication",
  "@id": "https://www.meghrajgiri.com/projects/bookvid#work",
  "name": "Bookvid - Live Video Booking Marketplace",
  "description": "Bookvid is a platform that facilitates the booking and managing of digital events and video sessions. It allows users to create booking pages, schedule sessions, and receive automatic payments through integrations with popular payment (e.g., PayPal, Venmo) and calendar apps. Clients can self-schedule, and users are notified of bookings and payments, simplifying managing and monetizing virtual meetings. The platform supports both individual and group sessions and ensures secure, encrypted communication",
  "url": "https://www.meghrajgiri.com/projects/bookvid",
  "image": "https://www.meghrajgiri.com/projects/bookvid/bookvid.webp",
  "author": { "@id": "https://www.meghrajgiri.com/#person" },
  "dateCreated": "2024",
  "applicationCategory": "Other",
  "operatingSystem": "Web",
  "keywords": "Calendly, Next.js, Web Sockets, Tailwind CSS",
  "isPartOf": { "@id": "https://www.meghrajgiri.com/projects#projects-list" }
}
```

(`applicationCategory: "Other"` is still a weak value inherited from `project.category` — it's a data problem, not a schema problem; worth giving the category taxonomy real values eventually, but not urgent since `applicationCategory` isn't user-facing.)

### 5f. Cannabiz Elite — the placeholder-text fix (Critical)

Do not emit `abstract` while `caseStudy.summary` still contains bracketed placeholders. Corrected node, no `abstract` until the real case study is written:

```json
{
  "@type": "SoftwareApplication",
  "@id": "https://www.meghrajgiri.com/projects/cannabiz-elite#work",
  "name": "Clinic Management System - Cannabiz Elite (Australia)",
  "description": "Cannabiz Elite is a clinic management system purpose-built for Australian cannabis and telehealth clinics. Unlike generic practice management software designed for GPs or specialists, the platform understands the unique operational needs of medicinal cannabis providers. From scheduling and telehealth through to prescription management and dispensary coordination, every feature is tailored to cannabis clinic workflows. This isn't a generic system retrofitted for cannabis — it's cannabis clinic management from the ground up.",
  "url": "https://www.meghrajgiri.com/projects/cannabiz-elite",
  "image": "https://www.meghrajgiri.com/projects/cannabiz-elite/thumbnail.png",
  "author": { "@id": "https://www.meghrajgiri.com/#person" },
  "dateCreated": "2026",
  "applicationCategory": "Healthcare",
  "operatingSystem": "Web",
  "keywords": "React, Next.JS, MedusaJS, Node.js, PostgreSQL, Resend, Twilio",
  "isPartOf": { "@id": "https://www.meghrajgiri.com/projects#projects-list" }
}
```

### 5g. `Service` — DRAFT ONLY, do not ship until `#services` has real, visible content

```json
{
  "@type": "Service",
  "@id": "https://www.meghrajgiri.com/#services",
  "name": "Full-Stack Web & Mobile Application Development",
  "serviceType": "Web and Mobile Application Development",
  "provider": { "@id": "https://www.meghrajgiri.com/#person" },
  "areaServed": ["Nepal", "Worldwide (Remote)"],
  "audience": {
    "@type": "Audience",
    "audienceType": "Startups and product teams"
  }
}
```

---

## 6. How to produce this from `src/lib/schema.ts`

Keep the existing architecture exactly as-is — one `@graph` per page built from small composable helpers, stable `@id`s referenced rather than re-declared. The changes are additive:

1. **`buildPerson(config)`** — fix `address` (split `location` into `addressLocality`/`addressRegion`/`addressCountry`, or better, store them as separate fields in `SiteConfig.personal` rather than parsing one string), and add `image`, `description`, `alumniOf`, `worksFor`, `hasOccupation`, `hasCredential`, `nationality`, `homeLocation`, `knowsLanguage`. None of these exist in `SiteConfig` today — `config.personal` currently only has `name/role/initials/email/location/tagline` (confirmed against `src/lib/config.ts`), and there's no `education`/`experience`/`credentials` data flowing into schema at all even though `SiteConfig.education` and `SiteConfig.experience` already exist and already carry the alumniOf/worksFor facts. The fix is mostly *wiring*, not new content: read `config.education.education[0]` for `alumniOf`, `config.experience.experiences.find(e => e.status === "current")` for `worksFor`, and add one new Supabase `site_config` row (e.g. `credentials`) for the two `hasCredential` entries and the Toptal `sameAs` URL, since Toptal isn't in `contact.socialLinks` today. Also trim the `knowsAbout` flat-map to a curated subset rather than every skill in every category.
2. **`buildProfilePage(config)`** — new helper, same shape as `buildWebSite`, called only from `page.tsx`.
3. **`buildCollectionPage(baseUrl, { name, description })`** and **`buildItemList(baseUrl, projects)`** — split the existing inline `ItemList` object out of `projects/page.tsx` into `schema.ts` (matching how `buildBreadcrumbs` was done), give the `ItemList` a stable `@id`, add `image` per `ListItem`, and add `buildPerson(config)` to that page's `graph([...])` call — it's currently the one page omitting it.
4. **Per-project node** — in `projects/[slug]/page.tsx`, change `"@type": "CreativeWork"` to `"@type": "SoftwareApplication"`, add `applicationCategory: project.category`, `operatingSystem` (derive: contains `"React Native"`/`"Expo"` → `"iOS, Android"`, else `"Web"`), and add an `isPartOf` reference to the `ItemList` `@id`. Guard the existing `...(project.caseStudy?.summary ? { abstract: ... } : {})` spread with a placeholder check, e.g. `!/\[[^\]]+\]/.test(project.caseStudy.summary)`, so a half-filled `caseStudy` template can never leak bracketed text into production JSON-LD again — this closes the class of bug that caused the cannabiz-elite issue, not just today's instance of it.
5. **`Service`** — new helper, added to the homepage `@graph` only once the `#services` section in `HeroSection`/nav actually renders content (currently a dead nav link per `CONTEXT.md`) — this is gated on a content/component fix outside `schema.ts`'s scope.
6. **`FAQPage`** — no helper recommended at this time; revisit only if Meghraj decides to build genuine on-page Q&A content and explicitly accepts the AI/GEO benefit is unconfirmed with zero Google SERP upside.

