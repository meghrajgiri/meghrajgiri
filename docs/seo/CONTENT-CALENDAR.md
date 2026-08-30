# Content Calendar — meghrajgiri.com.np

**Prepared:** 2026-08-30
**Canonical host:** `https://www.meghrajgiri.com`
**Cadence:** 2 articles/month from Month 4 (24 planned; 12 is the realistic year-one target for a solo operator working alongside client work)
**Rule:** one sustained article a month beats four then silence. If a month slips, drop the piece — do not stack it.

---

## Editorial principle

Every article must come from something actually shipped. This site's advantage over agency content farms is first-hand experience in an under-documented ecosystem — Nepali payments (eSewa), Nepali logistics (NCM), multi-tenant Supabase, Medusa v2 in a regulated telehealth context. Generic "10 Tips for React Native" content competes with a million identical posts and loses. **A post about integrating eSewa into a React Native checkout competes with almost nothing and is genuinely useful.**

Each article carries a "money link" to the service page it supports. That is what turns traffic into enquiries.

---

## Phase 1 (Weeks 1–4) — No new content

Foundation repair only. Publishing before the canonical is fixed accrues nothing.

**One exception:** rewrite the homepage hero and meta description to state the specialism explicitly — "marketplaces, telehealth and fintech products" rather than the generic "full stack developer". Costs an hour and improves every downstream signal.

---

## Phase 2 (Weeks 5–12) — Core pages, no blog yet

Priority is structural pages, not articles. Word counts are minimums.

| Week | Deliverable | Words | Target query | Schema |
|---|---|---|---|---|
| 5 | `/about` | 800 | brand + "meghraj giri developer" | `ProfilePage`, `Person` |
| 6 | `/contact` | 300 | brand | `ContactPage` |
| 7 | `/services/mvp-development` | 900 | "mvp developer for startups" | `Service` |
| 8 | `/services/react-native-apps` | 900 | "react native developer for hire", "expo developer" | `Service` |
| 9 | `/services/marketplace-development` | 1,000 | "marketplace app developer", "multi-vendor platform developer" | `Service` |
| 10 | Case study: **Thriftverse** | 1,200 | "react native marketplace app", "esewa integration" | `CreativeWork` |
| 11 | Case study: **Cannabiz Elite** | 1,200 | "telehealth clinic management system", "medusajs healthcare" | `CreativeWork` |
| 12 | Case studies: **Khatapata** + **Lyve** | 1,000 each | "inventory management pwa", "ticket resale marketplace app" | `CreativeWork` |

### Case study structure (use for all four)

1. **One-paragraph summary** with the outcome and a number in it — this is the passage AI engines will quote
2. Client/context and the constraint that made it hard
3. The problem, stated concretely
4. Approach and key architectural decisions
5. Technical deep-dive — the part nobody else can write
6. **Measurable results** — load time, conversion, transaction volume, time-to-launch, anything real
7. What I would do differently
8. Tech stack + link to the relevant service page

> If a project has no number you can honestly publish, say what you can measure instead ("shipped in 11 weeks with a two-person team"). An unquantified case study is a brochure.

---

## Phase 3 (Months 4–6) — Blog launch, 2/month

| # | Month | Title | Type | Words | Primary keyword | Money link |
|---|---|---|---|---|---|---|
| 1 | M4 | Integrating eSewa payments into a React Native checkout | Tutorial | 1,800 | esewa react native integration | react-native-apps |
| 2 | M4 | Multi-tenant storefronts with Next.js and Supabase: subdomains, RLS, and the parts that bite | Deep-dive | 2,200 | multi-tenant nextjs supabase | marketplace-development |
| 3 | M5 | Supabase Row Level Security for marketplace sellers — a production pattern | Deep-dive | 2,000 | supabase rls marketplace | marketplace-development |
| 4 | M5 | Automating order tracking with the Nepal Can Move logistics API | Tutorial | 1,500 | nepal can move api integration | marketplace-development |
| 5 | M6 | Medusa v2 workflows for a telehealth clinic: modelling prescriptions as orders | Deep-dive | 2,200 | medusa v2 workflows healthcare | mvp-development |
| 6 | M6 | Offline-first inventory sync in a PWA: conflict resolution without a backend queue | Deep-dive | 2,000 | offline first pwa sync | mvp-development |

**Month 6 checkpoint:** pull GSC query data for these six. Whichever topic cluster earns impressions gets doubled down on in Phase 4; the rest get dropped. Do not keep publishing on a theme the data has rejected.

---

## Phase 4 (Months 7–12) — 2/month + quarterly flagship

| # | Month | Title | Type | Words |
|---|---|---|---|---|
| 7 | M7 | What I ship in week one of an MVP build | Process | 1,500 |
| 8 | M7 | React Native vs. Expo in 2026: choosing for a two-person team | Comparison | 2,000 |
| 9 | M8 | **FLAGSHIP:** Building a marketplace in an emerging-market payments ecosystem — the complete architecture | Original research | 4,000 |
| 10 | M8 | Cutting Next.js TTFB: removing force-dynamic without losing freshness | Tutorial | 1,600 |
| 11 | M9 | Supabase vs. Firebase for marketplace apps: a build-side comparison | Comparison | 2,200 |
| 12 | M9 | Designing seller onboarding that doesn't leak sensitive data | Deep-dive | 1,800 |
| 13 | M10 | Expo EAS build pipelines for solo developers | Tutorial | 1,600 |
| 14 | M10 | Why I stopped using `<img>` in Next.js (and what it cost me) | Short-form | 1,000 |
| 15 | M11 | **FLAGSHIP:** Benchmarking payment gateway latency across Nepali providers | Original data | 3,500 |
| 16 | M11 | Structuring a Supabase schema for a multi-sided marketplace | Deep-dive | 2,000 |
| 17 | M12 | A year of shipping marketplaces: what actually broke | Retrospective | 2,500 |
| 18 | M12 | Type-safe config in a Supabase-backed Next.js app | Tutorial | 1,600 |

The two flagship pieces exist to earn links. They are the only entries here likely to be cited by other developers unprompted, and they are worth more than the other sixteen combined for that reason.

---

## Publishing checklist

Every piece, before it ships:

- [ ] Target keyword identified and checked against GSC (not guessed)
- [ ] Title < 60 chars, meta description < 155 chars, both unique
- [ ] H1 matches intent; H2/H3 structure is real, not decorative
- [ ] Meets minimum word count with substance, not padding
- [ ] Opening paragraph answers the query directly — the citable passage
- [ ] Code samples tested and syntax-highlighted
- [ ] `BlogPosting` schema with `Person` author and `datePublished`
- [ ] OG image generated
- [ ] **Money link** to the relevant service page, contextual and descriptive
- [ ] 2+ internal links out, 2+ internal links in (orphan rule)
- [ ] All images `next/image` with alt text and explicit dimensions
- [ ] Added to sitemap; URL submitted in GSC

---

## Distribution

Publishing is half the job. For each article:

1. Cross-post to dev.to and Hashnode with `rel=canonical` pointing home (never publish there first)
2. Share on LinkedIn — the highest-value channel for the founder/CTO audience
3. Post in relevant Discord/Slack communities (Supabase, Medusa, Expo) where genuinely on-topic
4. Answer 2–3 Stack Overflow questions the article addresses; link only where it actually helps
5. Reddit r/reactnative, r/nextjs — only where the post answers a live question, never as a drop

---

## Maintenance

| Cadence | Task |
|---|---|
| Monthly | GSC query review; update the two best-performing articles |
| Quarterly | Content audit — anything under 100 impressions/quarter gets improved, merged, or removed |
| Quarterly | Refresh case study metrics with post-launch numbers |
| Annually | Full re-audit; re-run [COMPETITOR-ANALYSIS.md](COMPETITOR-ANALYSIS.md) with real GSC data |

---

*Companion documents:* [SEO-STRATEGY.md](SEO-STRATEGY.md) · [SITE-STRUCTURE.md](SITE-STRUCTURE.md) · [COMPETITOR-ANALYSIS.md](COMPETITOR-ANALYSIS.md) · [IMPLEMENTATION-ROADMAP.md](IMPLEMENTATION-ROADMAP.md)

---

## Australian healthcare cluster (added 2026-08-30)

A dedicated SERP-clustered plan for the Australian healthcare niche now lives in [cluster/cluster-plan.md](cluster/cluster-plan.md) — 4 clusters, 11 posts, ~21,600 words, with an interactive map at `cluster/cluster-map.html`.

It **supersedes** the Phase 3/4 entries above wherever the two overlap (notably *"Medusa v2 workflows for a telehealth clinic"*, which becomes a cluster spoke). Treat the cluster as the plan of record for this niche and the calendar above as the plan for everything else.

Do not start it until the domain migration has settled and the content clearance checklist at the end of the cluster plan is complete.
