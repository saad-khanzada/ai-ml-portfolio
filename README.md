# AI/ML Portfolio

A professional AI/ML portfolio for internships, junior roles, freelancing,
and collaboration. Content is managed in Sanity; presentation and frontend
behavior remain controlled in code.

## Stack

- Next.js 16.3.4, App Router
- React 19.2.8, TypeScript, Tailwind CSS
- Sanity 6.13.0 with next-sanity
- Embedded Sanity Studio at /studio
- npm and GitHub
- Vercel hosting and Hostinger domain integration are planned later

## Local setup

Use Node.js 22.18.0 or a compatible supported version satisfying the
installed packages' engine requirements. Current development uses npm 10.9.3.

Install the committed dependency versions:

    npm ci

Copy .env.example to .env.local if .env.local does not already exist.
Fill in:

- NEXT_PUBLIC_SANITY_PROJECT_ID: the Sanity project ID
- NEXT_PUBLIC_SANITY_DATASET: production
- NEXT_PUBLIC_SANITY_API_VERSION: 2026-09-09

These three settings are public configuration, not secrets.
Never commit .env.local or private tokens. No private API token is required
for the current public-dataset foundation. Studio uses Sanity sign-in.

Run development:

    npm run dev

Website: http://localhost:3000
Studio: http://localhost:3000/studio

Validate:

    npm run lint
    npx --no-install sanity schemas validate
    npm run build

Test the production build:

    npm run start

Stop an existing server before rebuilding or starting another server on
the same port. Restart/rebuild after changing environment configuration.

## Architecture

- app/(site)/: public website shell and pages
- app/studio/: embedded Sanity Studio
- sanity/schemaTypes/: modular documents and shared content types
- sanity/structure.ts: Studio navigation and profile singleton entry
- sanity/constants.ts: authoritative profile document ID
- sanity/env.ts: public CMS configuration
- sanity/lib/: centralized typed CMS queries, fetching and image helpers
- sanity.config.ts: Studio schemas, plugins, templates and actions
- sanity.cli.ts: Sanity CLI project configuration

Document types: Project Category, Skill, Project, Experience,
Certification, Profile / Site Settings, and Blog Post.

The profile singleton uses document ID site-profile. Studio removes its
general creation template and duplicate/delete actions. These UI controls
do not replace API permissions. Future queries must select this fixed ID.

Projects reference CMS-managed categories and skills. Blog authors reference
the profile; related projects use references. No project categories are
hard-coded.

Shared rich text supports paragraphs, headings, lists, links, quotes,
images and plain code-block fields. Tables are deferred. Image content
supports alt text, captions and crop/hotspot metadata.

Optional content remains optional. Future frontend components must hide
missing links, images and sections without broken buttons or empty gaps.
An optional project slug must exist before offering its case-study route.

Schema-definition validation checks configuration; it does not by itself
prove every document-validation rule or editor interaction works.

## Sanity access and cost

Project: AI ML Portfolio
Project ID: smoxl14u
Dataset: production (public)

The account displayed a $0 Growth Trial with automatic transition to Free.
The portfolio must not depend on trial-only features or paid upgrades.
Review quotas and billing settings before production launch.

Local Studio CORS: http://localhost:3000, credentials allowed.
The unused localhost:3333 origin was removed. Do not add wildcard origins.
Add exact deployed origins only when deployment requires them.

At the access review, the project had one member: its owner, Administrator.
Use appropriate limited roles for any future collaborators. Never place
private data in published public-dataset content.

## Dependency security review

Temporary overrides under the frameworks package select:
- js-yaml 3.15.2
- smol-toml 1.6.1

These address findings in the Sanity CLI dependency tree. Keep the override
rationale documented and remove overrides when upstream dependencies
provide suitable fixes and validation passes.

The latest audit reported 12 moderate findings, with no high findings.
The remaining underlying advisories concern uuid and adm-zip; dependent
packages are also counted. This is not a clean audit.

UUID: installed typeid-js 1.2.0 uses v7 and stringify. The advisory concerns
v3/v5/v6 with caller-provided buffers. Inspection did not show those affected
functions in this TypeID usage; this is a limited exposure assessment,
not a patch or a guarantee about every dependency.

https://github.com/advisories/GHSA-w5hq-g745-h8pq

An upstream typeid-js change declared UUID 11.1.1, but version 1.2.1 was not
available from npm when checked. Attempted UUID overrides did not resolve
correctly and were removed. No UUID override is retained.

ZIP: Module Federation type-download tooling calls
extractAllTo(destinationPath, true). The advisory involves existing
destination symlinks redirecting writes outside the extraction directory.
A Sanity Blueprint asset module also imports adm-zip; its complete usage
was not established by the inspection. Module Federation and Blueprint
workflows are not configured for this portfolio.

https://github.com/advisories/GHSA-vwc7-r8mq-g2x9

The ZIP advisory had no patched version listed at review. Do not describe
it as fixed. Avoid untrusted archive extraction into shared or
attacker-writable directories. Reassess both advisories, dependency updates
and actual exposure before launch. Do not use npm audit fix --force to
downgrade Sanity below next-sanity's compatibility requirements.

## CMS data access

- sanity/lib/queries.ts: nine centralized GROQ queries.
- sanity/lib/content.ts: typed server-only content helpers.
- sanity/lib/fetch.ts: published-content fetching and CMS error handling.
- sanity/lib/image.ts: image URL builder and nullable image helper.
- sanity/schema.json: generated schema snapshot, not CMS content.
- types/sanity.generated.ts: generated schema and query-result types.
- sanity.cli.ts: TypeGen configuration.

After changing schemas, refresh the snapshot:

    npx --no-install sanity schemas extract --path sanity/schema.json --force

After changing queries or refreshing the snapshot, regenerate types:

    npx --no-install sanity typegen generate

Commit generated files alongside the source changes that produced them.
Do not edit generated files manually. One ESLint rule is disabled only for
the generated type file because TypeGen emits an empty extension interface.

Use content.ts from Server Components. Reads use the published perspective,
no private token, the Sanity API directly, and Next.js revalidation set to
60 seconds. React cache shares repeated helper calls within a server render.
Revalidation is request-driven; this is not a scheduled publishing service.

The profile helper selects the fixed site-profile ID. List queries return
empty arrays when no documents exist. Missing detail/profile queries return
null. Invalid slugs return null without making a CMS request.
CMS request failures throw CmsFetchError with a generic message.
Future pages must handle that error separately from genuinely missing content.

References and optional fields may be null. Future rendering must hide
missing links, sections and unresolved references cleanly.

getImageUrl returns null for missing or malformed image references and invalid
dimensions. Width-only requests preserve aspect ratio with fit=max.
Width plus height supports CMS crop/hotspot positioning. Components remain
responsible for alt text, responsive sizes and Next.js image rendering.

The initializer-generated live.ts is not wired into the website.
The current data layer uses fetch.ts and does not enable live preview.

## Website design system

The public website uses app/(site)/layout.tsx. Embedded Studio remains
outside this route group and does not receive the portfolio header/footer.

The site shell uses the Premium Editorial AI light palette, responsive
spacing, visible keyboard focus and reduced-motion rules.

Reusable components:
- Navbar and Footer with conditional CMS-driven identity and links.
- Button, ButtonLink, SectionHeading, Card, SkillBadge and EmptyState.
- ProfileImage with responsive sizing and CMS crop/hotspot support.

Navigation availability is centralized in lib/navigation.ts. Routes that
have not been implemented are currently non-interactive labels. Enable
each route when its page is ready; this is temporary development behavior.

ProfileImage returns nothing when its image URL or alternative text is
unavailable. CMS alternative text takes precedence, with the profile name
as a fallback. It uses a 4:5 portrait crop and defaults to lazy loading.
Callers supply sizes to match their layout.

Next.js remote image optimization is restricted to HTTPS cdn.sanity.io
images in the configured project/dataset. Variable query parameters are
allowed for Sanity image sizing and crop transformations.

## Homepage implementation

The homepage is a Server Component using the existing typed CMS helpers.
Profile, projects, skills, experience and blog requests start in parallel.
A CMS fetch failure displays a generic availability message rather than
being presented as an empty collection. The current page uses an all-or-
nothing content fallback if any of these requests fails.

Section order:
1. Hero
2. Featured projects
3. Skills
4. Experience snapshot
5. Recent writing
6. Contact CTA

Hero content comes from the published profile. Missing profile content
uses the neutral AI/ML Portfolio heading. Optional introduction, location,
portrait and resume link disappear when unavailable. The Projects button
appears only when the featured-projects section has qualifying content.

The hero retains Sanity crop/hotspot positioning and a 4:5 portrait ratio.
Portrait width is capped at 14rem on mobile, 16rem on tablet and 20rem on
desktop, with matching responsive image sizes. Hero imagery is preloaded.
Alternative text uses CMS text with the profile name as fallback.

Featured projects shows up to three featured records with nonblank titles.
Skills shows featured skills grouped by their CMS category.
Experience shows up to three records with role and organization.
Recent writing shows up to three records with a title and valid slug.
These sections preserve the ordering supplied by the centralized queries.

ProjectCard is reusable. Project titles link to case studies when they
have a valid slug. Blog detail links remain disabled until Phase 8.
Cover images require an image URL and alternative text.
Missing categories, references and optional content render conditionally.

Contact displays only when a usable email or web LinkedIn URL exists.
CMS contact heading/text are supported; the heading falls back to
Get in touch. No contact form or custom backend has been introduced.

lib/contentDate.ts formats dates consistently in UTC and omits values
that JavaScript cannot parse as dates. It is not a strict calendar validator.

## Projects listing

/projects is a Server Component that awaits URL search parameters.
It reuses getProjects, getProjectCategories, ProjectCard and EmptyState.
No new dependency or client-side filtering component was added.

Category filters come from published Sanity categories with usable titles
and slugs. URLs use /projects?category=<slug>; matching projects are selected
by the category document ID. Filtering occurs on the server over the
existing project-list query result, preserving its sort order.

All projects includes records with nonblank titles, including projects
without case-study slugs. Valid project slugs enable case-study title links;
projects without valid slugs remain visible without a detail link.

Unknown categories and repeated category parameters display Category
unavailable. An absent or empty category parameter selects All projects.
Valid categories with no projects have their own empty state.
CMS failures display an availability message rather than an empty result.

Category filters use native links; All projects and invalid-filter recovery
use Next.js Link. Links retain visible focus and aria-current for selection.
They wrap at narrow widths and support refresh, bookmarks and browser
history. The page renders on demand; CMS fetches retain the existing
60-second revalidation configuration.

Phase 6 browser checks passed:
- Desktop/mobile Projects navigation and keyboard operation.
- Empty listing, invalid-category recovery and zero-result category.
- Two projects filtered independently through two CMS categories.
- Correct counts and selected-filter presentation.
- Filter persistence through refresh and Back/Forward.
- Responsive layout without observed horizontal scrolling.
- Project cover-image delivery without stretching.
- Missing cover image leaves no empty image area.

Limits: large collections, duplicate category slugs and the CMS-outage
presentation have not been exercised in browser tests. Pagination is not
implemented. Reassess query scope and pagination if the collection grows.

## Project case studies

/projects/[slug] is a Server Component using getProjectBySlug.
Missing, invalid or untitled projects use the project not-found view.
CMS fetch failures display a generic availability message and a full-page
retry rather than being treated as missing content.

One flexible template conditionally renders project identity, date,
category, technologies, tags, resource links, rich-text sections, metrics
and screenshots. Empty optional content is omitted.

ProjectCard now enables valid project detail links by default.
The case-study page provides Back to projects navigation.

Shared content components:
- ContentImage validates image references, crop dimensions and alt text.
- RichText renders Portable Text using next-sanity's existing re-export.
- Code blocks preserve literal text and line breaks, with optional filename
  and language metadata separated by an encoding-safe middle dot.
- Web resource links accept HTTP/HTTPS URLs without embedded credentials.
  Rich-text links additionally support mailto URLs.

The case-study cover uses a distinct 16:9 Sanity crop requested at
1440 x 810, preserving the existing crop/hotspot input and alt text.
It spans the article width without stretching.

Gallery images use their cropped aspect ratio. Maximum figure widths are
56rem for landscape, 36rem for near-square, 26rem for portrait and 22rem
for very tall images, constrained by available container width.
Images retain their proportions; captions share the figure width.
Viewport-height caps are not used. Very long images can remain vertically
long, and enlarging low-resolution sources cannot restore missing detail.

These case-study sizing rules do not change homepage cards or the profile
portrait. Images embedded inside rich text retain the shared full-width
presentation. The current sizes hint is conservative and can overestimate
narrow gallery figures; image-payload tuning remains a performance task.

Phase 7 reported browser checks:
- Missing-project handling and minimal published case-study rendering.
- Listing title links and Back to projects navigation.
- Required category and technology selection before Studio publishing.
- Conditional identity, date, category, skill and optional-content display.
- Bold, italic, inline code, bullet lists, numbered lists and an external link.
- Code-block insertion through the Studio editor's three-dot menu.
- Filename/language fields, Python line breaks and literal special characters.
- Corrected code metadata separator.
- Cover and gallery image delivery, caption display and homepage card imagery.
- Accepted portrait gallery sizing and distinct landscape cover presentation.
- Metric label/value/context and populated GitHub/Live demo resource buttons.
- No observed horizontal overflow in the tested desktop and narrow layouts.

Validation limits:
- Representative square, landscape and extremely tall gallery examples have
  not all received separate visual acceptance.
- Rich-text embedded images and every rich-text style/list combination have
  not been separately exercised.
- The four other resource button types share the reviewed rendering path
  but were not individually reported as clicked.
- An explicit homepage project-title click was not separately recorded.
- Case-study CMS-outage UI was source-reviewed, not browser-injected.
- Full accessibility, performance and SEO checks remain in later phases.
- Final lint, TypeScript and production build passed after the Phase 7 edits.

## Current phase

Phase 2 completed and pushed:
c8d972a99907826718c2ba0a6b6a0da9a83e90ea - sanity-schema-setup

Phase 3 completed and pushed:
6c370a3d7ee6567314646d38c50049a88c0a25ef - cms-data-access-layer

Phase 4 completed and pushed:
81fad18e84088eb7606b7bb3b97f51bb3f65a59b - portfolio-design-system-and-shell

Phase 5 completed and pushed:
de30ac7c55cc0ef824c20cc2601a460c342f0c21 - cms-driven-homepage

Validation completed:
- Lint, TypeScript and production build after the portrait-sizing change.
- Desktop and narrow-width empty-content checks.
- Published profile updates reaching the running homepage.
- Portrait delivery, crop/hotspot framing and approved responsive sizing.
- Populated projects, skills, experience, writing and contact sections.
- Correct section order and working hero anchor to featured projects.
- Missing optional images/links do not leave empty sections or image areas.
- No horizontal scrolling observed in the tested desktop/narrow layouts.

Temporary test project, post, experience, skill and category were deleted.
Profile test content was cleaned and republished; the user's name, portrait,
crop/hotspot and alternative text were retained.
CMS content changes are separate from Git commits.

Validation limits:
- Project cover-image delivery passed in Phase 6; blog cover-image delivery
  has not been directly tested.
- Resume delivery and the populated LinkedIn CTA were not directly tested.
- Multi-record grid stress cases and comprehensive accessibility checks
  remain for later validation.
- The earlier isolated CMS failure test checked fetch behavior; the
  homepage outage presentation was source-reviewed, not browser-injected.
- Observed CMS refreshes do not establish an exact cache-timing guarantee.

Home and Projects are enabled in the main navigation.
Phase 7 is implemented and undergoing final closeout.
Final content, SEO/security review, deployment and domain work remain later.
Existing dependency findings remain documented above.

Phase 6 completed and pushed:
5cbedeb8f067923ae1e6b66f554c37fdec843ff0 - projects-listing-and-category-filters

Implementation, source review, lint, TypeScript, production build and
browser checks passed. All six Phase 6 test documents were deleted.
Local and remote commits matched and the working tree was clean.

Phase 7 - Project Case Studies:
Implementation and final source review completed. Reported browser checks
passed, including the accepted landscape cover and orientation-aware gallery.
Final lint, TypeScript and production build passed. The temporary Phase 7
project, category and skill were deleted. The Git checkpoint remains pending. Phase 7 is not yet recorded as committed or pushed.

## Recovery and maintenance

GitHub is the recovery source. Clone the repository, install with npm ci,
restore local environment configuration and run the documented commands.
The website does not depend on continued access to Astra.

Retain only verified changes:
fix locally, validate, review the diff, commit the stable phase, then push.
Never commit experimental dependency attempts or secrets.
