/**
 * Whole years elapsed since a date.
 *
 * Not `(now - start) / 31_536_000_000`. A millisecond division drifts by a day per
 * leap year and would tick over to the next whole year slightly early — for a figure
 * that states how long someone has been working, rounding up even once is the kind of
 * small inaccuracy that is worth avoiding. Comparing calendar fields and borrowing
 * gives the answer a person would arrive at by counting.
 *
 * UTC deliberately: the value is computed during the build and read by browsers in
 * other timezones, and local calendar fields would let those disagree at a boundary.
 */
export function yearsSince(
  startISO: string,
  now: Date = new Date(),
): number | null {
  const start = new Date(startISO);
  if (Number.isNaN(start.getTime()) || start > now) return null;

  let years = now.getUTCFullYear() - start.getUTCFullYear();

  // The anniversary has not come round yet this year, so one of those years is
  // incomplete and does not count.
  const monthDelta = now.getUTCMonth() - start.getUTCMonth();
  if (
    monthDelta < 0 ||
    (monthDelta === 0 && now.getUTCDate() < start.getUTCDate())
  ) {
    years -= 1;
  }

  return Math.max(years, 0);
}

/**
 * Which configured stat a derived tenure figure should take over.
 *
 * The hero calls it "Professional experience" and `/about` calls it "Years in tech",
 * and both are typed into the CMS by hand — so the rule for recognising them lives
 * here rather than as two regexes that can drift apart. Anything matching is replaced
 * by the computed value when `personal.careerStart` is set, and left exactly as
 * authored when it is not.
 */
export const TENURE_LABEL = /professional\s+experience|years?\s+in\s+tech/i;
