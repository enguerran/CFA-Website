# How to collaborate on CFA-Website

This file tells Claude (and agents) how to work effectively on this project.

---

## About this project

**CFA-Website** is the website for Comité des Fêtes d'Auzielle, a French village event committee.

**Current status:**
- HTML static site (vanilla HTML/CSS/JS)
- Migrated to **Eleventy + JSON** for easier content management

**Key decision:** Content (events, partners) lives in JSON files, not hard-coded HTML. Templates (Nunjucks) generate pages at build time.

See `CONTEXT.md` for the full glossary and architectural decisions.

---

## Before you start a task

1. **Read `CONTEXT.md`** to understand the project's vocabulary (Event, Partner, Eleventy, JSON schema, etc.)
2. **Read the relevant spec** (e.g., `SPEC.md` for the Eleventy migration)
3. **Check `docs/adr/`** for any hard decisions about why things are the way they are

---

## How to create or update issues

All work is tracked as **GitHub Issues**. Use `gh issue create` to create issues from the CLI:

```bash
gh issue create --title "Fix CSS for mobile" --body "..." --label "ready-for-agent"
```

See `docs/agents/issue-tracker.md` for details.

---

## Workflow: from idea to ship

Use **Matt Pocock's skills** for structured workflows:

1. **`/grill-with-docs`** — Interview and sharpen an idea; updates `CONTEXT.md` and ADRs
2. **`/to-spec`** — Turn a decision thread into a written specification
3. **`/to-tickets`** — Split a spec into GitHub issues (agent-ready)
4. **`/implement`** — Build a single ticket; runs TDD + code review internally
5. **`/code-review`** — Review a branch or PR against a spec

For this project, smaller tasks can skip straight to `/implement`. Use `/to-tickets` only for large features.

---

## Style & Conventions

### File structure
- **Source:** `src/pages/`, `src/_includes/`, `src/events/`, `src/assets/`
- **Events:** one Markdown file per event in `src/events/*.md` (frontmatter + prose body) — see `docs/adr/0001-events-as-markdown-files.md`
- **Data:** `src/_data/partners.json`, `src/_data/site.json`
- **Config:** `.eleventy.js`, `.eleventyignore`, `package.json`
- **Build output:** `_site/` (generated, not in Git)

### Code
- **Nunjucks templates** for rendering (no JSX, no complex logic)
- **Markdown for event content**, **JSON for partners/site data** (simple, easy to edit, native Eleventy support)
- **CSS unchanged** (vanilla, no frameworks)
- **JS unchanged** (vanilla, no build processing)

### Commits
- Keep commits focused on one task
- Reference the GitHub issue in commit messages: `git commit -m "feat: add Eleventy config (closes #1)"`
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`

### No breaking changes
- This is a static site for a small village event committee
- Users expect zero visual/UX changes during the Eleventy migration
- Test locally (`npm run dev`) before pushing to verify the site looks identical

---

## Domain vocabulary

Quick reference — see `CONTEXT.md` for full definitions:

- **Event** — one Markdown file (`title`, `image`, `tagline`, `helloasso`, `order` in frontmatter; description as Markdown body; optional `extra_*` fields)
- **Partner** (`id`, `name`, `image`, `description`, `url`)
- **Site** (`name`, `email`, social media, etc.)
- **Eleventy** — Static Site Generator (this is what generates the pages)
- **Nunjucks** — Templating language (used for `.njk` files)
- **Collection** — Eleventy concept: pages grouped by tag (`collections.events` from `src/events/*.md`)

---

## Deployment

- **Hosting:** Vercel (auto-deploys on `git push`)
- **Build command:** `npm run build` (generates `_site/`)
- **Dev server:** `npm run dev` (local testing)

Vercel automatically detects Eleventy and runs the build. No special config needed.

---

## Testing

**MVP acceptance criteria** (see `SPEC.md`):
- [ ] `npm run build` generates without errors
- [ ] `_site/index.html` contains all events and partners
- [ ] All event sub-pages exist and display correctly
- [ ] CSS, JS, and images are present and working
- [ ] `npm run dev` works and live-reloads
- [ ] Visual output is identical to the old HTML site

Manual testing in a browser is the primary validation method. Automated tests can be added later if needed.

---

## Questions?

- **Domain questions:** Read `CONTEXT.md` and the glossary section
- **Architecture questions:** See `SPEC.md` and `docs/adr/`
- **Implementation questions:** Check the relevant ticket or plan
- **General:** Ask the user!

---

## Agent skills configuration

See `docs/agents/` for configuration details:

- **Issue tracker:** GitHub Issues — see `docs/agents/issue-tracker.md`
- **Domain docs:** Single-context layout — see `docs/agents/domain.md`
