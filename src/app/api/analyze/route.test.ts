import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { POST } from "./route";
import { EXAMPLE_ANALYSIS } from "@/features/meeting-analysis/example";
beforeEach(() => {
  vi.stubEnv("MEETING_ANALYSIS_ENABLED", "true");
  vi.stubEnv("GEMINI_API_KEY", "test-key-not-a-real-secret");
  vi.stubEnv("GEMINI_MODEL", "gemini-2.5-flash");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function request(
  body: unknown = { transcript: "Maya: We decided to review the plan." },
) {
  return new Request("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
it("returns a validated analysis through the HTTP interface", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [
            {
              finishReason: "STOP",
              content: {
                parts: [{ text: JSON.stringify(EXAMPLE_ANALYSIS) }],
              },
            },
          ],
        }),
        { status: 200 },
      ),
    ),
  );
  const response = await POST(request());
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    success: true,
    data: EXAMPLE_ANALYSIS,
  });
});

function provider(payload: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(payload), { status })),
  );
}
function candidate(text: string, finishReason = "STOP") {
  return { candidates: [{ finishReason, content: { parts: [{ text }] } }] };
}
it("does not contact Gemini when the feature flag is off", async () => {
  vi.stubEnv("MEETING_ANALYSIS_ENABLED", "false");
  const boundary = vi.fn();
  vi.stubGlobal("fetch", boundary);
  const r = await POST(request());
  expect(r.status).toBe(503);
  expect((await r.json()).error.code).toBe("ANALYSIS_DISABLED");
  expect(boundary).not.toHaveBeenCalled();
});
it("explains missing server configuration", async () => {
  vi.stubEnv("GEMINI_API_KEY", "");
  const r = await POST(request());
  expect((await r.json()).error.code).toBe("NOT_CONFIGURED");
});
it("refuses unsupported models instead of silently selecting a paid model", async () => {
  vi.stubEnv("GEMINI_MODEL", "gemini-2.5-pro");
  const r = await POST(request());
  expect(r.status).toBe(503);
  expect((await r.json()).error.code).toBe("INVALID_CONFIGURATION");
});
it.each([
  null,
  { transcript: "" },
  { transcript: 4 },
  { transcript: "valid", extra: true },
])("rejects invalid input without a provider request: %j", async (body) => {
  const boundary = vi.fn();
  vi.stubGlobal("fetch", boundary);
  expect((await POST(request(body))).status).toBe(400);
  expect(boundary).not.toHaveBeenCalled();
});
it("limits transcript characters", async () => {
  expect((await POST(request({ transcript: "x".repeat(20001) }))).status).toBe(
    413,
  );
});
it("limits actual body bytes when Content-Length is absent", async () => {
  expect((await POST(request({ transcript: "x".repeat(100001) }))).status).toBe(
    413,
  );
});
it("rejects malformed request JSON", async () => {
  const r = await POST(
    new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }),
  );
  expect(r.status).toBe(400);
});
it("rejects cross-origin requests", async () => {
  const r = await POST(
    new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://untrusted.example",
      },
      body: '{"transcript":"hello"}',
    }),
  );
  expect(r.status).toBe(403);
});
it("rejects unsupported request content types", async () => {
  expect(
    (
      await POST(
        new Request("http://localhost:3000/api/analyze", {
          method: "POST",
          body: "hello",
        }),
      )
    ).status,
  ).toBe(415);
});
it.each([
  [429, "QUOTA_EXCEEDED", 429],
  [403, "KEY_REJECTED", 503],
  [401, "KEY_REJECTED", 503],
  [404, "MODEL_UNAVAILABLE", 503],
  [500, "PROVIDER_UNAVAILABLE", 503],
])("maps provider HTTP %i to a safe error", async (status, code, expected) => {
  provider({ error: "sensitive provider body" }, Number(status));
  const r = await POST(request());
  expect(r.status).toBe(expected);
  const body = await r.json();
  expect(body.error.code).toBe(code);
  expect(JSON.stringify(body)).not.toContain("sensitive provider body");
  expect(JSON.stringify(body)).not.toContain("test-key");
});
it("handles a network failure without returning stack traces", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockRejectedValue(new Error("private network detail")),
  );
  const r = await POST(request());
  expect(r.status).toBe(503);
  expect(JSON.stringify(await r.json())).not.toContain(
    "private network detail",
  );
});
it.each(["not JSON", '{"summary":"only one field"}'])(
  "rejects invalid model output: %s",
  async (text) => {
    provider(candidate(text));
    const r = await POST(request());
    expect(r.status).toBe(502);
    expect((await r.json()).error.code).toBe("INVALID_MODEL_RESPONSE");
  },
);
it("rejects truncated analysis even when its content is valid JSON", async () => {
  provider(candidate(JSON.stringify(EXAMPLE_ANALYSIS), "MAX_TOKENS"));
  expect((await POST(request())).status).toBe(502);
});
it("handles blocked generation", async () => {
  provider({ promptFeedback: { blockReason: "SAFETY" } });
  const r = await POST(request());
  expect((await r.json()).error.code).toBe("MODEL_BLOCKED");
});
it("bounds oversized model responses", async () => {
  provider(candidate("x".repeat(260000)));
  expect((await POST(request())).status).toBe(502);
});
it("times out and releases the analysis slot for a later request", async () => {
  vi.stubEnv("GEMINI_TIMEOUT_MS", "1000");
  vi.stubGlobal(
    "fetch",
    vi.fn(
      (_url: unknown, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          options.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
    ),
  );
  const r = await POST(request());
  expect(r.status).toBe(504);
  expect((await r.json()).error.code).toBe("ANALYSIS_TIMEOUT");
  provider(candidate(JSON.stringify(EXAMPLE_ANALYSIS)));
  expect((await POST(request())).status).toBe(200);
});
it("sets no-store on safe errors", async () => {
  expect(
    (await POST(request({ transcript: "" }))).headers.get("Cache-Control"),
  ).toBe("no-store");
});
