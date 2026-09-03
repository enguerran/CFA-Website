# Domain Docs

**Layout:** Single-context

This is a single-context repo. All domain knowledge is centralized in one `CONTEXT.md` at the repo root, and ADRs (Architecture Decision Records) live in `docs/adr/`.

## CONTEXT.md — The glossary

`CONTEXT.md` is the single source of truth for this project's domain language:

- **Terminology:** precise definitions of terms used in the codebase (Event, Partner, Site config, etc.)
- **Data structures:** the shape of events, partners, and site configuration
- **Architectural decisions:** the rationale behind major choices (Eleventy, YAML, Nunjucks, etc.)
- **Constraints:** what's in scope, what's not, what decisions are load-bearing

**Consumer rules:**
- Always read `CONTEXT.md` at the start of a new task to understand the project's vocabulary.
- If a user mentions a term that conflicts with `CONTEXT.md`, challenge it: "Your glossary defines X as Y, but you seem to mean Z."
- Update `CONTEXT.md` inline as new terms are resolved or decisions are made.
- `CONTEXT.md` is **never** a spec, implementation guide, or code reference — it's a glossary only.

## docs/adr/ — Architecture Decision Records

ADRs record decisions that are:
1. **Hard to reverse** — changing your mind later has meaningful cost
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

**Current ADRs:** None yet (created as needed)

**Format:** Use the [ADR-FORMAT.md](../adr/ADR-FORMAT.md) template when creating new ones.

## docs/superpowers/plans/ — Implementation plans

The `docs/superpowers/plans/` directory holds implementation plans from the Matt Pocock skills (e.g., from `/to-spec` or `/to-tickets`). These are living documents that guide implementation.

**Do not** treat these as authoritative specs — they're working documents. The authoritative spec is always the latest `SPEC.md` (if one exists) or the combined view of `CONTEXT.md` + the plan.

## For agents

1. Start by reading `CONTEXT.md` to understand the project's vocabulary and constraints.
2. If you need to create a new term, propose it to the user and update `CONTEXT.md` together.
3. If you're making a decision that's hard to reverse, propose an ADR to `docs/adr/`.
4. Implementation plans in `docs/superpowers/plans/` are your working guide; follow them, but defer to `CONTEXT.md` if there's a conflict.
