# MeetFlow AI — Human review and execution

Status: implementation authorized by the user's attached continuation brief (2026-11-02). The approved scope is the user's brief; these technical choices use the autonomy granted there. Keep existing branch codex/meetflow-mvp as explicitly requested, overriding the generic branch-per-phase convention for this phase. All work stays local. No push, deploy, billing, paid API or external task creation by the agent.

## Objective

Evolve the existing 48-test MVP into Meeting → Intelligence → Human Review → Execution. Preserve analysis, input/upload, themes, sample, error handling and original Markdown/JSON/clipboard exports. Add human editing/selection of action items and portable reviewed-task output.

## Scope / acceptance

1. Gemini remains server-side, structured JSON/Zod and untrusted-input prompt. Key may only be stored in ignored .env.local. Inspect only known key availability, never enumerate/log secrets. If available securely, use only the fictional transcript for one real verification; otherwise explicitly mark NOT TESTED and provide manual steps. Inspection found no .env.local and no Gemini key in the task environment; do not obtain a key elsewhere.
2. Home copy: From meetings to execution. A discreet Transcript → Analysis → Review → Export indicator describes the actual flow without a complex wizard.
3. Review Tasks starts with every proposal unselected. Users can select/unselect, edit title/description/owner/priority/deadline and remove a draft. Unknown metadata stays null; human edits never mutate the original AI analysis. New analysis/example resets the review, even when text/results are identical. Reset restores all detected proposals with selection off. No item is externally created automatically.
4. Review uses a strict ReviewedTask schema, stable IDs within one analysis, max 50 tasks, text limits consistent with analysis. Only valid selected drafts are copied/exported; show actionable error and retain drafts on invalid title/limits. Empty and no-selection states explicit. Inputs/checkboxes/buttons labeled and keyboard usable. Missing optional values normalize to null; do not guess dates or convert relative deadlines.
5. Copy Tasks produces readable selected/edited tasks for pasting into Trello/Azure/Jira/Slack/Teams. Download Reviewed Tasks JSON contains only selected edited tasks, with sample provenance when appropriate. Preserve all existing analysis-level exports unchanged and label them as original AI output to distinguish review edits. Exporting locally is an explicit action, separate from selection/editing.
6. TASK_REVIEW_ENABLED=false in the shipped example/default. Final ticket may activate only the local review flag in ignored .env.local for browser verification; Gemini remains off without a key. Reversal sets review flag false and restarts, leaving existing analysis working. No production action.
7. A small TaskExporter interface supports confirmed exports of ReviewedTask arrays with explicit created/failed/uncertain/not-sent outcomes. No registry/plugin system or speculative Azure implementation.
8. Trello status PREPARED: implement a server-only adapter with board/list discovery and confirmed card creation, tested with fetch mocks, not connected to a browser button/API route in this phase because credentials are absent and live destination selection/duplicate-safe operation deserves a later small ticket. TRELLO_EXPORT_ENABLED=false by default; key/token only env. Reject unconfirmed exports, invalid IDs/duplicates/oversized batches before network. Fixed HTTPS host; OAuth header credentials, never query strings, redirect refused, bounded response/timeout, no automatic retries. Map owner/priority/deadline into card description; do not guess member IDs, labels or absolute dates. Stop after failure; distinguish uncertain writes and not-sent remaining tasks, warn to inspect board before retry. No live cards created or claimed. Board/list chooser and UI confirmation remain roadmap.
9. Azure DevOps PREPARED AT CONTRACT LEVEL ONLY: reusable ReviewedTask/TaskExporter types and local paste format; no adapter/API/PAT or work items. Jira future. README must distinguish these states.
10. Investigate capture architecture briefly using primary sources. Recommend remaining transcript-first now; future explicit-consent desktop capture + local STT + transcript review before Gemini. Discuss browser audio/gesture/OS limits, Electron/Tauri trade-offs, official meeting APIs/permissions, Whisper equivalent. No capture/recording packages, background recording, model downloads or platform integration now.
11. Update English README sections, Mermaid current vs roadmap, privacy, setup, env flags, validation, manual actions and screenshots reflecting review. Keep sample fictional, no fabricated live validation or future features presented as done.

## Technical decisions / tests

Keep existing Next.js/React/Tailwind/Zod/Vitest stack and APIs. Review module has pure draft-state transformations and validation at the public interface; UI owns in-memory state. Original analysis immutable, exports remain original. No DB/persistence or N+1/index work. Trello discovery is one request per collection; create is bounded sequential writes (not a read-query N+1) to preserve stop-on-first-error/partial results. Nothing calls adapter unless a later server integration invokes it.

Test seams under authorized autonomy: draft initialization/edit/selection/removal/reset/validation, local task serialization, exporter confirmation and external fetch boundary. Preserve all 48 existing tests. TDD one behavior at a time: red before implementation, then regressions. UI/CSS/docs use browser/visual checks rather than CSS mirror tests. Review Standards/Spec independently before local commits using staged diff against a pinned base.

## API / contracts

No change to POST /api/analyze or MeetingAnalysis. Add internal ReviewedTask and TaskExporter contracts only; no exposed Trello endpoints. Reviewed task: id, title, description, owner|null, priority low|medium|high|null, deadline|null. Draft additionally selected:boolean. Adapter takes explicit confirmation; local exported envelope includes source (sample/gemini), reviewed:true and tasks. Editing is human input, not attributed to Gemini.

## Risks / activation / reversal

Human-edited tasks can differ from source; label original AI analysis vs reviewed output. No persistence means refresh clears review. Gemini can hallucinate; existing schema/prompt do not guarantee factual accuracy. Free-tier eligibility/billing cannot be verified from a key. Trello writes may succeed even if response is lost; adapter exposes uncertain outcome and never retries. Adapter remains disconnected and disabled until separately configured/reviewed. Restore TASK_REVIEW_ENABLED=false to hide review; old workflow unchanged.

## Exclusions

No auth/users/database/history/audio/desktop app, no paid transcription, no Azure/Jira implementation, no Trello UI/API or real account writes without human confirmation. No upgrades/refactors without a concrete need. Live Gemini and Trello verification may remain credential-dependent and must be reported as such.
