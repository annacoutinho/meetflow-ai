"use client";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Icon } from "@/components/icon";
import { EXAMPLE_ANALYSIS, EXAMPLE_TRANSCRIPT } from "./example";
import { AnalysisResults } from "./results";
import { ExportToolbar } from "./export-toolbar";
import { meetingAnalysisSchema, type MeetingAnalysis } from "./schema";
import {
  MAX_TRANSCRIPT_CHARS,
  validateTranscript,
  readTranscriptFile,
} from "./input";

const stages = [
  "Reading transcript",
  "Identifying decisions",
  "Extracting action items",
  "Detecting risks",
  "Preparing results",
];
export function Workspace({ available }: { available: boolean }) {
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [sample, setSample] = useState(false);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [light, setLight] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
  }, [light]);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(
      () => setStage((s) => Math.min(s + 1, stages.length - 1)),
      5000,
    );
    return () => clearInterval(timer);
  }, [loading]);
  function replaceText(text: string) {
    setTranscript(text);
    setAnalysis(null);
    setError("");
    setFilename("");
    if (fileRef.current) fileRef.current.value = "";
  }
  function showSample() {
    replaceText(EXAMPLE_TRANSCRIPT);
    setAnalysis(EXAMPLE_ANALYSIS);
    setSample(true);
  }
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await readTranscriptFile(file);
      replaceText(text);
      setFilename(file.name);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "This file could not be read. Try a UTF-8 .txt file.",
      );
    } finally {
      event.target.value = "";
    }
  }
  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    const validation = validateTranscript(transcript);
    if (!validation.success) {
      setError(validation.message);
      return;
    }
    if (!available) {
      setError(
        "Gemini analysis is not enabled yet. Configure the server with a free-tier API key using the README, or preview the sample below.",
      );
      return;
    }
    setLoading(true);
    setStage(0);
    setAnalysis(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: validation.transcript }),
        signal: AbortSignal.timeout(95000),
      });
      const body = await response.json();
      if (!response.ok || body.success !== true)
        throw new Error(
          typeof body.error?.message === "string"
            ? body.error.message
            : "Analysis could not be completed. Please try again.",
        );
      const result = meetingAnalysisSchema.safeParse(body.data);
      if (!result.success)
        throw new Error(
          "The analysis response was not valid. Please try again.",
        );
      setAnalysis(result.data);
      setSample(false);
    } catch (e) {
      setError(
        e instanceof Error &&
          e.name !== "TimeoutError" &&
          e.name !== "TypeError"
          ? e.message
          : "The request could not complete. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (analysis)
      resultRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [analysis]);
  return (
    <div className="app">
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <aside className="sidebar">
        <a className="brand" href="#main" aria-label="MeetFlow AI home">
          <span className="brand-mark">
            <Icon name="spark" size={21} />
          </span>
          MeetFlow <span>AI</span>
        </a>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Workspace">
          <a className="nav-item active" href="#editor">
            <Icon name="grid" size={16} />
            Meeting workspace
          </a>
          <a className="nav-item" href="#how-it-works">
            <Icon name="document" size={16} />
            How it works
          </a>
        </nav>
        <div className="sidebar-note">
          <Icon name="shield" size={20} />
          <strong>Your words, with care.</strong>No meeting history is saved by
          this app. Only analyze transcripts you are comfortable sharing with
          Google.
        </div>
        <div className="sidebar-bottom">
          <span className="dot" />
          Built for a clearer workday
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="crumb">
            Workspace <span>/</span>
            <span>New analysis</span>
          </div>
          <div className="top-actions">
            <span className="model-label">
              <Icon name="spark" size={13} />
              Powered by Gemini
            </span>
            <button
              className="icon-button"
              onClick={() => setLight(!light)}
              aria-label={
                light ? "Switch to dark mode" : "Switch to light mode"
              }
            >
              <Icon name={light ? "moon" : "sun"} size={15} />
            </button>
          </div>
        </header>
        <main className="workspace" id="main">
          <div className="sr-only" role="status" aria-live="polite">
            {analysis
              ? sample
                ? "Sample meeting analysis ready. No AI request was made."
                : "Meeting analysis ready. Results are below the editor."
              : ""}
          </div>
          <section className="hero">
            <div className="eyebrow">
              <Icon name="spark" size={13} />
              MEETING INTELLIGENCE, SIMPLIFIED
            </div>
            <h1>
              Less meeting.
              <br />
              <em>More momentum.</em>
            </h1>
            <p>
              Turn meetings into action. Bring your transcript — leave with
              clear decisions, actionable tasks, and a plan for what comes next.
            </p>
            <div className="hero-meta">
              <span>
                <Icon name="check" size={12} />
                No account needed
              </span>
              <span>
                <Icon name="check" size={12} />
                Nothing saved by the app
              </span>
              <span>
                <Icon name="check" size={12} />
                Built for focus
              </span>
            </div>
          </section>
          <div className="editor-grid">
            <section
              className="panel"
              id="editor"
              aria-labelledby="editor-title"
            >
              <div className="panel-heading">
                <h2 id="editor-title">
                  <span className="step-number">01</span>Add your transcript
                </h2>
                <button
                  className="text-button"
                  disabled={loading}
                  onClick={() => replaceText(EXAMPLE_TRANSCRIPT)}
                >
                  <Icon name="spark" size={12} />
                  Try example
                </button>
              </div>
              <form className="editor-body" onSubmit={analyze}>
                <label htmlFor="transcript" className="field-label">
                  Paste transcript
                </label>
                <textarea
                  id="transcript"
                  value={transcript}
                  onChange={(e) => replaceText(e.target.value)}
                  disabled={loading}
                  placeholder="Paste your meeting transcript here… Try the example to see a conversation."
                  aria-describedby="input-help transcript-count"
                  spellCheck={false}
                />
                <div className="input-meta">
                  <span id="input-help">A conversation is all you need.</span>
                  <span
                    id="transcript-count"
                    className={
                      transcript.length > MAX_TRANSCRIPT_CHARS
                        ? "over-limit"
                        : ""
                    }
                  >
                    {transcript.length.toLocaleString("en-US")} / 20,000
                    characters
                  </span>
                </div>
                <div className="upload-row">
                  <label className="upload-label">
                    <Icon name="upload" size={14} />
                    Upload transcript
                    <input
                      ref={fileRef}
                      className="sr-only"
                      type="file"
                      accept=".txt,text/plain"
                      onChange={upload}
                      disabled={loading}
                      aria-label="Upload a UTF-8 text transcript"
                    />
                  </label>
                  <small className={filename ? "filename" : ""}>
                    {filename || "or choose a .txt file · up to 80 KB"}
                  </small>
                  {transcript && (
                    <button
                      type="button"
                      className="text-button"
                      style={{ marginLeft: "auto" }}
                      disabled={loading}
                      onClick={() => replaceText("")}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="analyze-row">
                  <span className="estimate">
                    A little clarity goes a long way.
                  </span>
                  <button
                    className="primary-button"
                    type="submit"
                    disabled={
                      loading ||
                      !transcript.trim() ||
                      transcript.length > MAX_TRANSCRIPT_CHARS
                    }
                  >
                    <Icon name="spark" size={15} />
                    {loading ? "Analyzing meeting…" : "Analyze Meeting"}
                    {!loading && <Icon name="arrow" size={15} />}
                  </button>
                </div>
                <p className="privacy-note">
                  Analyzing sends your transcript to Google Gemini. The free
                  tier may use content to improve its products. Please do not
                  submit confidential information.
                </p>
              </form>
            </section>
            <aside className="panel helper" id="how-it-works">
              <span className="mini-label">FROM WORDS TO WHAT’S NEXT</span>
              <h2>
                The important parts.
                <br />
                Without the busywork.
              </h2>
              <div className="feature-line">
                <Icon name="check" size={16} />
                <div>
                  <strong>Decisions, made clear</strong>Keep the choices that
                  move work forward.
                </div>
              </div>
              <div className="feature-line">
                <Icon name="flag" size={16} />
                <div>
                  <strong>Actions, with ownership</strong>See who is doing what
                  — when identified.
                </div>
              </div>
              <div className="feature-line">
                <Icon name="risk" size={16} />
                <div>
                  <strong>Nothing left hanging</strong>Bring risks and open
                  questions into view.
                </div>
              </div>
              <div className="helper-footer">
                Curious what the result looks like?
                <button
                  className="sample-link"
                  disabled={loading}
                  onClick={showSample}
                >
                  Preview sample result
                  <Icon name="arrow" size={13} />
                </button>
              </div>
            </aside>
          </div>
          {!available && (
            <div className="configuration-note">
              <Icon name="document" size={15} />
              <span>
                Gemini is not configured or enabled yet. You can still explore a
                fictional example without an API key.{" "}
                <button
                  className="text-button"
                  style={{ display: "inline-flex" }}
                  disabled={loading}
                  onClick={showSample}
                >
                  Preview sample result <Icon name="arrow" size={11} />
                </button>
              </span>
            </div>
          )}
          {error && (
            <div ref={errorRef} tabIndex={-1} className="error" role="alert">
              {error}
            </div>
          )}
          {loading && (
            <section className="progress" role="status" aria-live="polite">
              <div className="progress-title">
                <span className="pulse" />
                Analyzing meeting…
              </div>
              <div className="progress-steps">
                {stages.map((s, i) => (
                  <span key={s} className={i === stage ? "current" : ""}>
                    {i < stage ? (
                      <Icon name="check" size={11} />
                    ) : (
                      <span>0{i + 1}</span>
                    )}
                    {s}
                  </span>
                ))}
              </div>
              <small>
                Illustrative steps — Gemini processes your transcript in a
                single request.
              </small>
            </section>
          )}
          {analysis && (
            <section
              className="results"
              id="analysis"
              ref={resultRef}
              aria-label="Meeting analysis results"
            >
              <AnalysisResults analysis={analysis} sample={sample} />
              <ExportToolbar
                key={JSON.stringify(analysis)}
                analysis={analysis}
                sample={sample}
              />
            </section>
          )}
          <footer className="footer">
            <span>
              <Icon name="spark" size={12} />
              MeetFlow AI · Turn meetings into action.
            </span>
            <span>Thoughtful software. Clearer next steps.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
