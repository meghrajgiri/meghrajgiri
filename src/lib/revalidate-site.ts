import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Flush the caches a content edit invalidates.
 *
 * Shared by `/api/config` and `/api/projects` so the two cannot drift. The metadata
 * routes are listed explicitly because they do not participate in the layout
 * revalidation above them: without those two lines a project added from the CMS stays
 * missing from the sitemap until the next deploy.
 */
export function revalidateSite(slug?: string) {
  revalidateTag("site-config");
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
  if (slug) revalidatePath(`/projects/${slug}`);
}
