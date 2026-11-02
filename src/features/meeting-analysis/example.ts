import type { MeetingAnalysis } from "./schema";
export const EXAMPLE_TRANSCRIPT = `Product launch sync — May 12, 2026
Maya: Let's keep the first release focused. We have decided to launch a read-only analytics dashboard and move custom reports to a later release.
Leo: I'll finish the accessibility audit by Wednesday. Mark that as high priority because it blocks the launch review.
Nina: I'll draft the release notes by next Monday. That's medium priority.
Maya: We also need to check the support handoff, but we haven't assigned an owner, priority or deadline yet.
Leo: The payment vendor may miss our integration window. We agreed this is a high-severity risk.
Nina: Do enterprise customers need SSO in the first release? That question is still open.
Maya: After the accessibility audit, our next step is to hold a launch readiness review. We will not set a launch date until that review.`;
export const EXAMPLE_ANALYSIS: MeetingAnalysis = {
  summary:
    "The team narrowed the first release to a read-only analytics dashboard, deferring custom reports. An accessibility audit and release notes are planned, while the support handoff still needs an owner. A vendor dependency and the SSO requirement need attention before launch readiness is reviewed.",
  decisions: [
    {
      description:
        "Launch a read-only analytics dashboard in the first release.",
    },
    { description: "Defer custom reports to a later release." },
    {
      description:
        "Set the launch date only after the launch readiness review.",
    },
  ],
  actionItems: [
    {
      task: "Complete the accessibility audit",
      owner: "Leo",
      priority: "high",
      deadline: "Wednesday",
    },
    {
      task: "Draft the release notes",
      owner: "Nina",
      priority: "medium",
      deadline: "Next Monday",
    },
    {
      task: "Check the support handoff",
      owner: null,
      priority: null,
      deadline: null,
    },
  ],
  risks: [
    {
      description: "The payment vendor may miss the integration window.",
      severity: "high",
    },
  ],
  openQuestions: [
    { question: "Do enterprise customers need SSO in the first release?" },
  ],
  nextSteps: [
    {
      description:
        "Hold a launch readiness review after the accessibility audit.",
    },
  ],
};
