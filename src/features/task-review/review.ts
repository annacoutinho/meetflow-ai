import { z } from "zod";
import type { MeetingAnalysis } from "@/features/meeting-analysis/schema";
const optionalText = z.string().trim().min(1).max(1500).nullable();
export const reviewedTaskSchema = z.strictObject({
 id: z.string().min(1).max(80), title: z.string().trim().min(1, "Give each selected task a title.").max(1500),
 description: z.string().trim().max(4000), owner: optionalText,
 priority: z.enum(["low", "medium", "high"]).nullable(), deadline: optionalText,
});
export type ReviewedTask = z.infer<typeof reviewedTaskSchema>;
export type TaskDraft = ReviewedTask & { selected: boolean };
export function createTaskDrafts(items: MeetingAnalysis["actionItems"]): TaskDraft[] {
 return items.map((item,index)=>({id:"task-"+(index+1),title:item.task,description:"",owner:item.owner,priority:item.priority,deadline:item.deadline,selected:false}));
}

export type TaskDraftPatch = Partial<Omit<TaskDraft,"id">>;
export function updateTaskDraft(drafts: TaskDraft[], id: string, patch: TaskDraftPatch): TaskDraft[] {
 const normalized={...patch};
 if (typeof normalized.owner === "string" && !normalized.owner.trim()) normalized.owner=null;
 if (typeof normalized.deadline === "string" && !normalized.deadline.trim()) normalized.deadline=null;
 return drafts.map(task=>task.id===id?{...task,...normalized}:task);
}
export function removeTaskDraft(drafts: TaskDraft[], id: string): TaskDraft[] { return drafts.filter(task=>task.id!==id); }
export function selectReviewedTasks(drafts: TaskDraft[]): ReviewedTask[] {
 return z.array(reviewedTaskSchema).max(50).parse(drafts.filter(task=>task.selected).map(({selected: _selected,...task})=>task));
}

export const reviewedTasksSchema = z.array(reviewedTaskSchema).min(1,"Select at least one task to export.").max(50)
 .refine(tasks=>new Set(tasks.map(task=>task.id)).size===tasks.length,"Task IDs must be unique.");
