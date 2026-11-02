import { z } from "zod";
const text = z.string().trim().min(1).max(1500);
const level = z.enum(["low", "medium", "high"]).nullable();
export const meetingAnalysisSchema = z.strictObject({
  summary: z.string().trim().min(1).max(4000),
  decisions: z.array(z.strictObject({ description: text })).max(50),
  actionItems: z
    .array(
      z.strictObject({
        task: text,
        owner: text.nullable(),
        priority: level,
        deadline: text.nullable(),
      }),
    )
    .max(50),
  risks: z
    .array(z.strictObject({ description: text, severity: level }))
    .max(50),
  openQuestions: z.array(z.strictObject({ question: text })).max(50),
  nextSteps: z.array(z.strictObject({ description: text })).max(50),
});
export type MeetingAnalysis = z.infer<typeof meetingAnalysisSchema>;
