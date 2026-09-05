# GEO / AI Search Readiness Audit — meghrajgiri.com

Goal being audited against: get "Meghraj Giri" named/cited by Google AI Overviews, ChatGPT, and
Perplexity for queries like "top developers in Nepal", "best frontend developers in Nepal",
"who are the top full-stack developers in Nepal", "hire a React Native developer in Nepal".

All evidence below is pulled from the saved crawl in `scratchpad/crawl/page_*.html` (9 pages,
fetched 2026-09-05) and `scratchpad/audit/CONTEXT.md`. Nothing here re-verifies robots.txt,
headers, or the crawl word counts — see CONTEXT.md for those.

---

## 0. New finding this session: authored content exists in the CMS payload but is never rendered

This is the single most important discovery and changes the framing of every recommendation below.

The homepage's Next.js RSC/flight payload (`page_.html`, inside `<script>` tags, not visible DOM)
contains **fully authored** "experience" (Journey) and "education" and "expertise" (Services) data
pulled from Supabase `site_config`. Example, verbatim from the payload:

> `"experience":{"experiences":[{"year":"2025","title":"Full Stack Developer","period":"Present","status":"current","company":"SCSS Consulting","description":"Developed health management Systems for Australian Clients with HIPAA compliance and Australian health policies",...},{"year":"2024","title":"React Native Developer","company":"Inseed",...},{"year":"2023","title":"Software Engineer","company":"Gurzu Inc.",...},{"year":"2022","title":"React Developer","company":"Prabidhi Labs",...},{"year":"2020","title":"React Developer","company":"Lightweb Group",...}]}`

> `"education":{"education":[{"degree":"BSc CSIT","period":"Aug 2019 - Aug 2023","institution":"Institute of Science and Technology (IOST), Tribhuvan University",...},{"degree":"High School Diploma","period":"Apr 2017 - May 2019","institution":"Kalika Manavgyan Secondary School",...}]}`

> `"expertise":{"title":"Your Product's Technical Foundation","services":[{"title":"Web Application Development",...},{"title":"Mobile App Development",...},{"title":"MVP Development & Validation",...}]}`

But cross-checking which section components `page.tsx` actually mounts (via the dynamic-import
module list in the same flight payload) shows only:

> `AboutSection`, `ContactSection`, `SkillsSection`, `TestimonialsSection`

There is no `JourneySection`, `ExperienceSection`, `EducationSection`, or `ExpertiseSection` mounted
anywhere in the tree. This is confirmed independently by the main nav, which links to
`href="#expertise"` ("Services") and `href="#journey"` ("Journey") — both anchors point at
`id`s that do not exist anywhere in the rendered DOM (`grep id=` on the page returns only
`about`, `contact`, `contact-email`, `contact-message`, `contact-name`, `contact-subject`,
`featured-work`, `skills`). The nav literally links to nothing.

**Why this matters for GEO specifically:** this content — the one thing on the entire site that
would let an LLM state "Meghraj Giri worked at SCSS Consulting, Inseed, Gurzu Inc., Prabidhi Labs
and Lightweb Group, and holds a BSc CSIT from Tribhuvan University" — exists in the CMS, was
clearly authored with GEO/resume intent (matches the Toptal resume facts in CONTEXT.md almost
exactly), and is invisible to both human visitors and every crawler. It's inside a `<script>`
payload, so `trafilatura`-style boilerplate stripping (or any raw-HTML text extraction a
GPTBot/ClaudeBot/PerplexityBot-style fetch would run) discards it along with the rest of the JS.
It is not a rendering-mode problem (SSR vs CSR) — it is a **dead component wiring problem**. This
is the highest-impact, lowest-effort fix on the whole site: the data doesn't need to be written,
it needs to be rendered. Wire `experience` → a real Journey section, `education` → a real
Education section, `expertise` → a real Services section, at real anchor ids matching the nav.

Also note in the same payload: `"footer":"© 2024 Meghraj Giri. Building with React, TypeScript &
love."` — a stale mobile-menu footer string sitting alongside a rendered page footer that says
"© 2026". Minor, but it's more evidence this config object is stale/orphaned rather than actively
wired to a live section.

---

## 1. The cannabiz-elite placeholder-copy bug (trust/authority damage)

`https://www.meghrajgiri.com/projects/cannabiz-elite` — the most technically substantial case
study on the site (only page with headings like "The constraint," "Approach and key decisions,"
"What I would do differently") is shipping unfilled template brackets in production HTML. Verified
directly in the raw saved HTML (`page_projects_cannabiz-elite.html`), not a rendering artifact:

> "Cannabiz Elite is a clinic management system for Australian cannabis and telehealth clinics,
> built on Medusa v2 and shipped in **[N weeks]**. The hardest part was not the application — it
> was **[specific constraint]**, which required **[specific solution]**."

> "The constraint — **[Australian telehealth is not a normal build. Describe what AHPRA, the
> Privacy Act and national prescribing infrastructure actually demanded of this system.]**"

> "Results — **[Measurable outcomes. If commercial metrics are not publishable, use delivery
> facts — shipped in N weeks, N clinics, N consults.]**"

> "What I would do differently — **[The retrospective. This section does more for credibility
> than any other on the page.]**"

These are literally the section-writing instructions, left in as if they were the copy, and
they are live and indexable right now. `grep -c '\[N\]'` on this file alone returns matches for
`[N] Weeks to launch`, `[N] Clinics onboarded`, `[N] Consults processed` as stat labels too.

Why this matters for GEO: this page is the strongest candidate on the whole site for a citable
"Meghraj Giri solved X regulatory/technical problem" claim (the exact shape of claim that gets
lifted into an AI Overview "here's a developer who has done Y" answer), and instead it currently
reads as broken/unfinished to any model or human that fetches it. An LLM asked to characterize
this project cannot produce a specific claim from it — every specific noun is a bracket. Worse,
a model that DOES ingest this page has a plausible reason to down-weight the whole domain's
reliability (self-evidently unedited placeholder copy live at deployment is a low-quality-content
signal, not just a missed opportunity). This should be fixed before any other GEO work — it is a
correctness/trust bug, not just an optimization gap.

---

## 2. Entity resolution: why "Meghraj Giri" doesn't resolve as a person entity

Per CONTEXT.md's verified SERP: `"Meghraj Giri" developer Nepal` surfaces unrelated Wikipedia
entities (Meghraj Sharma Nepal, Deepak Raj Giri, Amar Giri, Pramila Giri, Prajwol Giri, Gehendra
Giri), a Behance profile for a different person ("Meghraj Dangi"), and the **stale, non-canonical
`.com.np` duplicate** — not the canonical `.com` site — with an outdated title/description.
No knowledge panel. The Toptal profile, a genuinely strong entity signal, does not surface at all.

Concrete reasons this happens, tied to actual site state:

- **No disambiguating entity attributes on the Person node.** The current `schema.org/Person`
  (from `src/lib/schema.ts`, confirmed in CONTEXT.md and in the homepage JSON-LD dump this
  session) has only `name`, `url`, `jobTitle`, `email`, `address.addressLocality: "Nepal"`,
  `sameAs` (LinkedIn + GitHub only), and `knowsAbout`. It is missing `alumniOf`, `worksFor`,
  `image`, `description`, `nationality`, `birthPlace`/`homeLocation` at city level ("Butwal" is
  never used — only the country "Nepal"), and `hasCredential`. Google's entity-resolution and
  AI Overview grounding both lean on exactly these disambiguators (alma mater, employer,
  credential, city) to separate one "Giri" from another. This site gives Google nothing to
  distinguish this Meghraj Giri from the Wikipedia-notable Giris except a country-level location
  shared by 30 million people.
- **`sameAs` is missing the two highest-value external signals.** Toptal ("Verified Expert in
  Engineering," a third-party-vetted credential page) and GitHub are the two accounts most likely
  to already carry topical authority for "developer Nepal" — Toptal explicitly states "Butwal,
  Mid-Western Development Region, Nepal" — yet Toptal isn't in `sameAs` at all, and per CONTEXT.md
  the Toptal profile itself doesn't surface in the SERP. Reddit, Wikipedia, and YouTube — the
  three highest brand-mention/citation-correlation signals per the GEO brief — have zero presence
  for this entity anywhere in the crawl or CONTEXT.md's SERP notes.
- **The unresolved `.com.np` duplicate is actively winning the query that matters.** CONTEXT.md's
  live-search evidence shows `.com.np` (stale title "Meghraj Giri - Full Stack Developer," stale
  description "building exceptional digital experiences with clean code") outranking the canonical
  `.com` for the exact query `"Meghraj Giri" developer Nepal`. A cross-domain canonical tag alone
  is a weak signal without a 301; Google is choosing to index/serve the non-canonical URL with
  old content, which means any authority this domain's history has accrued is being credited to
  the wrong, stale copy. Until this is a hard 301, every other entity-resolution fix is diluted
  across two competing URLs.
- **No first-party disambiguating sentence exists anywhere on-site.** Nowhere on the site does a
  single self-contained sentence say "Meghraj Giri is a full-stack developer based in Butwal,
  Nepal, a Toptal-verified engineer with a BSc CSIT from Tribhuvan University." That is precisely
  the sentence shape (entity + attribute + attribute + evidence) that both Google's Knowledge
  Graph matching and an LLM doing entity grounding need, and it's absent — because, per Finding 0,
  the underlying facts exist in the CMS but the section that would host that sentence
  (Journey/About expansion) is unmounted.

---

## 3. What third-party corpora AI Overviews actually draw on here — and where he's absent

Per CONTEXT.md's verified SERP checks, `"top developers in Nepal"` and `"frontend developers in
Nepal"` return exclusively B2B agency-directory/listicle pages: clutch.co/np/developers,
goodfirms.co, techbehemoths.com, twine.net/find/front-end-developers/np,
upwork.com/hire/front-end-developers/np/, truelancer.com, and a Nepali listicle
(kokil.com.np, "Top Frontend Developers in Nepal for Modern UI/UX Design"). No individual
developer portfolio appears on page 1 for either query. This tells you exactly what an AI
Overview for these queries is synthesizing from: it is quoting/aggregating directory and listicle
pages, not personal sites. A personal portfolio, however well-optimized, cannot out-rank a listicle
for a plural, list-shaped query — Google AI Overviews answer "who are the top developers in Nepal"
by pulling from pages that already enumerate multiple developers/agencies.

Consequences for this site specifically:
- The realistic win is **being named inside those directories/listicles** (Clutch, GoodFirms,
  TechBehemoths, Twine, Upwork profile, or a Nepal-specific listicle like kokil.com.np), not
  ranking the personal domain against them. None of Clutch/GoodFirms/TechBehemoths/Twine/Upwork
  are in the current `sameAs`, and there's no evidence in the crawl of a profile on any of them.
- The personal site's realistic AI-citation opportunity is the **adjacent long-tail, individual-
  intent queries** ("hire a React Native developer in Nepal," "React Native developer Butwal
  Nepal," "Toptal verified developer Nepal") — queries where a single-person answer is plausible
  and where the missing entity signals from Finding 2 (Toptal sameAs, city-level location,
  alumniOf, worksFor) directly determine whether the site or a competitor's is the one an LLM
  reaches for.
- Wikipedia/Reddit/YouTube presence (the strongest brand-mention correlations per the GEO brief)
  are confirmed absent per CONTEXT.md's SERP scan — there is no realistic path to an AI Overview
  citation for a plural "top developers" query without a presence in at least one of the
  aggregator/community corpora above; that is a distribution problem outside the codebase, not a
  content or schema fix.

---

## 4. llms.txt — honest verdict

**Not worth prioritizing for this site, and not worth adding until Findings 0 and 1 are fixed.**
`/llms.txt` is not consumed by Google Search or Google AI Overviews at all — it has no bearing on
the AIO half of the stated goal. It is, at best, a hint file some LLM training/browsing crawlers
may optionally read, with no confirmed adoption by ChatGPT's live browsing or Perplexity's
retrieval pipeline either; both of those primarily crawl and index rendered page content and
third-party corpora (Finding 3), same as a search engine. Given `/llms.txt` currently 404s (per
CONTEXT.md) and the real bottleneck is that authored content isn't even rendering into the HTML
those crawlers already fetch successfully (robots.txt allows all of them — verified 200 in
CONTEXT.md), adding a curated `llms.txt` before fixing Finding 0/1 would be optimizing a channel
with no confirmed leverage while the primary channel (actual page HTML) is still missing its best
content. If added later, it should be a byproduct of finishing the on-page work, not a substitute.

---

## 5. Passage-level citability: what's quotable today, and what isn't

### Citable now (self-contained, specific, attributable, in visible rendered text)

1. **Yume project page** (`/projects/yume`): "Delivered 10K+ users and 25%+ paying conversion
   rate within 3 months of launch. The app was acquired by National Debt Relief within 6 months."
   — Specific numbers, a named acquirer, a timeframe. This is the single most citable sentence on
   the entire site. Weakness: the sentence doesn't itself contain "Meghraj Giri" as subject — an
   LLM would need to also ingest the page title/schema to attribute it to him, which is fragile if
   only this passage is retrieved out of context.
2. **College Cost Secrets page** (`/projects/college-cost-secrets`): "The platform serves families
   that have collectively saved $100M in college expenses, with a Kevin Harrington endorsement and
   15+ years of operation." — A named, recognizable third party (Shark Tank's Kevin Harrington)
   plus a concrete dollar figure. Genuinely quotable and carries borrowed authority. Same
   attribution weakness as above (subject is the product, not explicitly "built by Meghraj Giri"
   in the same sentence).
3. **Homepage meta description** (rendered in `<title>`/`<meta>` and footer, both visible):
   "Building fast, scalable web & mobile apps for startups. React, TypeScript, Next.js, React
   Native specialist. Available for new projects." — Short, self-contained, but generic: no
   location, no name-as-subject, no differentiator vs. thousands of similar bios.
4. **Thriftverse page** (`/projects/thriftverse`): "Thriftverse also handles logistics through
   Nepal Can Move (NCM), including order tracking, shipping coordination, and automated email
   notifications for both buyers and store owners." — This is the only sentence anywhere in the
   9-page crawl that names a real Nepali company (NCM) alongside his work, i.e. the only organic
   "Nepal" entity co-occurrence with a concrete technical claim. Underused: it's buried in a
   feature list, not framed as evidence of Nepal-market experience.
5. **Homepage About section**: "I specialize in building MVPs that validate ideas quickly, then
   scaling them for growth." — Passes the length/directness test as a sentence, but it's a generic
   positioning line with zero proper nouns, dates, or numbers — citable but not differentiating,
   so a model has no reason to prefer it over any competitor's identical claim.

### Not citable today, with reason

1. **Cannabiz Elite case study** (Finding 1): "The hardest part was not the application — it was
   [specific constraint], which required [specific solution]." — Structurally the exact
   claim-shape an LLM wants (problem → solution), but every noun is an unfilled placeholder. Zero
   extractable information.
2. **Employment history** ("SCSS Consulting," "Inseed," "Gurzu Inc.," "Prabidhi Labs," "Lightweb
   Group," per Finding 0): not citable because it is not in the rendered page at all — it's inside
   a `<script>` JSON payload that any text-extraction pipeline (trafilatura or otherwise) strips
   before an LLM ever sees it. The content quality (specific company names, dates, HIPAA/Australia
   detail) is actually good; it simply isn't reachable.
3. **Education** ("BSc CSIT... Institute of Science and Technology (IOST), Tribhuvan University,"
   per Finding 0): same reason — authored, specific, dated, but unrendered.
4. **Testimonials**: found in the RSC payload with real quote text ("Meghraj built our MVP in
   record time...") but attributed only to anonymized roles — `"author":"Founder, Early-Stage
   Startup"`, `"company":"Tech Startup"` — no real names or company names. Even if this section
   were wired up to render (it currently isn't, per Finding 0/CONTEXT.md), these quotes would
   still fail as citable authority signals: an LLM cannot attribute a claim to an anonymous,
   unverifiable source, and Google's guidance explicitly discounts unattributable testimonials as
   an authority signal.
5. **Homepage stat chips** ("5+ Professional Experience," "20+ Products Shipped," "6 Projects
   completed," "5 roles · 2 qualifications"): these are bare numbers with no antecedent in the
   rendered page — "5 roles" refers to the 5 unrendered employment entries from Finding 0, but a
   reader/crawler encountering only the rendered homepage has no way to know what the 5 roles were,
   so the stat is unverifiable and therefore not usable as an LLM citation ("Meghraj Giri has 5
   roles" is not a fact an LLM can respond with — it's a dangling number).

---

## 6. Concrete structural changes to raise citability for the target queries

Ordered by effort vs. impact, specific to what exists (or almost-exists) on this site today:

1. **(Highest impact, lowest effort) Wire up the Journey/Experience, Education, and
   Expertise/Services sections that already have authored data sitting in the CMS payload
   (Finding 0).** This alone adds ~5 employment entries with company names/dates/descriptions and
   2 education entries with institution names/dates — the exact entity+attribute+evidence
   sentences that are currently missing everywhere. Fix the dead `#expertise`/`#journey` nav
   anchors as part of the same change.
2. **Fix the cannabiz-elite placeholder copy (Finding 1)** before any further GEO work on that
   page — it's a correctness bug, not a citability optimization, and it's the strongest case-study
   candidate on the site.
3. **Add one explicit, self-contained disambiguating sentence** near the top of the homepage About
   section or a new "Who is Meghraj Giri" block, in the entity+attribute+evidence shape the brief
   asks for, e.g.: "Meghraj Giri is a full-stack developer based in Butwal, Nepal, a Toptal-
   verified engineer (Verified Expert in Engineering) with a BSc CSIT from Tribhuvan University,
   specializing in React, Next.js, and React Native." This single sentence — once the Toptal
   `sameAs` and city-level location are also added to schema — is the sentence most likely to get
   lifted verbatim into an AI Overview or ChatGPT answer that names him, and it directly attacks
   the entity-resolution failure in Finding 2 (no on-site sentence currently disambiguates him
   from the unrelated Giri/Meghraj Wikipedia entities).
4. **Reframe the two already-strong metric sentences (Yume, College Cost Secrets) so the subject
   is explicitly "Meghraj Giri" or "I," not just the product** — e.g. "I built Yume's iOS app,
   which grew to 10K+ users and a 25%+ paying conversion rate within 3 months before being
   acquired by National Debt Relief." Same sentence, same evidence, but now self-contained for
   attribution if a retrieval system only grabs that one passage.
5. **Add city-level and Nepal-market framing to schema and body copy where it's organically true**
   — the Thriftverse/NCM passage (Finding 5.1.4) is the only real Nepal-market technical evidence
   on the site; surface it as its own sentence ("Built and shipped logistics integration with
   Nepal Can Move (NCM) for a live Nepali e-commerce marketplace") rather than leaving it inside a
   generic feature list, and add `homeLocation`/`addressLocality: "Butwal"` (not just "Nepal") plus
   `alumniOf` and `hasCredential` (Toptal) to the Person schema so the same disambiguators exist
   both in prose and in structured data.
6. **Attribute the testimonials with real names/companies or drop the section** — anonymized
   quotes (Finding 5, item 4) cost trust without buying any authority signal; either get
   permission to name real clients or don't render placeholder-anonymized ones, since an unfilled
   or fake-looking testimonial next to the cannabiz-elite placeholder bug compounds the "this site
   has unfinished/synthetic content" signal a model may pick up on.

None of the above will make the personal domain outrank Clutch/GoodFirms/TechBehemoths for the
plural "top developers in Nepal" query itself (Finding 3) — that requires getting listed in those
corpora, a distribution task separate from this site's code/content.
