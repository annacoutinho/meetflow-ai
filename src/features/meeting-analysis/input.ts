export const MAX_TRANSCRIPT_CHARS = 20_000;
export const MAX_FILE_BYTES = 80_000;
type InputResult =
  { success: true; transcript: string } | { success: false; message: string };
export function validateTranscript(value: unknown): InputResult {
  if (typeof value !== "string")
    return {
      success: false,
      message: "Please provide a meeting transcript as text.",
    };
  const transcript = value
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .trim();
  if (!transcript)
    return {
      success: false,
      message: "Add a transcript before analyzing your meeting.",
    };
  if (value.length > MAX_TRANSCRIPT_CHARS)
    return {
      success: false,
      message: "This transcript is too long. Use up to 20,000 characters.",
    };
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(transcript))
    return {
      success: false,
      message:
        "This transcript contains unsupported characters. Please use plain text.",
    };
  return { success: true, transcript };
}
export async function readTranscriptFile(file: File): Promise<string> {
  if (!file.name.toLowerCase().endsWith(".txt"))
    throw new Error("Choose a plain-text .txt file.");
  if (file.size > MAX_FILE_BYTES)
    throw new Error("This file is too large. Choose a .txt file up to 80 KB.");
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(
      await file.arrayBuffer(),
    );
  } catch {
    throw new Error(
      "This file could not be read. Save it as UTF-8 plain text and try again.",
    );
  }
  const result = validateTranscript(text);
  if (!result.success) throw new Error(result.message);
  return result.transcript;
}
