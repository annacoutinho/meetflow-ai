"use client";
import { useState } from "react";
import { Icon } from "@/components/icon";
import type { MeetingAnalysis } from "./schema";
import { toMarkdown } from "./export";
export function ExportToolbar({
  analysis,
  sample,
}: {
  analysis: MeetingAnalysis;
  sample: boolean;
}) {
  const [notice, setNotice] = useState("");
  const markdown =
    (sample ? "> Fictional sample result. No AI request was made.\n\n" : "") +
    toMarkdown(analysis);
  async function copy(all: boolean) {
    try {
      await navigator.clipboard.writeText(all ? markdown : analysis.summary);
      setNotice(all ? "Full analysis copied." : "Summary copied.");
    } catch {
      setNotice(
        "Clipboard is unavailable. Please use an export button instead.",
      );
    }
  }
  function download(format: "md" | "json") {
    try {
      const blob = new Blob(
        [format === "md" ? markdown : JSON.stringify(analysis, null, 2)],
        {
          type:
            format === "md"
              ? "text/markdown;charset=utf-8"
              : "application/json;charset=utf-8",
        },
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        (sample ? "meetflow-sample-analysis." : "meetflow-analysis.") + format;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(
        format === "md" ? "Markdown export prepared." : "JSON export prepared.",
      );
    } catch {
      setNotice(
        "The export could not be prepared. Please try copying the analysis.",
      );
    }
  }
  return (
    <>
      <div className="export-toolbar">
        <span>Keep the momentum going.</span>
        <button className="secondary-button" onClick={() => copy(false)}>
          <Icon name="copy" size={13} />
          Copy Summary
        </button>
        <button className="secondary-button" onClick={() => copy(true)}>
          <Icon name="copy" size={13} />
          Copy All
        </button>
        <button className="secondary-button" onClick={() => download("md")}>
          <Icon name="download" size={13} />
          Export Markdown
        </button>
        <button className="secondary-button" onClick={() => download("json")}>
          <Icon name="download" size={13} />
          Export JSON
        </button>
      </div>
      <p className="toast" role="status" aria-live="polite">
        {notice}
      </p>
    </>
  );
}
