# Meeting Assistant — work in progress

The completed MVP is kept separately on main. This branch preserves unfinished work without presenting it as a completed feature.

## Included so far

- Local Markdown phase spec and dependency-ordered tickets.
- Reviewed task schema and immutable draft creation/edit/selection/removal helpers.
- Plain-text and JSON serialization for selected human-reviewed tasks.
- Unit tests for those boundaries; this is not a connected UI.

## Not finished

Review Tasks interface, full review/export product flow, Trello adapter, Azure integration, capture recommendation, final phase review/build/activation and retrospective. No external cards or work items were created. No Gemini key was supplied, so real Gemini validation remains NOT TESTED.

## Interruption

Implementation stopped when C: reached zero free bytes. The incident is recorded in .scratch/meeting-assistant/blocker.md. Publishing this branch is a separate user-authorized organization task, not a claim that this phase is complete. Follow the spec and tickets before resuming implementation.

## Repository organization

- main: completed MVP snapshot with the existing local history.
- codex/meetflow-mvp: original MVP branch.
- codex/meeting-assistant-wip: unfinished incremental work.

No .env.local, keys, tokens, node_modules or build outputs belong in Git. The latest user instruction explicitly authorizes this dedicated GitHub upload; earlier local-only defaults still apply to unrelated actions, CI and deployment.
