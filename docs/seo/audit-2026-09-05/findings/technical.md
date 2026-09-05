# Technical findings — verified directly (2026-09-05)

## Indexation / domains
- 9 URLs, all HTTP 200. Sitemap lists exactly those 9. robots.txt correct, disallows /cms + /api/.
- www.meghrajgiri.com.np returns 200 with duplicate content + cross-domain canonical to .com. NO 301.
- Live search `"Meghraj Giri" developer Nepal` surfaces **.com.np** with a STALE title/description.
  => The canonical domain is not the one Google is showing. Highest-priority fix.
- Brand SERP polluted by unrelated entities (Wikipedia: Meghraj Sharma Nepal, Deepak Raj Giri,
  Amar Giri, Pramila Giri, Gehendra Giri, Prajwol Giri; Behance: Meghraj Dangi). No knowledge panel.

## Rendering
- render_page.py: is_spa=False, mode_used=raw, extracted_text=2,565 chars (~500 words).
- Home is statically prerendered (x-nextjs-prerender: 1), served from Vercel edge cache.
- All primary copy is server-rendered — no JS-dependency problem.

## AI crawlers — all 200
GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot.
/llms.txt, /llms-full.txt, /ai.txt, /humans.txt => 404 (llms.txt judged not worth prioritising).

## Headers
Present: strict-transport-security: max-age=63072000
MISSING: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Content-Security-Policy,
Permissions-Policy. `x-powered-by: Next.js` is exposed unnecessarily.

## Performance
- TTFB 1.0-1.2s cold, cached thereafter.
- HTML 88KB (brotli on the wire).
- **Wasted LCP preload**: src/app/layout.tsx preloads `/Meghraj.jpg` (149KB raw) but the rendered
  <img> requests `/_next/image?url=%2FMeghraj.jpg&w=...`. Different URL => the preload fetches a
  file the browser never uses AND fails to preload the real LCP resource. Net negative.
- /logo.png is 211KB PNG, unoptimised.
- OG image exists and works (/opengraph-image, 35KB PNG).
- CrUX/PSI field data UNAVAILABLE: keyless PageSpeed API quota exhausted. Needs a Google API key.

## Content defects
- /projects/cannabiz-elite ships 8 unfilled template placeholders live ("[N weeks]",
  "[specific constraint]", "[N] Clinics onboarded", "[Measurable outcomes...]",
  "[The retrospective...]", "Pending clearance"). Only page affected. Source: projects config.
- Homepage 502 words; 7 project pages 109-377 words.
- `experience` (5 roles) and `education` (BSc CSIT, IOST/Tribhuvan University) are fully populated
  in config, have CMS editors, and are rendered by NOTHING. Only consumer is
  AboutSection.tsx:20 which reads `.length` to print the number 5.
- Dead nav anchors: #expertise ("Services") and #journey ("Journey") do not exist in the DOM.
  Existing IDs: about, contact, email, featured-work, mobile-nav, password, skills, testimonials.
- TestimonialsSection mounts but renders no testimonial text.
- Factual error: SCSS Consulting entry claims "HIPAA compliance and Australian health policies";
  Cannabiz Elite page tags "HIPAA compliance". HIPAA is US law; Australian telehealth is governed
  by the Privacy Act and AHPRA.
- Stale copyright in navigation.mobileMenu.footer: "© 2024".
- "20+ Products Shipped" vs 7 projects displayed — unexplained ~3x gap.

## Schema (current)
Home: @graph[Person, WebSite]. Projects: @graph[Person, BreadcrumbList, CreativeWork].
Person: @id .../#person, name, url, jobTitle, email, address{addressLocality:"Nepal"},
sameAs:[LinkedIn, GitHub], knowsAbout:[27 skills].
Weak: addressLocality "Nepal" is a country not a locality (he is in Butwal).
Missing: image, description, alumniOf, worksFor, hasCredential, homeLocation, nationality,
knowsLanguage, and the Toptal profile in sameAs.
