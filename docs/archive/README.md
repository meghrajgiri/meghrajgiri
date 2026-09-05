# Archived content

## `removed-site_config-sections.json`

Four rows deleted from the Supabase `site_config` table on 2026-09-05:
`featured_work`, `journey`, `expertise`, `process`.

They were left over from a portfolio template the site was started from. No component
had read them for a long time, but `getAllConfig` fetched every row and spread it into
the object each page rendered from, so all four were serialised into every page's RSC
payload and shipped to crawlers.

They were not merely unused. The content was fabricated placeholder copy that
contradicted the real record now published on the site:

- `featured_work` listed projects that do not exist — "Arena.np" claiming 10,000+ events
  and 1M+ tickets annually, an "Enterprise Design System" with 200+ components, and a
  mobile app with 50K+ downloads and a 4.8-star rating. Demo links pointed at
  `design-system.example.com` and a GitHub handle (`meghraj`) that is not his.
- `journey` claimed a "Senior Frontend Developer" role at "Previous Company", a
  co-founded startup that "raised seed funding", and a BSc from 2015–2019 — against the
  real history of five named employers and a BSc CSIT from 2019–2023.
- `expertise` and `process` were generic agency boilerplate.

Kept here rather than dropped outright because deleting a database row leaves no git
history to recover from. To restore one:

```sql
insert into site_config (key, value) values ('<key>', '<value json>'::jsonb)
on conflict (key) do update set value = excluded.value;
```

Anything restored also needs adding to `rendered` in `src/config/sections.json` before
it will reach the site — and the fabricated claims above should be corrected first.
