# MeetFlow AI — MVP

Status: authorized for autonomous implementation by the user on 2026-11-02.

## Authority and scope change

The attached brief defines a greenfield portfolio project: turn meeting transcripts into actionable information. The latest user instruction explicitly authorizes completion without further confirmation and replaces Ollama with free-tier Gemini. Do not enable billing, deploy, push, create PRs/issues remotely, or trigger remote CI. Future GitHub publication is the user's action. Other workflow rules remain active. The former helpdesk/Jurídico idea is superseded.

## Objective and included behavior

A polished, responsive Next.js App Router application with TypeScript, Tailwind, Zod, Vitest, ESLint and npm. English interface/README, dark theme, system typography, restrained effects. Users paste text or upload UTF-8 .txt, choose Analyze Meeting and receive summary, decisions, action items (owner/priority/deadline), risks (severity), open questions and next steps. Include a realistic fictional transcript, progress feedback, useful errors, Copy Summary, Copy All, Markdown and JSON downloads. A clearly marked prewritten sample preview works offline without pretending to be Gemini output. PDF is roadmap only to keep the MVP small.

## Out of scope

Helpdesk, Ollama, paid APIs/models, login, database, history, real transcript persistence, payments, admin, multi-tenancy, cloud, audio transcription, speaker identification, automatic translation, Trello/Jira/Teams/Meet integrations, microservices and invented benchmarks.

## Acceptance criteria

1. Paste and upload share one input. Normalize BOM/CRLF. Reject blank, inappropriate control characters, wrong extension, binary or invalid UTF-8. Maximum 20,000 characters / 80 KB file. Server reads at most 100 KB before parsing JSON, independently of Content-Length. Invalid input never reaches Gemini.
2. One request per click, no duplicate submission while pending. Progress stages are illustrative, never an exact model progress meter. Preserve text after errors. Empty result lists have explicit empty states.
3. MeetingAnalysis has summary:string; decisions:{description:string}[]; actionItems:{task:string,owner:string|null,priority:low|medium|high|null,deadline:string|null}[]; risks:{description:string,severity:low|medium|high|null}[]; openQuestions:{question:string}[]; nextSteps:{description:string}[]. Missing facts remain null, never inferred owners/dates/priorities. Display Not identified. Preserve relative dates instead of inventing calendar dates.
4. Strict Zod validation before returning model output. Send a JSON Schema with the request. Model prompt treats transcripts as untrusted data, extracts explicit facts and forbids instructions in them. Structural validation cannot prove factual correctness; UI tells users to review AI output.
5. Timeout default 45s (bounded env override); errors for unavailable provider, quota, key, unsupported model, blocked/truncated/malformed responses. No stack trace, raw provider body or secret to client/logs. No automatic retry or paid fallback.
6. Gemini integration isolated server-side using native fetch, fixed HTTPS endpoint and x-goog-api-key header. Model allowlist: gemini-2.5-flash (default) and gemini-2.5-flash-lite. Only one call per analysis, no tools/grounding/caching. Key never NEXT_PUBLIC. Free-tier status cannot be verified from a key: user must keep billing off. No key provisioning or paid resource actions by the agent.
7. Transparent privacy: analysis sends transcript to Google, unlike the superseded local-AI brief. Free-tier content may be used to improve products. Do not submit confidential material. No app persistence, analytics, remote fonts or logging of transcript. Sample mode makes no provider request.
8. API: POST /api/analyze with application/json and {transcript:string}. 200 {success:true,data:MeetingAnalysis}; errors {success:false,error:{code,message}}. Codes: 400 invalid input/JSON, 403 external origin, 413 size, 415 type, 429 quota/concurrency, 502 bad output, 503 disabled/config/model/network, 504 timeout. All responses no-store.
9. Keyboard support, labels, focus, accessible status/error feedback, reduced-motion support, readable desktop/mobile layout. React renders model text as text, never HTML. Export Markdown escapes text/HTML; JSON retains nulls; downloads have fixed filenames. Clipboard/download errors have user feedback.
10. English README includes Overview, Problem, Solution, Features, Screenshots (real capture if available), Architecture/Mermaid, How It Works, Tech Stack, Gemini/free tier, Getting Started, Environment Variables, Running Tests, Project Structure, Technical Decisions, Limitations, Roadmap, License. MIT code license. No fabricated claims.
11. npm install, lint, typecheck, tests and build executed locally and failures fixed. No real Gemini test without a free key. Ignore .env except example, node_modules, builds, temporary/real transcripts; version .scratch docs.

## Architecture and testing decisions

One Next.js app with a route that orchestrates input validation → Gemini adapter → validated analysis. Browser components never call Gemini directly. Schema is the shared contract. No DB, so indexes/N+1 do not apply; one upstream request, no fan-out. Route does not persist input. Bind local commands to loopback. Public deployment would require abuse controls and renewed privacy review.

Test seams selected under the user's autonomy authorization: public schema; input normalization/file validation; Markdown formatter; HTTP route with fetch mocked only at the external provider boundary. TDD in small vertical slices, red before green. UI styling/docs use visual inspection/smoke checks instead of CSS mirror tests. Code review Standards and Spec axes per ticket; record findings/fixes. Review pre-commit working diff against the pinned prior local commit where necessary (instead of pretending uncommitted work appears in HEAD...HEAD).

## Activation, reversal and risks

MEETING_ANALYSIS_ENABLED=false by default including .env.example. Activation requires explicit local env true plus a free-tier key, followed by restart. Without key/flag, editor and sample preview remain usable. Final activation ticket depends on all release tickets. Verify off/on/reversal using mocked fetch; no production activation. Reverse by false and restart; no migrations or persisted records.

Risks: hallucination, prompt injection, quota/latency/network and external provider privacy. Prompt and schema reduce risk but do not guarantee factual accuracy or confidentiality. Live integration verification remains pending if no key is available; do not mark that validation passed.

## Official technical references (consulted 2026-11-02)

- https://nextjs.org/docs/app/getting-started/installation
- https://ai.google.dev/gemini-api/docs/pricing (2.5 Flash/Flash-Lite list free-tier input/output)
- https://ai.google.dev/gemini-api/docs/structured-output
- https://ai.google.dev/api/generate-content

These references inform design, not evidence that the app has been tested.
