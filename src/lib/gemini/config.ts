import { AnalysisError } from "../analysis-error";
const allowedModels = new Set(["gemini-2.5-flash", "gemini-2.5-flash-lite"]);
export function getGeminiConfig() {
  if (process.env.MEETING_ANALYSIS_ENABLED !== "true")
    throw new AnalysisError(
      "ANALYSIS_DISABLED",
      "Meeting analysis is disabled. Enable it locally using the README, or preview the sample result.",
      503,
    );
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey)
    throw new AnalysisError(
      "NOT_CONFIGURED",
      "Gemini needs a free-tier API key on the server. Follow the README setup or preview the sample result.",
      503,
    );
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!allowedModels.has(model))
    throw new AnalysisError(
      "INVALID_CONFIGURATION",
      "The configured model is not supported. Use a free-tier model listed in the README.",
      503,
    );
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || "45000");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 90000)
    throw new AnalysisError(
      "INVALID_CONFIGURATION",
      "The analysis timeout configuration is invalid. Check the README.",
      503,
    );
  return { apiKey, model, timeoutMs };
}
export function isAnalysisAvailable() {
  try {
    getGeminiConfig();
    return true;
  } catch {
    return false;
  }
}
