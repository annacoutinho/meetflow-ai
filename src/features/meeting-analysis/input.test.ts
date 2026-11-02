import { expect, it } from "vitest";
import { validateTranscript } from "./input";
it("normalizes pasted BOM and Windows line endings without losing content", () => {
  expect(
    validateTranscript("\uFEFF  Maya: Review the plan.\r\nLeo: Agreed.  "),
  ).toEqual({
    success: true,
    transcript: "Maya: Review the plan.\nLeo: Agreed.",
  });
});

import { readTranscriptFile } from "./input";
it.each(["", "   ", null, 4, "Text\u0000binary"])(
  "rejects invalid transcript %s",
  (value) => {
    expect(validateTranscript(value).success).toBe(false);
  },
);
it("rejects excessive transcript length", () => {
  expect(validateTranscript("a".repeat(20001)).success).toBe(false);
});
it("accepts text at the exact size limit", () => {
  expect(validateTranscript("a".repeat(20000)).success).toBe(true);
});
it("reads UTF-8 text files and normalizes Windows line endings", async () => {
  await expect(
    readTranscriptFile(
      new File(["Maya: Review.\r\nLeo: Agreed."], "meeting.txt"),
    ),
  ).resolves.toBe("Maya: Review.\nLeo: Agreed.");
});
it("rejects non-text extensions", async () => {
  await expect(
    readTranscriptFile(new File(["meeting"], "meeting.pdf")),
  ).rejects.toThrow(".txt");
});
it("rejects oversized files before decoding", async () => {
  await expect(
    readTranscriptFile(new File([new Uint8Array(80001)], "meeting.txt")),
  ).rejects.toThrow("80 KB");
});
it("rejects invalid UTF-8 instead of silently changing content", async () => {
  await expect(
    readTranscriptFile(
      new File([new Uint8Array([255, 254, 255])], "meeting.txt"),
    ),
  ).rejects.toThrow("UTF-8");
});
it("rejects empty files", async () => {
  await expect(readTranscriptFile(new File([], "meeting.txt"))).rejects.toThrow(
    "Add a transcript",
  );
});
