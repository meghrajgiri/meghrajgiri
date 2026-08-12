import type { Metadata } from "next";
import Script from "next/script";

/**
 * Staging landing page for the Hair Doctors ad-attribution work.
 *
 * Exists because the real marketing site (telehairdoctors.com.au) is maintained by a
 * third party, so the click → landing → booking chain has to be exercised somewhere we
 * control. Deployed at hd.meghrajgiri.com.
 *
 * It sits OUTSIDE the (site) route group deliberately: it must not inherit the
 * portfolio's navigation, or an ad for a hair clinic would land on a page framed as a
 * developer portfolio — a landing-page mismatch Google's policy review disapproves.
 *
 * Not indexable. It would otherwise compete with the client's real site in search and
 * confuse anyone who found it.
 */
export const metadata: Metadata = {
  title: "Hair Doctors — Online Hair Loss Treatment (Staging)",
  description:
    "Speak with an Australian-registered practitioner about hair loss treatment, online. Staging environment.",
  robots: { index: false, follow: false, nocache: true },
};

/** Set by the deployment; falls back to the sibling booking host. */
const BOOKING_URL =
  process.env.NEXT_PUBLIC_HD_BOOKING_URL ?? "https://booking.meghrajgiri.com/signup";

/**
 * The CTA's hostname, handed to the tracking script so it decorates that link whatever
 * the booking app's address is — `localhost` during testing, a subdomain in production.
 * Falls back to an empty string, which makes the script use its own default rather than
 * silently matching nothing.
 */
const bookingHost = (() => {
  try {
    return new URL(BOOKING_URL).hostname;
  } catch {
    return "";
  }
})();

export default function HairDoctorsLandingPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/*
        Loaded as a plain external script rather than inlined or wrapped in a React
        component: the identical file is handed to the third-party developer for the
        real site, so the demo must exercise exactly what ships.

        `afterInteractive`, NOT `beforeInteractive`: the latter is only honoured in the
        root layout, and inside a page Next emits a preload link and never executes the
        script — silently. Capturing a few hundred milliseconds later is harmless here
        because the script writes its cookie on load and intercepts the CTA click, both
        of which happen long before a human can click anything.
      */}
      <Script
        src="/hd-tracking.js"
        strategy="afterInteractive"
        // The page knows where its CTA points, so it declares that host rather than
        // letting the script guess. Without this the script would default to
        // booking.<this domain> and skip a CTA pointing anywhere else — a localhost
        // target during testing, or a booking app on a different domain entirely.
        data-booking-hosts={bookingHost}
        // Tags booking links for visitors who arrive with NO ad attribution, so an
        // organic read-then-click is distinguishable from someone going straight to the
        // booking link. Without it both arrive with an empty query string and the CRM has
        // to record them both as direct_booking. Real ad attribution always takes
        // precedence — see the subtask "Finalise the utm source…".
        data-fallback-source="website"
        data-fallback-medium="referral"
      />

      <div className="mx-auto max-w-3xl px-6 py-20">
        <p className="mb-4 inline-block rounded bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
          Staging environment — not the live Hair Doctors site
        </p>

        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Hair loss treatment, without the waiting room
        </h1>

        <p className="mt-6 text-lg text-neutral-700">
          Speak with an Australian-registered practitioner about your hair loss, entirely
          online. Get a treatment plan and, if appropriate, a prescription delivered to
          your door.
        </p>

        <ul className="mt-8 space-y-3 text-neutral-700">
          <li>• Consultations by video or phone</li>
          <li>• Treatment reviewed by a registered practitioner</li>
          <li>• Ongoing check-ins, adjusted as your treatment progresses</li>
        </ul>

        <div className="mt-10">
          {/*
            hd-tracking.js appends the stored click id and UTM parameters to this link
            at runtime, so attribution survives the hop to the booking app even where a
            shared cookie is unavailable.
          */}
          <a
            href={BOOKING_URL}
            className="inline-block rounded-md bg-neutral-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            Book a consultation
          </a>
        </div>

        <p className="mt-12 text-sm text-neutral-500">
          This page exists to test campaign tracking end to end. It is not a medical
          service and makes no clinical claims.
        </p>
      </div>
    </main>
  );
}
