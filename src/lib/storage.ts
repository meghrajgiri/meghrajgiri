/**
 * The bucket project images live in.
 *
 * Its own module so the uploader can name it without importing anything server-side, and
 * so anything server-side that needs it later does not have to import a client component.
 */
export const PROJECT_IMAGES_BUCKET = "project-images";
