# Competitor Analysis — meghrajgiri.com.np

**Prepared:** 2026-08-30
**Method:** live SERP sampling via web search, direct HTTP inspection of the subject site, manual entity checks. **No paid keyword or backlink tooling was available** (no DataForSEO MCP configured, no Moz/Ahrefs key), so authority figures below are qualitative estimates, not measured DA/DR. Treat §5 as the plan for replacing them with real numbers.

---

## 1. The competitive set is not who you'd assume

A solo developer portfolio has two entirely separate competitive arenas, and conflating them is the most common way this kind of site wastes a year.

**Arena A — brand/entity SERPs.** Competitors are other people named Meghraj and stale profiles of you. Winnable now. High conversion value: these are people who already heard your name.

**Arena B — commercial SERPs** ("hire react native developer nepal"). Competitors are freelance marketplaces and agencies. **Not winnable.** Documented here so the decision to skip them is deliberate rather than repeatedly re-litigated.

There is a third arena — informational/technical queries — where the marketplaces are absent and a solo site is genuinely competitive. That is where the content plan points.

---

## 2. Arena A — brand and entity competition

Live SERP for **"Meghraj Giri full stack developer portfolio"** (sampled 2026-08-30):

| # | Result | Type | Threat |
|---|---|---|---|
| 1 | github.com/emmabostian/developer-portfolios | Listicle repo | Noise |
| 2 | **www.meghrajgiri.com.np** | **The subject site** | — |
| 3 | linkedin.com/in/meghraj-ghimire-fullstackdeveloper | **Different person** ("Meghraj Ghimire", Emirates NBD) | **High — name collision** |
| 4 | girinaik.in | Different person | Noise |
| 5 | **meghraj.me** | Another "Meghraj" portfolio | **High — direct name collision** |
| 6 | dribbble.com search page | Generic | Noise |
| 7 | giri-portfolio.vercel.app | Different person | Noise |
| 8 | portfolio-megha.netlify.app | Different person | Noise |
| 9 | **himalayas.app/@meghrajgiri** | **Your own profile** — "React Native Developer, Inseed Tech Pvt. Ltd." | **Asset, not competitor** |
| 10 | scribd document | Spam | Noise |

### What this tells us

1. **You rank #2 for your own name, not #1.** A listicle outranks you. That is a signal of weak entity consolidation, not weak content.

2. **The indexed snippet is stale.** Google displays the title *"Meghraj Giri - Full Stack Developer"* and a description about "exceptional digital experiences with clean code". The live HTML serves *"Meghraj Giri — Product-Minded Full Stack Developer"* with an entirely different description. Google is holding an older crawl — consistent with the canonical pointing at a non-resolving domain and Google therefore treating the live URL's signals as untrustworthy.

3. **Three distinct "Meghraj" entities are competing in one SERP** — you, Meghraj Ghimire, and meghraj.me. Google has no strong reason to prefer one, because your `sameAs` array currently claims `github.com/meghraj` and `linkedin.com/in/meghraj` — handles that do not match your actual `meghrajgiri` identity — and includes `twitter.com/meghrajgiri`, which returns **404**. You are actively feeding the ambiguity.

4. **himalayas.app/@meghrajgiri is an unexploited asset.** It ranks, it is accurate, and it is not in your `sameAs`. Add it.

5. **Update 2026-08-30:** the GitHub claim has been corrected. `github.com/meghraj` — the handle the site was claiming — is an empty account with 0 repos and no name. The real account is `github.com/meghrajgiri` (8 repos), and its profile website field **already points back at the site**, so the reciprocal link needed for entity resolution exists on one side. The dead Twitter `sameAs` has been removed. `linkedin.com/in/meghraj` remains unverified and is the last open entity signal.

### Arena A action list

- ~~Correct `sameAs` to verified profiles only; drop the 404 Twitter URL and the stray `mailto:`.~~ Done 2026-08-30 — except the unverified LinkedIn URL.
- Add `WebSite` schema with a stable `@id` and reference a single `Person` node by `@id` sitewide.
- Update every external profile (GitHub bio, LinkedIn contact info, Himalayas) to link to **`https://www.meghrajgiri.com`** — reciprocal links are how Google resolves an entity. Note the GitHub profile currently points at the old `.com.np` host and needs changing.
- Publish `/about` as a real URL with `ProfilePage` schema; anchor-only sections cannot rank independently.

**Realistic outcome:** #1 for the exact brand name within 8–12 weeks of the canonical fix — but reset the clock from the date the `.com.np` redirect goes live, not from the canonical fix, and expect a dip first as the migration processes.

---

## 3. Arena B — commercial SERPs (documented, then abandoned)

Live SERP for **"hire React Native developer Nepal freelance portfolio"**:

| Result | Category | Why it wins | Can a solo portfolio displace it? |
|---|---|---|---|
| upwork.com/hire/react-native-developers/np/ | Marketplace | Enormous domain authority, programmatic geo/skill pages, live inventory | No |
| arc.dev/remote-freelance-developers/nepal/react-native | Marketplace | Same pattern, well-funded content ops | No |
| truelancer.com (3 separate URLs ranking) | Marketplace | Programmatic long-tail saturation | No |
| logicabeans.com/react/ | Nepali agency | Local relevance + real service pages + business citations | Unlikely |
| bytecodedevelopers.com/blog/react-native-app-development-in-nepal | Nepali agency | A genuine long-form article — this is the beatable one | **Partially** |

### The honest read

Three of the top seven results are one marketplace (Truelancer) occupying multiple slots. These SERPs are structurally owned by platforms whose entire business model is programmatic page generation at a scale one person cannot match. Ranking here would require hundreds of pages and a link profile that takes years.

**But note the fifth row.** Bytecode ranks with a *blog article*, not a service page. That is the crack in the wall: informational content on the same topic competes on quality rather than authority. It is also exactly what §3 Tier 3 of the strategy proposes.

### The one competitor worth studying

**bytecodedevelopers.com** — a small Nepali dev shop ranking on an agency-topic article. Worth auditing properly in Week 6: what does the article cover, how long is it, what schema does it carry, who links to it. It is the closest thing to a realistic model for what a content-led approach achieves in this market.

---

## 4. Arena C — where you actually compete (the opportunity)

Nobody in Arena B publishes technical depth on the specific stack combinations this portfolio has shipped. Search volume is small; competition is near zero; and the author has first-hand experience, which is the one input a content farm cannot fake.

| Topic | Who currently ranks | Your advantage |
|---|---|---|
| eSewa payment integration in React Native | Scattered forum posts, thin blog spam | You shipped it in Thriftverse |
| Nepal Can Move (NCM) logistics API integration | Essentially nothing | Almost certainly first-mover |
| Multi-tenant storefront subdomains with Next.js + Supabase | Generic SaaS tutorials, no Nepali/marketplace context | You built the real thing |
| Medusa v2 workflows for telehealth/clinic ordering | Medusa docs only | Cannabiz Elite is a live implementation |
| Supabase RLS for marketplace sellers | Supabase docs, a few Hashnode posts | Production experience, edge cases included |
| Offline-first inventory PWA sync | Fragmented | Khatapata |

**Gap summary:** the portfolio's actual differentiator — shipping transactional multi-sided products in an under-documented regional payments/logistics ecosystem — is described nowhere on the site in more than a sentence. Seven project pages average 120 words. The competitive moat exists; it just has not been written down.

---

## 5. Filling the measurement gaps

This analysis is grounded in live SERPs but lacks quantified authority and volume data. To close that, in priority order:

1. **Google Search Console** (already verified — the verification file is in `public/`). Free, and it replaces every *TBC* in the KPI table with real impressions, positions, and query data. **Do this first; it is the single highest-value hour in the plan.**
2. **Bing Webmaster Tools** — free backlink data, which is otherwise the most expensive thing to obtain.
3. **Moz free API tier** — Domain Authority for the subject site and the five Arena B competitors, enough to confirm the gap quantitatively.
4. **Google Keyword Planner** — validates or kills the Tier 2/3 keyword estimates.
5. *Optional:* DataForSEO MCP, if paid tooling is ever justified. Not warranted at this site size.

Re-run this analysis once GSC has 30 days of post-fix data. The current version is a hypothesis grounded in observation; that version will be evidence.

---

*Sources sampled 2026-08-30:* [www.meghrajgiri.com.np](https://www.meghrajgiri.com.np/) · [himalayas.app/@meghrajgiri](https://himalayas.app/@meghrajgiri) · [meghraj.me](https://meghraj.me/) · [upwork.com](https://www.upwork.com/hire/react-native-developers/np/) · [arc.dev](https://arc.dev/remote-freelance-developers/nepal/react-native) · [truelancer.com](https://www.truelancer.com/react-native-freelancers-in-nepal) · [logicabeans.com](https://logicabeans.com/react/) · [bytecodedevelopers.com](https://bytecodedevelopers.com/blog/react-native-app-development-in-nepal)
