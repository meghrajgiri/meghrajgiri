import { Breadcrumbs } from "@/components/Layout/Breadcrumbs";
import { getAllConfig } from "@/lib/config";
import { Markdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/page-metadata";
import { buildBreadcrumbs, graph } from "@/lib/schema";
import type { Metadata } from "next";

const TRAIL = [
  { name: "Home", path: "/" },
  { name: "Privacy", path: "/privacy" },
];

/** Bump whenever the policy text below changes; it is shown on the page. */
const UPDATED = "2026-10-11";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getAllConfig();
  return pageMetadata(config, {
    path: "/privacy",
    title: "Privacy Policy — Meghraj Giri",
    description:
      "What this site collects, the cookies Google AdSense sets on the blog, and how to opt out or ask for your data to be deleted.",
  });
}

/**
 * Written in code rather than the CMS on purpose: it describes what the code does —
 * where the contact form writes, which scripts load where — so it should change in
 * the same commit as that code, not drift away from it in a database row.
 *
 * AdSense requires the advertising-cookie disclosure and the opt-out links in the
 * "Advertising" section; keep them if this is ever rewritten.
 */
export default async function PrivacyPage() {
  const config = await getAllConfig();
  const baseUrl = config.metadata.url;
  const email = config.contact?.contactInfo?.email;
  const reach = email ? `[${email}](mailto:${email})` : "the [contact page](/contact)";

  const body = `## Who runs this site

This site is run by Meghraj Giri, a software developer in Butwal, Nepal. For anything in this policy, write to ${reach}.

## What is collected

**The contact form.** When you send a message, the name, email address, subject and message you type are stored in a database (Supabase) and emailed to me through Resend. They are used only to reply to you. Nothing else is collected through the form.

**Analytics.** The site uses Vercel Web Analytics and Speed Insights to count page views and measure load times. They do not use cookies and report only aggregated figures; I cannot identify individual visitors from them.

**Your theme choice.** If you switch between light and dark mode, that preference is kept in your browser's local storage. It never leaves your device.

## Advertising

Articles under [/blog](/blog) show ads served by Google AdSense. No other page on this site loads advertising code.

- Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this site or other websites.
- Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet.
- You can opt out of personalised advertising in [Google's Ads Settings](https://adssettings.google.com). You can also opt out of some other vendors' use of cookies for personalised advertising at [aboutads.info](https://www.aboutads.info/choices/).
- How Google uses information from sites that use its services is explained at [policies.google.com/technologies/partner-sites](https://policies.google.com/technologies/partner-sites).

If you visit from the European Economic Area, the United Kingdom or Switzerland, you will be asked for consent before personalised ads are shown, and you can change that choice at any time from the privacy link in the consent message.

## How long data is kept

Contact messages are kept for as long as they are useful for the conversation they started, and deleted on request. Advertising cookies are set and kept by Google under its own policies.

## Your rights

You can ask what I hold about you, ask for it to be corrected, or ask for it to be deleted, by writing to ${reach}. Depending on where you live, you may also have the right to complain to your local data-protection authority.

## Changes

If this policy changes, the date at the top of the page changes with it.`;

  const jsonLd = graph([buildBreadcrumbs(baseUrl, TRAIL)]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs trail={TRAIL} />

      <article className="px-6 pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="container mx-auto max-w-6xl">
          <header className="max-w-[68ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Last updated <time dateTime={UPDATED}>{UPDATED}</time>
            </p>
            <h1 className="mt-4 text-[2rem] md:text-5xl">Privacy policy</h1>
          </header>

          <div className="prose-measure mt-12 max-w-[68ch] md:mt-16">
            <Markdown source={body} />
          </div>
        </div>
      </article>
    </>
  );
}
