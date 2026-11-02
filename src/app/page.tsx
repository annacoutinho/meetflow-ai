import { Workspace } from "@/features/meeting-analysis/workspace";
import { isAnalysisAvailable } from "@/lib/gemini/config";
export const dynamic = "force-dynamic";
export default function Home() {
  return <Workspace available={isAnalysisAvailable()} />;
}
