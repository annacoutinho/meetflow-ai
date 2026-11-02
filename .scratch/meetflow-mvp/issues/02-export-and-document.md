# 02 — Export and document

Status: done
Triage: ready-for-agent
Blocked by: 01-analyze-meeting.md

## Objective / scope
Copy Summary/All, Markdown/JSON, feedback, README English, screenshot and MIT. PDF future only.

## Acceptance
Valid exports preserve nulls, Markdown escapes unsafe text; README documents real behavior, free-tier setup and limitations; no publishing.

## Verification
TDD Markdown; local smoke, lint/typecheck/tests/build; Standards and Spec review.

## Results / limitations
Completed. 46 tests passed; lint/typecheck/build passed. Standards 0 findings; Spec 0 findings. Clipboard success states and actual Markdown/JSON downloads verified in browser; JSON nulls and Markdown sample notice/content checked from downloaded files. Three real screenshots visually inspected. README and MIT included. PDF remains roadmap. See ../reviews/02.md. Gemini real verification still requires a free-tier key.
