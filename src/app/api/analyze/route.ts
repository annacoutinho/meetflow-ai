import { z } from "zod";
import { validateTranscript } from "@/features/meeting-analysis/input";
import { AnalysisError } from "@/lib/analysis-error";
import { analyzeMeeting } from "@/lib/gemini/analyze";
import { readLimitedText } from "@/lib/read-limited-text";
export const runtime = "nodejs";
const inputSchema = z.strictObject({ transcript: z.string() });
let active = false;
function json(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export async function POST(request: Request) {
  let ownsSlot = false;
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
      throw new AnalysisError(
        "ORIGIN_NOT_ALLOWED",
        "This request must come from the MeetFlow workspace.",
        403,
      );
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    )
      throw new AnalysisError(
        "UNSUPPORTED_CONTENT_TYPE",
        "Send the transcript as JSON.",
        415,
      );
    let raw: unknown;
    try {
      raw = JSON.parse(
        await readLimitedText(
          request.body,
          100_000,
          new AnalysisError(
            "INPUT_TOO_LARGE",
            "The request is too large. Use a transcript up to 20,000 characters.",
            413,
          ),
        ),
      );
    } catch (e) {
      if (e instanceof AnalysisError) throw e;
      throw new AnalysisError(
        "INVALID_JSON",
        "The request could not be read. Send a valid JSON transcript.",
        400,
      );
    }
    const input = inputSchema.safeParse(raw);
    if (!input.success)
      throw new AnalysisError(
        "INVALID_INPUT",
        "Provide a transcript as text with no extra fields.",
        400,
      );
    const validation = validateTranscript(input.data.transcript);
    if (!validation.success)
      throw new AnalysisError(
        input.data.transcript.length > 20_000
          ? "INPUT_TOO_LARGE"
          : "INVALID_INPUT",
        validation.message,
        input.data.transcript.length > 20_000 ? 413 : 400,
      );
    if (active)
      throw new AnalysisError(
        "ANALYSIS_BUSY",
        "Another meeting is being analyzed. Please wait and try again.",
        429,
      );
    active = true;
    ownsSlot = true;
    const analysis = await analyzeMeeting(validation.transcript);
    return json({ success: true, data: analysis }, 200);
  } catch (error) {
    const safe =
      error instanceof AnalysisError
        ? error
        : new AnalysisError(
            "INTERNAL_ERROR",
            "The meeting could not be analyzed. Please try again.",
            500,
          );
    return json(
      { success: false, error: { code: safe.code, message: safe.message } },
      safe.status,
    );
  } finally {
    if (ownsSlot) active = false;
  }
}
