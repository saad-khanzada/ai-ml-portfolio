# Portfolio handover — start here

Reviewed against V1 source commit `a305766c399fc25ea4999af5d8fe79a82f2be3f5`
on 2026-09-23. The owner confirmed its Vercel Production deployment was Ready.
This documentation is post-launch maintenance; the original 16 phases are closed.

Current dependency maintenance updates Next.js and eslint-config-next to
16.3.6. See [Operations](docs/OPERATIONS.md#nextjs-1636-maintenance)
for the verification record. The source checkpoint above records the original
handover review; exact current versions remain in the package files.

## Project and ownership

Saad Kabeer's AI/ML portfolio supports internships, junior roles, freelance work
and collaboration. The owner works primarily in AI/ML and is a beginner in web
development. Explain changes plainly, provide one practical step at a time, and
use Roman Urdu for guidance and English for website copy and documentation.

- Website: https://saadkabeer.online
- Studio: https://saadkabeer.online/studio
- Repository: https://github.com/saad-khanzada/ai-ml-portfolio
- Production branch: `main`; pushes can trigger automatic Vercel deployments.
- No chat assistant or paid AI subscription is required by the website runtime.

## Reading order

1. Read this file and [AGENTS.md](AGENTS.md).
2. Read [Architecture](docs/ARCHITECTURE.md) and inspect the source relevant to the task.
3. For visual work, read [Design system](docs/DESIGN_SYSTEM.md).
4. For setup, validation, deployment, recovery or dependencies, read
   [Operations](docs/OPERATIONS.md).
5. Consult [README](README.md) for detailed historical decisions and acceptance
   evidence. Earlier phase statements may describe superseded behavior.

These guides describe the reviewed baseline, not an automatic feed of live state.
The current source and lockfile establish implementation; the owner's current
request establishes authorized scope. If source, documentation or observed
behavior disagree, report the conflict before relying on an assumption.
Use `git rev-parse HEAD` and `git status --short --branch` to identify a checkout.
A ZIP filename should include the exact source commit; a ZIP has no Git history.

## Accepted V1 scope

Home, About, Projects, Experience, Blog and Contact are enabled. One published
RAG Document Q&A case study is sufficient. The launch content includes two
experiences and three selected certifications. Blog has an intentional empty
state; resume links remain hidden because no resume is supplied. No featured
skills are selected at launch, so that homepage section is intentionally absent.
CMS content can change independently of Git; these are launch facts, not a live
content inventory.

Preserve unrelated content, routes, working links, optional-content behavior,
image composition, accessibility and production configuration. Do not invent
project outcomes, certifications or filler articles. RAG factual checks are not
an overall accuracy claim. Its demo/evaluation limitations remain meaningful.

Redesigns, animations, features and dependency upgrades are possible when requested.
Accepted decisions are a baseline, not a permanent ban on change. Explain which
rules a requested redesign supersedes and update the relevant guide.
No additional phase is automatically added to the completed roadmap.

## Working agreement

- Inspect the relevant code before proposing implementation. Do not rely solely
  on model knowledge of Next.js APIs; follow the repository agent guidance.
- Keep changes scoped. Preserve existing uncommitted work; use a separate branch
  for code work and inspect the diff before committing.
- Choose checks for the affected behavior using Operations. Record what passed,
  what was not run and any remaining limits. Do not equate a build with browser QA.
- Update the affected guide with the code change. Keep history in README/Git;
  avoid copying the same explanation into several current guides.
- Publishing, merging, CMS mutations and production settings require authorization
  appropriate to the task. Do not assume a request to review authorizes deployment.
- Never include credentials, private tokens or account recovery information in
  commits, screenshots, shared ZIPs or prompts.

## Reusable request for another assistant or developer

> Read START_HERE.md and follow its reading order. My requested change is:
> [describe the change and attach relevant references]. Inspect the relevant
> implementation and summarize existing behavior, affected files and risks.
> Preserve unrelated functionality and accepted content. Implement within the
> authorized scope, validate affected flows, and update the relevant documentation.
> Distinguish verified results from assumptions. Report the diff before any
> commit or publication unless I have explicitly authorized those actions.

Provide repository access or a clean source ZIP, not these documents alone.
For UI work also supply relevant current desktop/mobile screenshots. If an AI
cannot access the whole repository, provide these guides first and then the
source files it needs. Tool support and context limits vary.
