# Local activation and reversal

The shipped feature flag is off. Nothing in this procedure enables billing or deploys the app.

1. Use Node 24 LTS and run npm ci.
2. Preview with npm run dev and Preview sample result. No key is required.
3. For real analysis, create your own eligible Google AI Studio free-tier key in a project with billing OFF. The app cannot verify your account's billing status. If free access is unavailable, keep using the sample.
4. Copy .env.example to ignored .env.local, add GEMINI_API_KEY, keep GEMINI_MODEL=gemini-2.5-flash, set MEETING_ANALYSIS_ENABLED=true, then restart the local server.
5. Analyze only a fictional or non-sensitive transcript you explicitly choose to send to Google. Inspect the generated facts against the source.
6. Reverse by setting MEETING_ANALYSIS_ENABLED=false and restarting. Verify Analyze Meeting reports that analysis is disabled. No database, migrations or persisted transcripts need cleanup.

Automated verification uses an external-fetch mock: flag off → 503/no call, on → 200/one call, off again → 503/no second call. This verifies application control flow, not Google account eligibility or model quality. The real-provider smoke test is pending because no API key was supplied. No key was created, searched in other projects or printed.

No production activation, merge, push, remote CI or deploy is authorized by this procedure.
