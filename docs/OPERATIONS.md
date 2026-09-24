# Operations and recovery

Configuration below records the accepted V1 setup on 2026-09-23. It is not a live
account audit. Recheck relevant dashboard settings before a future migration.

## Local setup

Use Node.js 22.x; local validation used 22.18.0 and npm 10.9.3. The package has
no engines pin. Install the committed lockfile with `npm ci`, not a broad update.
Copy `.env.example` to `.env.local` only if the local file does not already exist.

| Public variable | Accepted configuration |
| --- | --- |
| NEXT_PUBLIC_SANITY_PROJECT_ID | smoxl14u |
| NEXT_PUBLIC_SANITY_DATASET | production |
| NEXT_PUBLIC_SANITY_API_VERSION | 2026-09-09 |

These values are public configuration. The dataset is public; no private API
token is required for current reads. Studio uses Sanity account sign-in.
Never put private material into a public dataset or NEXT_PUBLIC variables.

Commands from the repository root:

```sh
npm ci
npm run dev
# Production build and local serving:
npm run build
npm run start
```

Website: http://localhost:3000; Studio: http://localhost:3000/studio.
Stop a server occupying the port before starting another. Avoid building into
an actively used development output directory; restart after environment changes.

## Validation by change type

| Change | Appropriate checks |
| --- | --- |
| Documentation only | Source accuracy, links, scope and git diff --check; no application test claim |
| Application code | npm run lint, npm run build (includes TypeScript), affected browser flows |
| Schema/query | Schema validation, regenerate snapshot/types as relevant, build, affected Studio/content reads |
| Shared visuals/motion | Affected callers, desktop/mobile, keyboard, 200% zoom, reduced motion; performance if materially affected |
| Routing/metadata | Status codes, missing route behavior, canonical/social metadata, sitemap/robots |
| Deployment/domain | Production Ready, intended URL, HTTPS, redirects preserving paths, Studio access |

```sh
npx --no-install sanity schemas validate
# After schema changes:
npx --no-install sanity schemas extract --path sanity/schema.json --force
# After schema extraction or query changes:
npx --no-install sanity typegen generate
```

Commit generated outputs with their sources. Schema-definition validation is
not a comprehensive document audit. No automated test script is configured.
Use a non-production dataset for destructive/editor experiments; do not invent
one as already configured. Local and Preview currently use the production
configuration when set as above; Studio publishing can change the live site.

## Production services

| Service | Accepted role/configuration |
| --- | --- |
| GitHub | saad-khanzada/ai-ml-portfolio, production branch main |
| Vercel | ai-ml-portfolio; Next.js preset; repository root; npm ci; npm run build; default output; Node 22.x |
| Environment scopes | Three public Sanity variables configured for Production and Preview |
| Primary origin | https://saadkabeer.online; SITE_ORIGIN in lib/metadata.ts |
| Vercel alias | https://ai-ml-portfolio-swart.vercel.app |
| Sanity | AI ML Portfolio, public production dataset; embedded /studio |
| Hostinger | Domain/DNS; apex A 216.198.79.1, TTL 60 at acceptance |
| www | Existing CNAME to saadkabeer.online; Vercel HTTP 308 redirect to apex preserving path |

DNS targets are historical accepted values, not universal Vercel defaults. Use
current project-provided values if reconnecting. Preserve unrelated n8n and
email DNS records. No nameserver migration was performed. No Analytics, Speed
Insights or optional integration was required for launch.

CORS: localhost:3000 and the main Vercel origin were recorded with credentials
allowed. Custom-domain Studio access was owner-verified without CORS errors;
its current dashboard origin list was not independently exported. When needed,
use only the exact trusted origin (scheme + hostname + port), no /studio path
or wildcard, and allow credentials for authenticated Studio access.

All routes, including /studio and nested Studio routes, are configured to set
nosniff, strict-origin-when-cross-origin and X-Frame-Options: SAMEORIGIN.
Studio is used directly; cross-origin embedding in Sanity Dashboard is not
required. Review this framing policy before introducing Dashboard embedding.
X-Powered-By is disabled. Preview deployment responses receive noindex through
VERCEL_ENV; Studio also has noindex metadata.
Do not assume a publicly reachable Studio grants anonymous write permissions.

## Git workflow and delivery

Inspect `git status --short --branch` before editing. Keep existing user changes.
Use a task branch for implementation, review the diff, run relevant checks,
and commit a stable scoped change. Update affected documentation in that change.
Publishing/merging follows the owner's authorization. A main push can deploy;
confirm the intended commit is Production / Ready and smoke-check affected behavior.

To share a clean committed snapshot, first verify the commit and tracked files
contain no secrets. From a clean, reviewed checkout, a source ZIP can be made with:

```sh
git rev-parse HEAD
git archive --format=zip --prefix=ai-ml-portfolio/ --output=../portfolio-handover-COMMIT.zip HEAD
```

Replace COMMIT in the filename with the reported commit ID. This archives committed
tracked files only: it excludes uncommitted docs and ignored local secrets/build
outputs, but cannot remove a secret mistakenly tracked in Git. It includes no
Git history, CMS dataset export or remote assets. Do not zip the entire working
folder with node_modules, .next, .env.local, logs or account configuration.

## Recovery and private backups

Code recovery: clone the repository (or extract a verified source ZIP), restore
public environment configuration, run npm ci and validate/build. A source ZIP is
a checkpoint copy; keep a Git clone for history. Source availability alone does
not guarantee access to external services.

For a bad code deployment, identify the last verified production commit/deployment.
Use a reviewed Git revert or the platform's supported rollback workflow after
checking current controls. Verify the intended production URL afterward. Do not
force-push/reset shared history or treat rollback as a CMS/DNS undo operation.

Maintain separately, under the owner's control:
- Sanity dataset/content and asset backups, plus a recorded backup date/location.
  No dataset export, asset backup or restore drill is verified by this handover.
  Use the installed Sanity CLI's export help/current official guidance when
  creating a backup. Verify archive contents/assets; test restoration into an
  isolated dataset before relying on it. Never test imports against production.
- A private platform recovery record: account ownership/access, current DNS zone,
  environment scopes and CORS settings. No full settings export is included here.
- Password-manager entries for credentials, recovery codes and any future tokens.
  Keep these out of Git, shared handovers and assistant prompts.

A code rollback cannot restore deleted CMS content, DNS records or account access.
Changes to schemas/content require a compatible data recovery plan as well.

## Maintenance and evidence limits

At launch, the supplied npm audit report retained seven moderate entries in the
UUID/typeid-js dependency chain (GHSA-w5hq-g745-h8pq); no high/critical findings
were reported. This is unresolved. Earlier inspection found TypeID v7 usage,
while the advisory concerns v3/v5/v6 output buffers: a limited exposure assessment,
not a safety guarantee. Reassess current advisories during dependency maintenance.
Do not run npm audit fix --force: the recorded proposal was a breaking Sanity
downgrade. Existing adm-zip/framework overrides and their historical rationale
remain in package.json and README. Audit disappearance alone did not prove the
previous ZIP symlink issue fixed. This handover runs no new dependency audit.

README retains the exact launch evidence and historical limits. CMS publish/restore,
keyboard/zoom, desktop/mobile and authenticated Studio checks rely on owner reports.
Homepage and RAG Mobile Lighthouse runs scored 99 performance and 100 in the other
three categories; these are two lab runs, not real-user or all-page guarantees.
Targeted headers/HTTP checks are not a penetration test; accessibility checks are
not comprehensive assistive-technology coverage. No search ranking/indexing
promise is made. Repeat checks for changed behavior, not to recreate every phase.

## Next.js 16.3.6 maintenance

Local verification recorded on 2026-09-23, before commit and deployment:

- Baseline: 863d336278364de454d1f9362635679ebebb5855.
- Updated next and eslint-config-next from 16.3.4 to exact version 16.3.6.
- Lockfile review found only matching Next.js package updates.
- React/React DOM, Sanity and existing overrides were unchanged.
- npm run lint and npm run build passed, including build-time TypeScript checks.
- The owner confirmed local production browser checks passed for the homepage,
  RAG detail and embedded Studio.
- No new npm audit result is claimed by this maintenance record.
- The unresolved UUID finding and prior validation limits remain applicable.
- Commit, push and Vercel Production verification were pending when this
  local record was written; local success does not establish deployment.
- No application source, design, CMS content, DNS or platform settings changed.

## Studio framing protection maintenance

Local verification recorded on 2026-09-24, before commit and deployment:

- Baseline: 9070b4f6fe1a1cf1f409bc57f52e9afcc2f54f27.
- Removed the Studio exclusion from the existing SAMEORIGIN header rule.
- The owner confirmed direct Studio usage; Sanity Dashboard embedding is unused.
- Lint and production build passed, including build-time TypeScript checks.
- Local HTTP checks returned 200 and X-Frame-Options: SAMEORIGIN for /,
  /studio and /studio/structure.
- The owner confirmed Profile / Site Settings loaded in local Studio.
  No CMS content was edited or published.
- These checks verify response headers and direct editor access; they do not
  establish an independently tested cross-origin iframe blocking result.
- No dependencies, schemas, CORS settings, DNS or platform settings changed.
- Commit, push and production verification were pending when this local
  record was written. Earlier README framing exclusions are historical.
