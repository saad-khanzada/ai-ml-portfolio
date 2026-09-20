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
- smol-toml 1.7.1

These address findings in the Sanity CLI dependency tree. Keep the override
rationale documented and remove overrides when upstream dependencies
provide suitable fixes and validation passes.

The Phase 12 audit reported 12 moderate findings, with no high or critical findings.
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

Navigation availability is centralized in lib/navigation.ts.
Home, About, Projects, Experience, Blog and Contact are enabled.
The header contains site navigation and the mobile Menu, without a Resume
button. Resume access remains conditional in the homepage hero and About;
no Resume link was added to the footer.

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
4. Selected experience
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
Selected experience shows at most two records explicitly selected in CMS,
with nonblank role and organization. Unset featuredOnHome values behave
as false. Existing query ordering is preserved among selected records.
The compact section omits full descriptions, responsibilities and skills,
and links to /experience. It disappears when no qualifying record is selected.
Recent writing shows up to three records with a title and valid slug.
These sections preserve the ordering supplied by the centralized queries.

ProjectCard is reusable. Project and blog cards link to their detail
routes when they have valid slugs. Both use one semantic title link with
a stretched clickable area, visible keyboard focus and subtle hover feedback.
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

## Blog implementation

/blog and /blog/[slug] use the existing published-content helpers.
The listing preserves query ordering and displays articles with nonblank
titles and valid slugs. RecentPosts is reused: the homepage defaults to
three articles, while the listing supplies the full visible collection.

Missing articles use the article not-found view with Back to blog.
CMS fetch failures have separate generic availability messages and
full-page retry links. No new schemas, queries or dependencies were needed.

Article content includes conditional tags, title, excerpt, author,
publication date, optional author headline, cover, rich text and related
project. A related project requires a usable title and valid slug.
The publication date is display metadata, not a publishing scheduler.

Blog dates use the optional includeDay argument of contentDate, giving
a format such as Sep 13, 2026 in UTC across the listing, article and
homepage Recent writing. Existing callers retain their month/year default.

The article uses the Premium Editorial AI palette and existing fonts.
Back to blog stays left-aligned. Tags, title, excerpt and author/date
metadata are centered. Normal prose remains left-aligned within a centered
column, capped at 44rem, with an additional equal 0.5rem inset on narrow
screens. Code figures and the related-project block retain a 42rem cap.

The landscape cover reuses ContentImage's 16:9 variant. Inline images
preserve cropped aspect ratios and orientation-aware width limits:
56rem landscape, 36rem near-square, 26rem portrait and 22rem very tall.
Captions remain associated with image figures. Shared renderers and
case-study image presentation were not redesigned.

Article and Project cards now use stretched title links consistently on
both listings and homepage sections. Each card retains one semantic link
and one keyboard stop. Cards without valid destinations remain non-interactive.
The overlay can make selecting card text harder; future secondary controls
must be designed to avoid overlapping click targets.

Phase 8 reported browser checks:
- Empty blog, missing article, Back to blog and Blog navigation.
- Keyboard operation and visible focus.
- Published title, excerpt, author, body and conditional optional sections.
- Tags, including the Studio requirement to press Enter to save a tag chip.
- Day-inclusive dates across all three blog views.
- Cover and inline-image delivery, captions, H2 and literal code rendering.
- Homepage article links and related-project navigation.
- Accepted centered editorial header, reading width and mobile text balance.
- Whole-card image/text/metadata/padding interactions in all four locations:
  homepage Featured Projects, homepage Recent writing, /projects and /blog.
- Clicking outside cards does not navigate.
- Card dimensions and image sizes remain unchanged, with no reported
  horizontal overflow in the tested desktop and narrow layouts.

Validation limits:
- Multi-article ordering and the homepage three-item limit were source-reviewed,
  not verified with a collection exceeding three published test articles.
- Large collections, pagination and duplicate article slugs were not tested.
- CMS-outage presentation was source-reviewed, not browser-injected.
- Comprehensive assistive-technology, long-form-content and cross-browser
  testing remain for later accessibility and production QA phases.
- Image payload tuning, article-specific SEO and final security review remain
  in their planned later phases.
- Observed content refreshes do not establish an exact cache-timing guarantee.

Phase 8 implementation and final source review are complete.
The temporary test article, related project, category and skill were deleted.
Final lint, TypeScript, production build and whitespace checks passed.
Phase 8 completed and pushed:
93e1aa3007cd649d05f0054b0c0fb095dc2a9909 - blog-articles-and-editorial-layout
Local and remote matched and the working tree was clean at that checkpoint.

## About, Experience and Contact

Phase 9 adds /about, /experience and /contact as Server Components using
existing centralized CMS helpers, generated types and reusable components.
Optional content is conditional. CMS failures use a generic availability
message separately from empty content. No new service, dependency,
authentication, contact form or backend was introduced.

About displays available profile identity, portrait, background, education,
skills grouped by CMS category, featured certifications and a Resume CTA.
Certifications require qualifying content and Featured selection.
Skills do not use percentage ratings.

Experience uses an editorial layout with desktop metadata and content
columns, mobile stacking and thin separators. It continues to display all
qualifying published experience records regardless of homepage selection.
Optional descriptions, responsibilities, skills, logos and external website
links render conditionally. External links use the label Visit website
with a decorative arrow.

Experience has an optional featuredOnHome boolean labelled Show on homepage.
The query projects unset values as false without changing record ordering.
Homepage selection is explicit, limited to two qualifying records, and
does not hard-code role relevance. The schema snapshot and generated types
were refreshed alongside the schema/query change.

Contact retains one H1, an optional introduction, a clickable email address,
conditional professional profile text links and optional location.
It avoids duplicate email buttons and heavy cards. Professional links
retain comfortable touch targets, visible focus and restrained hover feedback.

The global header Resume button was removed. Homepage hero and About retain
conditional Resume access. The Navbar optional resumeUrl prop remains
accepted for caller compatibility but is not used to render header content.
Arrow decorations are hidden from assistive technology.
No new animation was introduced; motion remains deferred to Phase 10.

Phase 9 reported browser checks:
- About, Experience and Contact routes, initial content and empty states.
- Populated Experience role, organization, dates, description and responsibilities.
- Accepted compact Selected experience and full editorial Experience layouts.
- Contact email and professional profile links on desktop and mobile.
- Visible keyboard focus, subtle hover feedback and homepage Experience link.
- Background bio, education details and skills under CMS-managed categories.
- Featured certification inclusion and removal after Featured was disabled.
- About Resume PDF delivery.
- Header Resume removal, retained Home/About Resume access and mobile Menu
  navigation, including Escape dismissal.
- Clean wrapping and no reported horizontal overflow at tested widths.

Validation:
- Schema validation passed with zero errors and warnings after featuredOnHome.
- Schema extraction and TypeGen succeeded: nine queries and 26 schema types.
- Lint, TypeScript, whitespace checks and production build passed for the
  editorial refinement and text-link polish.
- Header removal browser checks and its lint, TypeScript, whitespace
  and production-build validation were confirmed passed.

Validation limits:
- The Experience external website link was not browser-tested.
- A multi-record browser test of the homepage two-item cap and selected
  record ordering has not been confirmed.
- Experience logos, certification images and every optional external-link
  combination were not separately reported as exercised.
- CMS-outage UI was not browser-injected for these pages.
- Comprehensive accessibility, cross-browser, performance, SEO and security
  reviews remain for their planned later phases.
- Observed CMS refreshes do not establish an exact cache-timing guarantee.

Cleanup and checkpoint:
- User confirmed removal of temporary profile content and the test resume.
- The cleaned profile was published. Phase 9 test role, Phase 9 test skill
  and Phase 9 test certification were deleted; cleanup is confirmed.
- CMS content and asset changes are separate from Git commits.
- Phase 9 completed and pushed:
  a403e35c928895ac934293301999dd3133bf6274 - about-experience-contact-pages
- Local and remote matched and the working tree was clean at that checkpoint.

## Restrained interaction transitions

Phase 10 adds CSS-only transitions to existing interaction states:
- Buttons: background and border colors, 150ms ease-out.
- Header/footer links: color, 150ms ease-out.
- Clickable Project and Blog cards: border and title colors, 180ms ease-out.
- Selected Experience and Contact/Experience links: color, 150ms ease-out.

Transitions apply only when hover is supported and reduced motion is not
requested. Existing reduced-motion rules remain intact. Focus outlines
and underline-state changes remain immediate.

No layout, image sizing, content, routing, CMS or dependency changes were
introduced. No entrance animations, image movement, decorative AI motifs,
JavaScript animation, smooth scrolling or moving arrows were added.

Validation and acceptance:
- Lint, TypeScript, whitespace checks and production build passed.
- Available header/footer links and buttons were manually reviewed.
- Keyboard focus remained visible.
- Narrow/mobile navigation and tapping worked without observed overflow.
- Header-link computed transition-duration was verified as 0.15s normally
  and 0s under prefers-reduced-motion: reduce.
- Browser emulation was restored to No emulation.
- The user explicitly accepted Phase 10.

Validation limits:
- Project and Blog card hover was not browser-tested because no corresponding
  documents were published.
- Absent optional Contact/Experience links were not browser-tested.
- These CSS paths were source-reviewed; browser checks remain for real-content
  validation in Phase 13. No temporary CMS content was recreated.

Phase 10 completed and pushed:
b35c95801d0ddcb244552c906f3a26b6c282c58c - restrained-interaction-transitions
Local and remote matched and the working tree was clean at that checkpoint.

## Responsive and accessibility review

Phase 11 reviewed presentation source for landmarks, headings, keyboard
focus, touch targets, responsive constraints and long-content behavior.
Previously accepted layouts and Phase 10 motion were preserved.

The only implementation change replaces the undefined --site-bg-muted
inline-code background reference with the existing --site-surface-muted
token in components/content/Content.module.css.

Reported browser checks passed for available content:
- Home and Contact skip links appear during keyboard navigation.
- Enter moves focus to main content; subsequent Tab continues from there.
- Home's main focus outline differs visually from Contact, but focus
  transfer and subsequent keyboard order were confirmed functional.
- Desktop Tab, Shift+Tab and Enter operate logically with visible focus.
- Closed mobile Menu links are excluded from Tab navigation; opening the
  Menu makes its links reachable.
- Home, About and Contact reflow at 200% and 400% browser zoom without
  reported clipping, overlap, missing content or page-level horizontal scroll.
- The Menu remains reachable and usable at high zoom.
- Browser zoom was restored to 100%.

Lint, TypeScript, whitespace checks and production build passed after
the single-token correction. The user explicitly accepted Phase 11.

Validation limits:
- Long Project/Blog titles, long project URLs and long code-line behavior
  were not browser-tested because suitable published content was unavailable.
- The corrected inline-code background was source-verified but its rendered
  appearance was not separately browser-tested.
- These content-dependent checks remain for Phase 13; no temporary CMS
  content was recreated.
- Selected solid-color contrast pairs were calculated from CSS tokens.
  This was not a complete rendered contrast or accessibility-conformance audit.
- Comprehensive assistive-technology and cross-browser coverage remains
  for subsequent production QA.

Observation, not a confirmed defect:
- Contact briefly appeared incorrectly once after keyboard navigation to
  GitHub and Chrome Back. Refresh restored it. Repeated attempts, including
  keyboard navigation, did not reproduce it. No workaround was added.
  Investigate only if reproducible behavior or source evidence emerges.

The root/default metadata issue was subsequently addressed in Phase 12.

Phase 11 completed and pushed:
ec2bdea0469e802062bcbf9681421c6c50c56fbc - responsive-accessibility-review
Local and remote matched and the working tree was clean at that checkpoint.

## Phase 12 - Metadata, indexing, security and performance

The user accepted Phase 12 after automated validation, browser review and
a local homepage performance assessment. Phase 12 was committed and pushed:
04e5fa3e05931395aa055cabe2288f1e907afca1 - seo-security-and-performance-review
Local and remote matched and the working tree was clean at that checkpoint.

Metadata and indexing:
- Confirmed production origin: https://saadkabeer.online.
  This configuration does not establish that deployment or DNS is complete.
- lib/metadata.ts centralizes public metadata using existing CMS helpers.
- Public pages supply titles, descriptions, canonical URLs, Open Graph and
  Twitter metadata. Optional social images use available CMS content.
- Project and article metadata reuse existing detail helpers and SEO fields.
- Root placeholder metadata was replaced. Studio's own metadata export remains.
- Filtered Projects URLs canonicalize to /projects.
- Missing project/article routes returned HTTP 404 with HTML noindex.
- app/sitemap.ts includes the six public pages and qualifying published
  Project/Blog routes, excludes Studio and filters, and revalidates at 60 seconds.
- Sitemap fetching does not silently convert CMS failures into empty collections.
- app/robots.ts allows crawling and points to the production sitemap.
  Studio remains crawlable so its HTML noindex can be read.

Security and dependencies:
- Only the existing nested smol-toml override changed from 1.6.1 to 1.7.1.
  The separate Sanity CLI 1.8.0 copy and all other locked versions were retained.
- This addressed the targeted smol-toml advisory:
  https://github.com/advisories/GHSA-7w5x-hrqm-74c2
- The resulting audit reported 12 moderate findings and zero high/critical
  findings. The uuid and adm-zip findings remain; this is not a clean audit.
- next.config.ts disables X-Powered-By and adds nosniff and
  strict-origin-when-cross-origin referrer policy.
- Public routes receive X-Frame-Options: SAMEORIGIN.
  /studio and its descendants are excluded from that frame rule.
- VERCEL_ENV=preview adds X-Robots-Tag: noindex.
  Production and unset/local configuration do not add that header.
- No CSP or HSTS was added. Reassess these at the pre-launch security review.
- Indexing controls are not authentication or access restrictions.

Validation:
- Schema validation passed after the dependency correction.
- Lint, TypeScript, whitespace checks and production builds passed.
- Rendered public metadata and canonical URLs were inspected locally.
- Home/About browser-tab titles were accepted without duplicated branding.
- robots.txt and sitemap.xml returned HTTP 200 with expected canonical URLs.
- Header configuration checks passed for production, preview and unset/local.
- Runtime headers passed for Home, About, Contact, robots.txt, sitemap.xml,
  /studio and /studio/structure. Studio retained HTML noindex.
- Home/About, navigation and images worked in the browser. Studio opened
  Profile / Site Settings with editor fields visible; no CMS content changed.
- The Incognito homepage Lighthouse mobile performance report scored 96:
  FCP 1.0s, LCP 2.2s, TBT 190ms, CLS 0 and Speed Index 1.0s.
- That report had no run warnings. The earlier score of 89 included an
  IndexedDB warning; the score difference cannot be attributed solely to it.
- No speculative performance changes were made. Accepted layouts, image
  sizing and interaction behavior were preserved.

Validation limits and follow-up:
- Lighthouse measured localhost with simulated mobile conditions and the
  currently available content. It is not deployed or real-user performance.
- Image-delivery, loading-priority and JavaScript suggestions remain recorded;
  further optimization should be justified by representative measurements.
- Published detail metadata, SEO overrides, social-image previews and dynamic
  sitemap entries still need representative real-content validation in Phase 13.
- Actual Vercel preview noindex, production indexing behavior, domain/DNS,
  HTTPS and deployed headers must be verified after deployment.
- A sitemap and metadata do not guarantee search indexing.
- Earlier content-dependent accessibility and responsive limits remain.
- No temporary Project/Blog content was recreated for unavailable checks.
- Remaining dependency exposure and final security settings require review
  before launch. No new service, paid feature or animation dependency was added.

## Phase 13 - Accepted project presentation checkpoint

The published RAG case study informed a shared Project template refinement.
This checkpoint preserves the accepted Project changes before separate Blog
image-sizing work. It does not mark Phase 13 complete.

Presentation:
- Project titles use a smaller desktop maximum and explicit heading line spacing.
- Major section headings and desktop section spacing were refined.
- Body text uses a centered reading column; screenshots can remain wider.
- Existing cover treatment, routes and unrelated page layouts were preserved.

Project screenshots:
- Optional displaySize supports Auto, Compact, Standard and Wide.
- An unset value behaves as Auto without migrating existing CMS records.
- Inline case-study images and screenshot-gallery items share the renderer.
- Images shrink proportionally within available space and preview-height limits.
- The sizing rules avoid enlargement beyond the image composition's natural width.
- Intentional Sanity crop settings are respected in previews and full-image links.
- Presets do not add cropping or stretching to satisfy width or height bounds.
- Captions follow the displayed image width.
- View full image opens the approved composition at full resolution in a new tab,
  with visible new-tab wording and an accessible link label.
- Cover images remain independent of screenshot presets.

Validation and acceptance:
- Schema validation passed with zero errors and warnings.
- Schema extraction and type generation succeeded.
- Lint, TypeScript, whitespace checks and production build passed.
- Installed image-builder checks passed for uncropped and intentionally cropped
  preview/full-image URLs, including an image with hotspot metadata.
- The user accepted the real RAG page presentation and reported Auto, Compact
  and Standard working well.
- The full-image link opened in a new tab.
- After the saved-crop correction, the user reviewed the running site and
  confirmed the behavior passed.

Validation limits:
- Dedicated portrait-image and screenshot-gallery browser coverage has not
  been separately confirmed for the new shared sizing implementation.
- Exhaustive preset-by-orientation, keyboard, mobile and cross-browser coverage
  is not claimed by this checkpoint.
- No temporary CMS records were created to fill unavailable test cases.
- Previously documented validation limits remain unless explicitly superseded.

Project refinement checkpoint completed and pushed:
a6edbcccfbadea0fda9e1f36f7bfcfb4c7e90ba4 - refine-project-case-study-and-screenshot-sizing

Follow-up:
- Blog body image sizing was subsequently implemented and accepted below.
- Remaining Phase 13 content and real-content validation are still pending.
- CMS publications and asset changes are separate from Git commits.

## Phase 13 - Blog body image sizing

Blog body images reuse the accepted Project screenshot renderer:
- Auto, Compact, Standard and Wide control proportional display sizing.
- Empty displaySize continues to behave as Auto.
- Saved Sanity crop settings are respected without additional preset cropping.
- Captions follow the displayed image width.
- View full image opens the same approved composition in a new tab.
- Blog covers retain their existing independent treatment.
- Blog typography and reading-column styling are preserved.
- Project screenshot behavior and Project text styling remain unchanged.

Implementation:
- RichText separates screenshot rendering from Project-only prose styling.
- Blog width rules exclude images managed by the shared screenshot renderer.
- The existing displaySize field is reused; only its help text changed.
- Schema extraction completed without a generated schema diff.
- No query, dependency, stored field type or CMS-content changes were needed.

Validation and acceptance:
- Schema validation, lint, TypeScript, whitespace checks and build passed.
- A temporary development-only page used the actual Blog styles and renderer.
- The user checked Auto, Compact, Standard and Wide on desktop and mobile.
- Images remained proportional and within the layout.
- Captions followed image width; Blog text and cover styling were unchanged.
- Full-image links opened the cropped composition in a new tab.
- Keyboard Tab and Enter behavior passed.
- The real RAG project retained its accepted presentation.
- The user accepted the Blog image extension and authorized cleanup and commit.
- The temporary test page was removed before checkpoint creation.
- No temporary Sanity documents were created or published.

Validation limits:
- Portrait and wide test shapes were intentional crops of an existing screenshot,
  not independent full-length portrait and panoramic source images.
- These checks do not establish readability for every future technical image.
- Representative published Blog content and broader real-content checks remain
  part of Phase 13. Earlier limits remain unless explicitly superseded.

## Phase 13 - Projects archive card refinement

The user accepted the shared ProjectCard Featured/Listing separation after
reviewing the real pages and a local representative-card test page.

Presentation:
- Homepage Featured cards retain their existing presentation.
- The Projects archive uses compact horizontal Listing cards.
- The archive has one column below 64rem and two columns from 64rem upward.
- Titles remain fully visible without line clamping or fixed card heights.
- Below 40rem, listings show the thumbnail, category and title.
- From 40rem, summaries show at most two visible lines.
- Listings show up to three technologies and a +N indicator for additional items.
- Thumbnail framing remains 16:10.
- Flex wrapping allows a small thumbnail above the text when space is insufficient.
- Missing images and summaries do not leave placeholder areas.
- Existing whole-card links, focus behavior and restrained hover treatment remain.
- Existing category filters and result counts are retained.
- No pagination, Load More, infinite scroll or additional filters were introduced.
- No CMS schema, query, dependency, global token, case-study or Blog image changes.

Reported browser acceptance:
- Homepage Featured Projects remained visually unchanged.
- Archive presentation worked at desktop, tablet and narrow mobile widths.
- Long titles remained visible.
- Missing-image and missing-summary examples behaved correctly.
- Technology limiting and +N behavior matched expectations.
- No horizontal overflow was observed at 200% zoom.
- The user accepted the refinement and authorized closeout.

Representative validation:
- A development-only page displayed 24 in-memory examples derived from an
  existing published project, including eight repeated content cases.
- No temporary Sanity records were created or published.
- Test links intentionally reused the original project's detail URL.
- The temporary review page was removed before checkpoint creation.

Validation limits:
- Repeated examples test layout density, not a database of 24 unique projects.
- This does not establish performance for every future image/content combination.
- Comprehensive cross-browser and assistive-technology coverage is not claimed.
- Previously documented validation limits remain unless explicitly superseded.

The archive refinement was followed by the Phase 13 content closeout below.

## Phase 13 - Real content acceptance and closeout

Phase 13 real-content work is accepted following the published-content review,
successful local automated checks and the user's six-page browser acceptance.
This closes the content phase; it does not declare Version 1 launched.

Accepted V1 content:
- Profile introduction, bio, portrait, education and professional links.
- Public contact email: saadkabeer.ai@gmail.com. The earlier typo was corrected.
- Facebook was removed at the user's request.
- AI/ML Engineer Intern at Arch Technologies and Computer Science Teacher
  at Adson International School are published and accepted.
- Selected certifications:
  - InnoQuest Bootcamp in Artificial Intelligence and Machine Learning,
    InnoVista Pvt Limited.
  - Python for Data Science, AI & Development, IBM.
  - AI for Everyone, DeepLearning.AI.
- The user confirmed certification dates came from the certificates and
  verified the available IBM and DeepLearning.AI credential links.
- The user confirmed public LinkedIn and Hugging Face links work.
- One published RAG Document Q&A case study is sufficient for V1.
- RAG content distinguishes observed factual tests from overall accuracy
  and states the temporary deployment and evaluation limitations.
- Blog has no published articles and retains its accepted empty state.
- Resume remains absent and its links remain hidden for V1.
- Skills remain available on About and linked records. No featured skills
  are selected, so the homepage Skills section is intentionally omitted.
- Additional projects and articles are deferred until after V1 launch.

Validation:
- Published review found one profile, two experiences, three certifications,
  one project, one project category, ten skills and zero blog posts.
- Reviewed content and image-asset references resolved successfully.
- No obvious missing required content or stale test content was found.
- Local schema-definition validation passed with zero errors and warnings.
- Lint, TypeScript, whitespace checks and production build passed.
- Home, About, Experience, Contact, Projects and Blog returned HTTP 200.
- The user accepted the brief six-page local browser review.
- RAG detail returned HTTP 200 with the expected title, description,
  canonical URL and Open Graph title and URL.
- The first title assertion compared raw HTML and falsely rejected &amp;.
  Decoding confirmed the correct Q&A title; no website fix was needed.
- Local sitemap returned exactly the six main public URLs and the RAG
  detail URL under https://saadkabeer.online, without extra or duplicate URLs.
- Before this documentation change, local main and GitHub main matched
  259326536145b7dc419fc195623190cdfe73559e with a clean working tree.
- This closeout changes documentation only. CMS content is stored separately
  from Git and is not backed up by this commit.

Limits and remaining roadmap:
- These are local and published-CMS checks, not deployed production QA.
- Schema-definition validation is not a comprehensive document-validation audit.
- Certificate authenticity and link checks rely on the stated evidence and
  user confirmations; no independent issuer audit is claimed.
- Earlier accepted layouts and image systems were not reopened.
- Historical validation limits remain unless explicitly superseded.
- Recorded dependency findings still require review before launch.
- Phase 14: Vercel deployment, environment setup and temporary-URL checks.
  Do not change Hostinger DNS in Phase 14.
- Phase 15: Hostinger custom-domain integration after Vercel is stable.
- Phase 16: Final production QA, including CMS publishing, indexing,
  security, accessibility, performance, domain, HTTPS and launch acceptance.
- Version 1 is complete only after Phase 16.

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

Historical Phase 5 validation limits:
- Project cover-image delivery subsequently passed in Phase 6, and blog
  cover-image delivery passed in Phase 8.
- About Resume PDF delivery subsequently passed in Phase 9. The populated
  homepage LinkedIn CTA was not separately recorded as browser-tested.
- Multi-record grid stress cases and comprehensive accessibility checks
  remain for later validation.
- The earlier isolated CMS failure test checked fetch behavior; the
  homepage outage presentation was source-reviewed, not browser-injected.
- Observed CMS refreshes do not establish an exact cache-timing guarantee.

All six main pages are enabled in navigation.
Phases 1 through 13 are complete. Phase 14 - Vercel Deployment is next and has not started.
V1 content is accepted. Vercel deployment, Hostinger domain integration and final production QA remain in Phases 14, 15 and 16 respectively.
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
project, category and skill were deleted. Phase 7 completed and pushed:
443dae70f01598d6521bb5023469826a769d55f3 - project-case-study-pages

Local and remote commits matched and the working tree was clean at that
checkpoint.

## Recovery and maintenance

GitHub is the recovery source. Clone the repository, install with npm ci,
restore local environment configuration and run the documented commands.
The website does not depend on continued access to Astra.

Retain only verified changes:
fix locally, validate, review the diff, commit the stable phase, then push.
Never commit experimental dependency attempts or secrets.
