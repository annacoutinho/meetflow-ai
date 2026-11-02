import { expect, it } from "vitest";
import { createTaskDrafts } from "./review";
import { EXAMPLE_ANALYSIS } from "@/features/meeting-analysis/example";
it("starts AI suggestions unselected and preserves unknown attributes",()=>{const drafts=createTaskDrafts(EXAMPLE_ANALYSIS.actionItems);expect(drafts).toHaveLength(3);expect(drafts.every(task=>!task.selected)).toBe(true);expect(drafts[2]).toMatchObject({title:"Check the support handoff",description:"",owner:null,priority:null,deadline:null});});

import { updateTaskDraft, removeTaskDraft, selectReviewedTasks } from "./review";
it("edits and selects a task without mutating the AI result or previous draft",()=>{
 const original=createTaskDrafts(EXAMPLE_ANALYSIS.actionItems);
 const edited=updateTaskDraft(original,"task-1",{title:"Ship accessibility fixes",description:"Human-reviewed details",owner:"Anna",priority:"low",deadline:"Friday",selected:true});
 expect(selectReviewedTasks(edited)).toEqual([{id:"task-1",title:"Ship accessibility fixes",description:"Human-reviewed details",owner:"Anna",priority:"low",deadline:"Friday"}]);
 expect(original[0].title).toBe("Complete the accessibility audit");
 expect(EXAMPLE_ANALYSIS.actionItems[0].owner).toBe("Leo");
});

it("unselects tasks and removes proposals without exporting the remaining unselected ones",()=>{
 const selected=updateTaskDraft(createTaskDrafts(EXAMPLE_ANALYSIS.actionItems),"task-1",{selected:true});
 expect(selectReviewedTasks(updateTaskDraft(selected,"task-1",{selected:false}))).toEqual([]);
 expect(removeTaskDraft(selected,"task-1")).toHaveLength(2);
 expect(selectReviewedTasks(removeTaskDraft(selected,"task-1"))).toEqual([]);
});
it("resetting from the analysis discards edits and selection",()=>{
 const reset=createTaskDrafts(EXAMPLE_ANALYSIS.actionItems);expect(reset[0].selected).toBe(false);expect(reset[0].title).toBe("Complete the accessibility audit");
});
it("rejects an empty selected title but permits an unselected incomplete draft",()=>{
 const blank=updateTaskDraft(createTaskDrafts(EXAMPLE_ANALYSIS.actionItems),"task-1",{title:"  "});
 expect(selectReviewedTasks(blank)).toEqual([]);
 expect(()=>selectReviewedTasks(updateTaskDraft(blank,"task-1",{selected:true}))).toThrow("title");
});
it("normalizes cleared owner and deadline to null",()=>{
 const tasks=updateTaskDraft(createTaskDrafts(EXAMPLE_ANALYSIS.actionItems),"task-1",{selected:true,owner:" ",deadline:""});
 expect(selectReviewedTasks(tasks)[0]).toMatchObject({owner:null,deadline:null});
});
it("rejects oversized human descriptions and invalid priority values",()=>{
 const tasks=updateTaskDraft(createTaskDrafts(EXAMPLE_ANALYSIS.actionItems),"task-1",{selected:true,description:"a".repeat(4001)});
 expect(()=>selectReviewedTasks(tasks)).toThrow();
});
