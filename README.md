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

- app/: minimal website foundation and embedded Studio route
- sanity/schemaTypes/: modular documents and shared content types
- sanity/structure.ts: Studio navigation and profile singleton entry
- sanity/constants.ts: authoritative profile document ID
- sanity/env.ts: public CMS configuration
- sanity/lib/: initializer-generated helpers; data-access design is Phase 3
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

## Current phase

Phase 2 completed and pushed:
c8d972a99907826718c2ba0a6b6a0da9a83e90ea - sanity-schema-setup

Phase 3 - CMS Data Access Layer: implementation and production build passed;
source and documentation review passed; Git checkpoint pending.

Verified: nine-query TypeGen generation, lint, TypeScript, production build,
image URL behavior, live reads against the empty public dataset, missing
records, invalid slugs and simulated CMS failure handling.

The isolated failure test checked revalidation options, not actual cache
timing. Non-empty content rendering, Next.js cache behavior and image delivery
will be verified when the data layer is connected to pages.

No Phase 3 completion is claimed until the reviewed state is committed,
pushed and the working tree is clean.

Next: Phase 4, the locked Premium Editorial AI design system and site shell.
Existing dependency security findings remain documented above.

## Recovery and maintenance

GitHub is the recovery source. Clone the repository, install with npm ci,
restore local environment configuration and run the documented commands.
The website does not depend on continued access to Astra.

Retain only verified changes:
fix locally, validate, review the diff, commit the stable phase, then push.
Never commit experimental dependency attempts or secrets.
