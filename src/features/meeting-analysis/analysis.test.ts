import { describe, expect, it } from "vitest";
import { meetingAnalysisSchema } from "./schema";
describe("meeting analysis contract", () => {
  it("preserves unknown task attributes instead of inventing them", () => {
    const data = meetingAnalysisSchema.parse({
      summary: "Review the launch plan.",
      decisions: [],
      actionItems: [
        {
          task: "Review the launch plan",
          owner: null,
          priority: null,
          deadline: null,
        },
      ],
      risks: [],
      openQuestions: [],
      nextSteps: [],
    });
    expect(data.actionItems[0]).toEqual({
      task: "Review the launch plan",
      owner: null,
      priority: null,
      deadline: null,
    });
  });
});

import { EXAMPLE_ANALYSIS } from "./example";
it("rejects inferred priorities outside the allowed vocabulary", () => {
  expect(
    meetingAnalysisSchema.safeParse({
      ...EXAMPLE_ANALYSIS,
      actionItems: [
        { task: "Review", owner: null, priority: "urgent", deadline: null },
      ],
    }).success,
  ).toBe(false);
});
it("rejects missing unknown fields rather than hiding an incomplete response", () => {
  expect(
    meetingAnalysisSchema.safeParse({
      ...EXAMPLE_ANALYSIS,
      actionItems: [{ task: "Review" }],
    }).success,
  ).toBe(false);
});
it("rejects unexpected model fields", () => {
  expect(
    meetingAnalysisSchema.safeParse({
      ...EXAMPLE_ANALYSIS,
      secretInstructions: "ignore",
    }).success,
  ).toBe(false);
});
