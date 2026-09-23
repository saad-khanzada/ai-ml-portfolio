# Architecture

Current implementation map for the baseline identified in [START_HERE](../START_HERE.md).
Exact dependency versions are recorded in package.json and package-lock.json.

## Stack and boundaries

Next.js 16.3.6 App Router, React 19.2.8, TypeScript, Tailwind CSS 4 and CSS
Modules; Sanity 6.13.0 with next-sanity. npm is the package manager.
Public pages use Server Components and server-only content helpers. Navbar is
an interactive client component; Studio configuration is client-side.
The portfolio has no custom contact-form backend or runtime LLM integration.
n8n, Gemini and Supabase belong to the showcased RAG project, not this website's
content-serving infrastructure.

## Source map

| Location | Responsibility |
| --- | --- |
| `app/layout.tsx`, `app/globals.css` | Root layout/fonts and shared CSS foundations |
| `app/(site)/layout.tsx` | Public shell; header, footer and content area |
| `app/(site)/page.tsx`, `components/home/` | Homepage orchestration and sections |
| `app/(site)/about/`, `experience/`, `contact/` | Profile and professional-information pages |
| `app/(site)/projects/`, `blog/` | Listings and dynamic `[slug]` detail routes; local CSS and not-found views |
| `app/studio/[[...tool]]/page.tsx` | Embedded Studio, outside the public shell |
| `components/ProjectCard.*`, `ProfileImage.*` | Shared project cards and portrait presentation |
| `components/content/` | Portable Text, code blocks and shared content images |
| `components/ui/`, `components/info/` | UI primitives, information styling and CMS-unavailable UI |
| `lib/navigation.ts` | Enabled public navigation |
| `lib/metadata.ts`, `app/sitemap.ts`, `app/robots.ts` | Canonicals, social metadata and crawler endpoints |
| `lib/contentDate.ts` | Shared UTC date formatting |
| `sanity/schemaTypes/` | Editable CMS schema definitions |
| `sanity/constants.ts`, `sanity/structure.ts`, `sanity.config.ts` | Profile singleton identity and Studio configuration |
| `sanity/env.ts`, `sanity/lib/client.ts` | Public CMS configuration/client |
| `sanity/lib/queries.ts`, `content.ts`, `fetch.ts` | GROQ queries, typed helpers and published fetch boundary |
| `sanity/lib/image.ts` | Sanity image URLs and transformations |
| `sanity/schema.json`, `types/sanity.generated.ts` | Generated schema snapshot and query types; not CMS backups |
| `sanity.cli.ts` | Schema/TypeGen configuration |
| `next.config.ts` | Image-origin restriction and response headers |
| `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs` | Dependencies, scripts, TypeScript and lint configuration |

Use `git ls-files` for the complete current inventory. Do not maintain a duplicate
handwritten list of every file. `public/` contains tracked static assets; Sanity
hosts CMS images and optional uploaded files.

## Rendering and data flow

Public route -> `sanity/lib/content.ts` -> centralized GROQ query ->
`fetchPublishedQuery` -> Sanity published dataset -> typed props -> components.
Metadata uses the same content helpers. React `cache` shares repeated calls
within a server render. Fetching uses `perspective: published`, `useCdn: false`,
no private token, a 10-second timeout and Next revalidation of 60 seconds.
Revalidation is request-driven, not an exact publishing deadline.
`sanity/lib/live.ts` exists but is not wired into the website; no live preview.

Missing detail data returns null and routes use not-found behavior. Invalid slugs
are rejected before fetching. Fetch failures throw `CmsFetchError`; they must
not masquerade as empty collections or genuine missing documents. Homepage
currently uses an all-or-nothing availability fallback if its content fetches fail.

Projects filtering is server-side over the list query result using
`?category=<slug>` and category document IDs. Unknown/repeated categories have
an unavailable state. Pagination is not implemented.

## CMS relationships

| Schema | Purpose / relationship |
| --- | --- |
| `profile` | Profile / Site Settings singleton, including optional links and SEO |
| `projectCategory` | CMS-managed project categories |
| `skill` | Skills used by profile presentation and referenced content |
| `project` | Case study, category/skill references, resources, metrics and imagery |
| `experience` | Professional records; explicit homepage selection |
| `certification` | Credentials and optional supporting links |
| `blogPost` | Article; profile author and optional related-project references |
| `contentImage`, `richText` | Shared image and Portable Text structures |

The authoritative profile ID is `site-profile`. Studio hides duplicate creation
and delete controls; this is an editor convenience, not an API permission boundary.
Queries must retain fixed-ID selection. Optional values and unresolved references
can be null. Hide unusable links, images and sections without empty gaps.
A project may appear without a detail link if its slug is absent.

## Change map and conventions

| Requested change | Inspect first |
| --- | --- |
| Homepage section | Homepage route, corresponding home component and its query |
| Card redesign | ProjectCard variants/CSS and each caller |
| Case-study/blog body images | ContentImage, RichText, Content.module.css, contentImage schema |
| New CMS field | Schema -> query projection -> generated types -> consuming component |
| New public route | Route, navigation, metadata, sitemap and required empty/error states |
| Domain/security/image host | Metadata origin, next.config.ts and Operations |

Use existing typed helpers and `@/` imports. Follow neighboring formatting rather
than reformatting unrelated files. Keep browser-only behavior in narrow client
components and server-only imports out of client bundles. Reuse UI primitives.
Resource URL validation rejects unsupported protocols and embedded credentials;
rich-text links additionally allow mailto. Preserve that boundary.
Generate schema/types with the commands in Operations; never hand-edit them.
