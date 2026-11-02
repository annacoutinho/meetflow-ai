import { expect, it } from "vitest";
import { formatReviewedTasks, serializeReviewedTasks } from "./local-export";
import { createTaskDrafts, updateTaskDraft, selectReviewedTasks } from "./review";
import { EXAMPLE_ANALYSIS } from "@/features/meeting-analysis/example";
it("copies only selected, human-edited tasks with unknown facts explicit",()=>{
 const tasks=selectReviewedTasks(updateTaskDraft(createTaskDrafts(EXAMPLE_ANALYSIS.actionItems),"task-3",{selected:true,title:"Confirm support handoff",description:"Ask the support team."}));
 expect(formatReviewedTasks(tasks,"sample")).toContain("Confirm support handoff");
 expect(formatReviewedTasks(tasks,"sample")).toContain("Owner: Not identified");
 expect(formatReviewedTasks(tasks,"sample")).not.toContain("Complete the accessibility audit");
 const exported=JSON.parse(serializeReviewedTasks(tasks,"sample"));
 expect(exported).toEqual({source:"sample",reviewed:true,tasks:[{id:"task-3",title:"Confirm support handoff",description:"Ask the support team.",owner:null,priority:null,deadline:null}]});
});
