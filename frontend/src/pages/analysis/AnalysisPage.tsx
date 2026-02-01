import { useState } from "react";
import { runAnalysis, type AnalysisResult } from "../../api/analysis.api";
import AnalysisHistoryPage from "./AnalysisHistoryPage";
import { getAnalysisById } from "../../api/analysis.api";

function AnalysisPage() {
  const [resumeId, setResumeId] = useState("");
  const [jobDescriptionId, setJobDescriptionId] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);


  type AnalysisTab = "run" | "history";

  const [activeTab, setActiveTab] = useState<AnalysisTab>("run");

  const [isLoadingAnalysis] = useState(false);

  const handleHistoryClick = async (analysisId: string) => {
    try {
      setSelectedAnalysisId(analysisId); // ✅ NEW
      setIsRunning(true);
      setErrorMessage(null);

      const response = await getAnalysisById(analysisId);

      // ✅ THIS IS THE REAL OBJECT
      const analysis = response.analysis;

      const normalized: AnalysisResult = {
        atsScore: analysis.atsScore,
        similarityScore: analysis.similarityScore,
        finalScore: analysis.finalScore,

        fitLabel: analysis.fitLabel,
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        categorizedSkills: analysis.categorizedSkills,
        strengths: analysis.strengths,
        improvements: analysis.improvements,

        createdAt: analysis.createdAt,
      };

      setAnalysisResult(normalized);
      setActiveTab("run");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load analysis details.");
    } finally {
      setIsRunning(false);
    }
  };

  const isFormValid =
    resumeId.trim()?.length > 0 && jobDescriptionId.trim()?.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isRunning) return;

    setIsRunning(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const response = await runAnalysis({
        resumeId: resumeId.trim(),
        jobDescriptionId: jobDescriptionId.trim(),
      });

      console.log("ANALYSIS RESPONSE:", response);

      const normalized: AnalysisResult = {
        atsScore: response.analysis.scores.atsScore,
        similarityScore: response.analysis.scores.similarityScore,
        finalScore: response.analysis.scores.finalScore,

        fitLabel: response.analysis.fitLabel,
        matchedSkills: response.analysis.matchedSkills,
        missingSkills: response.analysis.missingSkills,
        categorizedSkills: response.analysis.categorizedSkills,
        strengths: response.analysis.strengths,
        improvements: response.analysis.improvements,
        createdAt: response.analysis.createdAt,
      };

      setAnalysisResult(normalized);
      console.log("CATEGORIZED SKILLS IN STATE:", normalized.categorizedSkills);
    } catch (err: any) {
      if (err?.response) {
        if (err.response.status === 401) {
          setErrorMessage("Session expired. Please log in again.");
        } else if (err.response.status === 404) {
          setErrorMessage(
            "Resume or Job Description not found. Make sure both belong to your account.",
          );
        } else {
          setErrorMessage("Failed to run analysis.");
        }
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    } finally {
      setIsRunning(false);
    }
  };

  const renderSkillGroup = (title: string, skills: string[]) => {
    if (!skills || skills.length === 0) return null;

    return (
      <div style={{ marginTop: "0.5rem" }}>
        <strong>{title}</strong>
        <ul>
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    );
  };

  const SkillChips = ({ skills }: { skills?: string[] }) => {
    if (!skills || skills.length === 0) {
      return <span style={{ opacity: 0.5, fontSize: "0.85rem" }}>None</span>;
    }

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginTop: "0.25rem",
        }}
      >
        {skills.map((skill) => (
          <span
            key={skill}
            style={{
              padding: "0.35rem 0.65rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              backgroundColor: "#020617",
              border: "1px solid #334155",
              color: "#e5e7eb",
              whiteSpace: "nowrap",
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page header */}
      <div>
        <h1>Analysis</h1>
        <p style={{ opacity: 0.8 }}>
          Run AI-powered analysis between a resume and a job description.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setActiveTab("run")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "999px",
            fontWeight: 600,
            background: activeTab === "run" ? "#2563eb" : "#020617",
            color: activeTab === "run" ? "#ffffff" : "#94a3b8",
            border: "1px solid #1e293b",
          }}
        >
          Run Analysis
        </button>

        <button
          onClick={() => setActiveTab("history")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "999px",
            fontWeight: 600,
            background: activeTab === "history" ? "#2563eb" : "#020617",
            color: activeTab === "history" ? "#ffffff" : "#94a3b8",
            border: "1px solid #1e293b",
          }}
        >
          History
        </button>
      </div>

      {activeTab === "run" && (
        <>
          {/* Analysis form */}
          <div
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              backgroundColor: "#020617",
              border: "1px solid #1e293b",
              maxWidth: "720px",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Run Analysis</h3>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {/* Resume ID */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <label>Resume ID</label>
                <input
                  type="text"
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  disabled={isRunning}
                  placeholder="Paste Resume ID here"
                  style={{
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #334155",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>

              {/* Job Description ID */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <label>Job Description ID</label>
                <input
                  type="text"
                  value={jobDescriptionId}
                  onChange={(e) => setJobDescriptionId(e.target.value)}
                  disabled={isRunning}
                  placeholder="Paste Job Description ID here"
                  style={{
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #334155",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>

              {/* Error message */}
              {errorMessage && (
                <p style={{ color: "#f87171", fontSize: "0.9rem" }}>
                  {errorMessage}
                </p>
              )}

              {/* Submit button */}
              <button type="submit" disabled={!isFormValid || isRunning}>
                {isRunning ? "Running Analysis…" : "Run Analysis"}
              </button>
            </form>
          </div>

          {/* Analysis result */}
          {analysisResult && (
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "12px",
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                maxWidth: "720px",
              }}
            >
              {/* Summary */}
              <h3 style={{ marginBottom: "1rem" }}>Analysis Summary</h3>

              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                <div>
                  <strong>Final Score</strong>
                  <div>{analysisResult.finalScore}%</div>
                </div>

                <div>
                  <strong>Fit</strong>
                  <div>{analysisResult.fitLabel}</div>
                </div>

                <div>
                  <strong>ATS Score</strong>
                  <div>{analysisResult.atsScore}%</div>
                </div>

                <div>
                  <strong>Similarity</strong>
                  <div>{analysisResult.similarityScore}%</div>
                </div>
              </div>

              <hr style={{ margin: "1.5rem 0", opacity: 0.2 }} />

              {/* Skills */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3>Skills Analysis</h3>

                {analysisResult.categorizedSkills && (
                  <div
                    style={{
                      marginTop: "1rem",
                      display: "grid",
                      gap: "1.5rem",
                    }}
                  >
                    {/* MATCHED */}
                    <div>
                      <h4 style={{ color: "#22c55e" }}>✅ Matched Skills</h4>

                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Core</strong>
                        <SkillChips
                          skills={analysisResult.categorizedSkills.matched.core}
                        />
                      </div>

                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Important</strong>
                        <SkillChips
                          skills={
                            analysisResult.categorizedSkills.matched.important
                          }
                        />
                      </div>

                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Nice to Have</strong>
                        <SkillChips
                          skills={
                            analysisResult.categorizedSkills.matched.niceToHave
                          }
                        />
                      </div>
                    </div>

                    {/* MISSING */}
                    <div>
                      <h4 style={{ color: "#f97316" }}>⚠ Missing Skills</h4>

                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Core</strong>
                        <SkillChips
                          skills={analysisResult.categorizedSkills.missing.core}
                        />
                      </div>

                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Important</strong>
                        <SkillChips
                          skills={
                            analysisResult.categorizedSkills.missing.important
                          }
                        />
                      </div>

                      <div style={{ marginTop: "0.5rem" }}>
                        <strong>Nice to Have</strong>
                        <SkillChips
                          skills={
                            analysisResult.categorizedSkills.missing.niceToHave
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                
              </div>

              {/* Insights */}
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <h3>Strengths</h3>
                  {analysisResult.strengths.length === 0 ? (
                    <p style={{ opacity: 0.7 }}>No strengths listed.</p>
                  ) : (
                    <ul>
                      {analysisResult.strengths.map(
                        (item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ),
                      )}
                    </ul>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: "260px" }}>
                  <h3>Improvements</h3>
                  {analysisResult.improvements.length === 0 ? (
                    <p style={{ opacity: 0.7 }}>No improves listed.</p>
                  ) : (
                    <ul>
                      {analysisResult.improvements.map(
                        (item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "history" && (
  <AnalysisHistoryPage
    onSelectAnalysis={handleHistoryClick}
    selectedAnalysisId={selectedAnalysisId}
  />
)}

      {isLoadingAnalysis && <p>Loading analysis…</p>}
    </div>
  );
}

export default AnalysisPage;
