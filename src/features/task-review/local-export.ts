import { reviewedTasksSchema, type ReviewedTask } from "./review";
export type AnalysisSource = "sample" | "gemini";
export function formatReviewedTasks(tasks: ReviewedTask[], source: AnalysisSource): string {
 const valid=reviewedTasksSchema.parse(tasks);
 const lines=["Reviewed tasks",source==="sample"?"Fictional sample — reviewed locally; no AI request.":"AI suggestions reviewed and edited by a human.",""];
 valid.forEach((task,index)=>{lines.push((index+1)+". "+task.title);if(task.description)lines.push(task.description);lines.push("Owner: "+(task.owner??"Not identified"),"Priority: "+(task.priority??"Not identified"),"Deadline: "+(task.deadline??"Not identified"),"");});
 return lines.join("\n").trimEnd()+"\n";
}
export function serializeReviewedTasks(tasks: ReviewedTask[], source: AnalysisSource): string { return JSON.stringify({source,reviewed:true,tasks:reviewedTasksSchema.parse(tasks)},null,2); }
