# Issue Tracker

**Tracker type:** GitHub Issues

**Repository:** [enguerran/CFA-Website](https://github.com/enguerran/CFA-Website)

## How skills use this

Skills that read and write issues (`to-tickets`, `to-spec`, `improve-codebase-architecture`) use the `gh` CLI to:

- **Create issues** via `gh issue create --title "..." --body "..." --label "..."`
- **List issues** via `gh issue list --label "..."`
- **Read issue details** via `gh issue view <number>`
- **Update labels** via `gh issue edit <number> --add-label "..."`

## Before you start

Make sure `gh` is installed and authenticated:

```bash
gh auth status
```

If not authenticated, run:

```bash
gh auth login
```

## PR surface

Issues are created in GitHub Issues only. **PRs are not used as a request surface for this repo** — all work is tracked as issues, and PRs are for implementation only.

---

## Workflow for agents

1. **to-tickets** reads issues labeled `ready-for-agent` and splits them into sub-tasks.
2. **implement** creates an issue if given a problem statement, or reads an existing `ready-for-agent` issue.
3. At the end of implementation, the agent commits and (optionally) opens a PR, which references the issue in the commit message or PR description.

---

## Manual issue creation

To create an issue manually:

```bash
gh issue create --title "Title" --body "Description" --label "ready-for-agent"
```

To list issues ready for implementation:

```bash
gh issue list --label "ready-for-agent"
```

To view a specific issue:

```bash
gh issue view <number>
```
