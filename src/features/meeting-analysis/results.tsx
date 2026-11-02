import type { MeetingAnalysis } from "./schema";
import { Icon, type IconName } from "@/components/icon";
import type { ReactNode } from "react";

function Section({
  title,
  icon,
  count,
  wide,
  children,
}: {
  title: string;
  icon: IconName;
  count?: number;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={"panel result-section" + (wide ? " wide" : "")}
      aria-label={title}
    >
      <h3 className="section-title">
        <Icon name={icon} size={16} />
        {title}
        {count !== undefined && <span className="section-count">{count}</span>}
      </h3>
      {children}
    </section>
  );
}
function TextList({ items }: { items: string[] }) {
  return items.length ? (
    <ol className="numbered-list">
      {items.map((item, i) => (
        <li key={i}>
          <span className="list-number">{String(i + 1).padStart(2, "0")}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  ) : (
    <p className="empty">None identified in this transcript.</p>
  );
}
function Badge({ value }: { value: string | null }) {
  return (
    <span className={"badge " + (value || "")}>
      {value || "Not identified"}
    </span>
  );
}
export function AnalysisResults({
  analysis,
  sample,
}: {
  analysis: MeetingAnalysis;
  sample: boolean;
}) {
  const stats: { title: string; value: number; icon: IconName }[] = [
    { title: "Decisions", value: analysis.decisions.length, icon: "check" },
    { title: "Action items", value: analysis.actionItems.length, icon: "flag" },
    { title: "Risks", value: analysis.risks.length, icon: "risk" },
    {
      title: "Open questions",
      value: analysis.openQuestions.length,
      icon: "question",
    },
  ];
  return (
    <>
      <div className="result-heading">
        <div>
          <div className="eyebrow">THE BIG PICTURE</div>
          <h2>Meeting Analysis</h2>
          <p>
            A clearer view of what happened. A better idea of what comes next.
          </p>
        </div>
        <span className={"result-status" + (sample ? " sample" : "")}>
          <Icon name={sample ? "document" : "check"} size={12} />
          {sample ? "Sample result · No AI request" : "Analysis ready"}
        </span>
      </div>
      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.title}>
            <div>
              <p>{s.title}</p>
              <strong>{s.value}</strong>
            </div>
            <span className="stat-icon">
              <Icon name={s.icon} size={18} />
            </span>
          </div>
        ))}
      </div>
      <div className="result-content">
        <Section title="Summary" icon="document" wide>
          <p className="summary">{analysis.summary}</p>
        </Section>
        <Section
          title="Decisions"
          icon="check"
          count={analysis.decisions.length}
        >
          <TextList items={analysis.decisions.map((x) => x.description)} />
        </Section>
        <Section
          title="Open Questions"
          icon="question"
          count={analysis.openQuestions.length}
        >
          <TextList items={analysis.openQuestions.map((x) => x.question)} />
        </Section>
        <Section
          title="Action Items"
          icon="flag"
          count={analysis.actionItems.length}
          wide
        >
          {analysis.actionItems.length ? (
            <div className="tasks">
              {analysis.actionItems.map((item, i) => (
                <article className="task-card" key={i}>
                  <p className="task-title">{item.task}</p>
                  <div className="task-details">
                    <div className="task-detail">
                      <span>Owner</span>
                      {item.owner || "Not identified"}
                    </div>
                    <div className="task-detail">
                      <span>Priority</span>
                      <Badge value={item.priority} />
                    </div>
                    <div className="task-detail">
                      <span>Deadline</span>
                      {item.deadline || "Not identified"}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">No action items identified.</p>
          )}
        </Section>
        <Section title="Risks" icon="risk" count={analysis.risks.length}>
          {analysis.risks.length ? (
            analysis.risks.map((risk, i) => (
              <div className="risk-item" key={i}>
                <p>{risk.description}</p>
                <Badge value={risk.severity} />
              </div>
            ))
          ) : (
            <p className="empty">No risks identified.</p>
          )}
        </Section>
        <Section
          title="Next Steps"
          icon="arrow"
          count={analysis.nextSteps.length}
        >
          <TextList items={analysis.nextSteps.map((x) => x.description)} />
        </Section>
      </div>
      <p className="review-note">
        {sample
          ? "This prewritten example illustrates the interface; it was not generated by Gemini. "
          : "AI can miss context or make mistakes. "}
        Review details against the transcript before acting.
      </p>
    </>
  );
}
