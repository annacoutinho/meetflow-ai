import { expect, it } from "vitest";
import { toMarkdown } from "./export";
import { EXAMPLE_ANALYSIS } from "./example";
it("exports all meeting sections while preserving unknown task attributes", () => {
  const markdown = toMarkdown(EXAMPLE_ANALYSIS);
  expect(markdown).toContain("# Meeting Analysis");
  expect(markdown).toContain("## Action Items");
  expect(markdown).toContain("**Owner:** Not identified");
  expect(markdown).toContain("## Open Questions");
  expect(markdown).toContain("## Next Steps");
});

it("escapes model-supplied HTML and Markdown syntax as literal text", () => {
  const markdown = toMarkdown({
    ...EXAMPLE_ANALYSIS,
    summary: "<script>alert(1)</script> [link](https://example.com)",
  });
  expect(markdown).not.toContain("<script>");
  expect(markdown).toContain("&lt;script&gt;");
  expect(markdown).not.toContain("[link](https://example.com)");
});
it("makes empty result sections explicit", () => {
  const markdown = toMarkdown({
    summary: "No clear decisions were recorded.",
    decisions: [],
    actionItems: [],
    risks: [],
    openQuestions: [],
    nextSteps: [],
  });
  expect(markdown.match(/None identified\./g)).toHaveLength(5);
});
