/**
 * AdSense settings, read from the environment rather than the CMS: the publisher ID
 * also has to appear in `/ads.txt`, and it is fixed per account, not per post.
 *
 * Everything that consumes this renders nothing when the ID is missing or malformed,
 * so a preview deploy without the env var — or a typo in it — ships no ad code at all
 * instead of a script tag Google will reject.
 */
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();

/** `ca-pub-` followed by the 16-digit publisher number, exactly as AdSense shows it. */
export const adsenseClient =
  CLIENT && /^ca-pub-\d{16}$/.test(CLIENT) ? CLIENT : undefined;

/** The manual unit placed after an article's body. Optional: without it, only Auto ads run. */
export const articleAdSlot =
  process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT?.trim() || undefined;
