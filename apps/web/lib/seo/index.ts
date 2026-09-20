export {
  type BreadcrumbItem,
  buildBreadcrumbJsonLd,
  buildDestinationJsonLd,
  buildExperienceJsonLd,
  buildStayJsonLd,
  buildWebSiteJsonLd,
  type EntityJsonLdInput,
  type JsonLd,
} from "./json-ld";
export {
  buildCatalogTitle,
  buildDestinationTitle,
  buildExperienceTitle,
  buildNotFoundMetadata,
  buildPageMetadata,
  buildPageTitle,
  buildRootMetadata,
  buildStayTitle,
  type PageMetadataInput,
  trimDescription,
} from "./metadata";
export { isNoIndexPath, NOINDEX_PATHS, NOINDEX_PREFIXES, STATIC_INDEXABLE_PATHS } from "./routes";
export {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE_PATH,
  getSiteUrl,
  SITE_NAME,
  SITE_TAGLINE,
} from "./site";
export {
  getDestinationSlugs,
  getExperienceSlugs,
  getStaySlugs,
} from "./sitemap-data";
