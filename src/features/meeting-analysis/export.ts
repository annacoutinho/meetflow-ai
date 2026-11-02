import type { MeetingAnalysis } from "./schema";
function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/([\\*_{}\[\]()#+\-.!|])/g, "\\$1")
    .replaceAll(String.fromCharCode(96), "\\" + String.fromCharCode(96))
    .replace(/\r?\n/g, " ");
}
export function toMarkdown(analysis: MeetingAnalysis): string {
  const lines: string[] = [
    "# Meeting Analysis",
    "",
    "## Summary",
    "",
    escapeText(analysis.summary),
    "",
  ];
  function section(title: string, items: string[]) {
    lines.push(
      "## " + title,
      "",
      ...(items.length
        ? items.map((item) => "- " + escapeText(item))
        : ["None identified."]),
      "",
    );
  }
  section(
    "Decisions",
    analysis.decisions.map((item) => item.description),
  );
  lines.push("## Action Items", "");
  if (!analysis.actionItems.length) lines.push("None identified.", "");
  for (const item of analysis.actionItems)
    lines.push(
      "### " + escapeText(item.task),
      "",
      "- **Owner:** " + escapeText(item.owner ?? "Not identified"),
      "- **Priority:** " + (item.priority ?? "Not identified"),
      "- **Deadline:** " + escapeText(item.deadline ?? "Not identified"),
      "",
    );
  lines.push("## Risks", "");
  if (!analysis.risks.length) lines.push("None identified.", "");
  for (const item of analysis.risks)
    lines.push(
      "- " +
        escapeText(item.description) +
        " — **Severity:** " +
        (item.severity ?? "Not identified"),
    );
  lines.push("");
  section(
    "Open Questions",
    analysis.openQuestions.map((item) => item.question),
  );
  section(
    "Next Steps",
    analysis.nextSteps.map((item) => item.description),
  );
  return lines.join("\n").trimEnd() + "\n";
}
