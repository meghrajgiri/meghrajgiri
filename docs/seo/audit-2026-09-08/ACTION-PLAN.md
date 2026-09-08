# Action plan — 2026-09-08

Ordered by value per unit of effort, not by severity alone. Everything in Phase 1 is a
copy or one-line code change, and together they are the difference between a site that
reads as carefully maintained and one that contradicts itself.

`[me]` = I can do it now. `[you]` = needs a decision or a fact only you have.

---

## Phase 1 — Accuracy (this week)

The site's architecture is sound. What is wrong is that it states four different numbers
for two facts, and makes two claims nothing on the site supports.

| # | Task | Who | Why |
|---|---|---|---|
| 1.1 | **Fix the homepage H1.** `{mainTitle?.line1}{" "}` before the `<span>` in `HeroSection.tsx:100`. Currently renders `Nepalbuilding` to every text extractor and screen reader. | `[me]` | Single most important on-page element on the page that ranks for your name. One line. |
| 1.2 | **Derive the case-study count instead of writing it.** Site has 15; `/projects` says seven (in copy *and* `CollectionPage.description`), `/hire` seven, the blog post seven, `/skills` thirteen. `/projects` contradicts itself — its own `ItemList` says `numberOfItems: 15`. | `[me]` | Wrong three separate ways because it is restated by hand. Rendering it from the array ends the class of bug. |
| 1.3 | **Six years or five?** Homepage hero and stat card say six; `/about`, `/skills`, `/experience`, `/hire` and the blog say five. Your `Experience` data supports five. | `[you]` decide → `[me]` | The one page that disagrees is the one that ranks for the brand query. |
| 1.4 | **Bookvid: "raised user adoption by 35% and retention by 25%"** on `/about`. `/projects/bookvid` contains none of *onboarding*, *35%*, *25%*, *adoption*, *retention*. | `[you]` | A quantified claim naming a project whose own page does not support it. Either restore the figures with their source or drop the sentence. |
| 1.5 | **Prabidhi Labs "30% faster load / 5× faster admin panel."** Appears four times across `/about`, `/contact`, `/hire/nextjs-developer-nepal`. No Prabidhi Labs case study exists. | `[you]` | Repetition makes it prominent, not supported. Either write the case study (you have the material) or soften the claim. |
| 1.6 | **Drop or state the freeCodeCamp credential.** `Person.hasCredential` lists it; no visible page mentions it. | `[me]` | Structured data must reflect the page. One line either way. |

---

## Phase 2 — Cheap technical wins (week 1)

| # | Task | Who |
|---|---|---|
| 2.1 | **Per-project `lastmod`.** 25 of 28 URLs share one millisecond timestamp, which Google discards as unreliable. Since migration 007 each project row has its own `updated_at` — the data now exists, the sitemap just doesn't read it. | `[me]` |
| 2.2 | **Resolve the `/cms` disallow + noindex conflict.** `/cms` returns 200 with `noindex, nofollow`, but `robots.txt` disallows it — so Googlebot never fetches it, never sees the noindex, and can still list the bare URL. Pick one: drop the `Disallow` and let noindex work, or accept the tag is inert. | `[me]` |
| 2.3 | **Trim 11 meta descriptions to ≤160 characters** (currently 185–223) and 5 titles to ≤60. | `[me]` |
| 2.4 | **Strip the unused project payload.** Every page ships all 15 case studies; `/contact` carries 170.9 KB of prose it never renders. 103 KB raw, 91% of the projects data. Measured gzip saving 2.6 KB — modest on the wire, real for parse and hydration. | `[me]` |
| 2.5 | **Add `image` to `BlogPosting`** (thumbnail eligibility) and `dateModified` to all three posts. | `[me]` |
| 2.6 | **Serve `/favicon.ico`.** Currently 404s; the `<link rel="icon">` covers modern browsers, so this is cosmetic. | `[me]` |

---

## Phase 3 — Content depth (weeks 2–4)

| # | Task | Who |
|---|---|---|
| 3.1 | **Finish five case studies** that stop before the structure does: `/projects/epiphra` (585w), `/projects/selfbet` (488w), `/projects/artizan` (513w), `/projects/khatapata` (654w), `/projects/hamrotrips` (949w). Each is missing some of Constraints / Key decisions / Where it got hard / What I'd do differently. | `[you]` supply the hard part → `[me]` write |
| 3.2 | **Rewrite the blog H2s as questions.** `/blog/best-full-stack-developer-in-nepal-2026` is the page built to answer "who are the best full-stack developers in Nepal" and its headings are declarative: "Where Nepali developers actually are", "What to actually check". Match the query shape. | `[me]` |
| 3.3 | **Third person in citable passages.** `/hire` says "Meghraj Giri is a React Native developer in Butwal"; the sub-pages say "I build cross-platform mobile apps". Lifted out of context by a retrieval system, "I" is unattributable. | `[me]` |
| 3.4 | **Kill bare "Yes." answer openers** on `/skills` and `/hire/*`. If an engine extracts only the answer sentence, "Yes." carries nothing. | `[me]` |
| 3.5 | **Cross-link.** Eight project pages and all three blog posts have exactly one inbound link. Link case studies from the blog posts and from `/skills` evidence rows. | `[me]` |

---

## Phase 4 — Off-site (ongoing, and the real constraint)

Nothing on this list is a code change, and together they matter more for the brand query
and knowledge panel than everything above.

| # | Task | Note |
|---|---|---|
| 4.1 | **Update external links still pointing at `.com.np`** — Toptal, LinkedIn, GitHub, any directory listing. The 308s work, but a direct link is worth more than a redirected one. | Highest-value follow-up to the domain move |
| 4.2 | **One independent `sameAs`** — a press mention, a conference bio, an OSS project that credits you. `sameAs` is currently LinkedIn, GitHub, Toptal: all self-owned. | The single biggest gap for entity resolution |
| 4.3 | **Directory placements** from the previous audit's Phase 4 — twine.net Butwal pages, techbehemoths, truelancer, Upwork Nepal. | Still open |
| 4.4 | **Be honest about the knowledge panel.** It is built from independent third-party signals — Wikidata, press, notability — not from your own JSON-LD. Your schema is already correct; it is a confirming signal, never the generative one. | Sets expectations |

---

## Deliberately not recommended

- **`llms.txt`** — returns 404 today, and that is fine. No major engine has committed to
  consuming it. Do not build it expecting a visibility return.
- **MCP servers for AI Overviews** — no mechanism connects them. Worth building as a
  portfolio piece; not as SEO.
- **`SoftwareApplication` instead of `CreativeWork`** on the project pages — Google has no
  rich result for it here, and the type invites `aggregateRating`/`offers` you have no
  genuine data for, which is a manual-action risk. Keep `CreativeWork`.
- **Naming AI crawlers explicitly in `robots.txt`** — GPTBot, ClaudeBot, PerplexityBot,
  CCBot, Bingbot, OAI-SearchBot and Google-Extended all return 200 today under
  `User-agent: *`. Listing them changes nothing functionally. Do it only if you want to
  *block* training crawlers while keeping retrieval ones, which is a policy decision.
- **`interactionStatistic` on the Person** — Google's guidance limits it to stats about the
  hosting platform, so borrowing GitHub follower counts would be against guidelines.

---

## Measure it

Core Web Vitals are the one gap in this audit — PageSpeed Insights' keyless quota was
exhausted. Run it in a browser for `/` and one project page, and revisit the Performance
score, which is currently an estimate rather than a measurement.
