import { useEffect, useRef, useState } from "react";
import { runAnalysis, type AnalysisResult } from "../../api/analysis.api";
import AnalysisHistoryPage from "./AnalysisHistoryPage";
import { getAnalysisById } from "../../api/analysis.api";
import { getResumes, type Resume } from "../../api/resumes.api";
import {
  getJobDescriptions,
  type JobDescription,
} from "../../api/jobDescription.api";

function AnalysisPage() {
  const [resumeId, setResumeId] = useState("");
  const [jobDescriptionId, setJobDescriptionId] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(
    null,
  );

  type AnalysisTab = "run" | "history";

  const [activeTab, setActiveTab] = useState<AnalysisTab>("run");

  const [isLoadingAnalysis] = useState(false);
  const [showResumeList, setShowResumeList] = useState(false);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [resumesError, setResumesError] = useState<string | null>(null);
  const [showJobDescriptionList, setShowJobDescriptionList] = useState(false);

  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [jobDescriptionsLoading, setJobDescriptionsLoading] = useState(false);
  const [jobDescriptionsError, setJobDescriptionsError] = useState<
    string | null
  >(null);

  const resumeDropdownRef = useRef<HTMLDivElement | null>(null);
const jdDropdownRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    async function fetchResumes() {
      try {
        setResumesLoading(true);
        setResumesError(null);

        const data = await getResumes();
        setResumes(data);
      } catch (err) {
        setResumesError("Failed to load resumes.");
      } finally {
        setResumesLoading(false);
      }
    }

    fetchResumes();
  }, []);

  useEffect(() => {
    async function fetchJobDescriptions() {
      try {
        setJobDescriptionsLoading(true);
        setJobDescriptionsError(null);

        const data = await getJobDescriptions();
        setJobDescriptions(data);
      } catch (err) {
        setJobDescriptionsError("Failed to load job descriptions.");
      } finally {
        setJobDescriptionsLoading(false);
      }
    }

    fetchJobDescriptions();
  }, []);

  useEffect(() => {
  if (!showResumeList && !showJobDescriptionList) {
    return;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    if (
      showResumeList &&
      resumeDropdownRef.current &&
      !resumeDropdownRef.current.contains(target)
    ) {
      setShowResumeList(false);
    }

    if (
      showJobDescriptionList &&
      jdDropdownRef.current &&
      !jdDropdownRef.current.contains(target)
    ) {
      setShowJobDescriptionList(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [
  showResumeList,
  showJobDescriptionList,
  resumeDropdownRef,
  jdDropdownRef,
]);


useEffect(() => {
  if (!showResumeList && !showJobDescriptionList) {
    return;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      if (showResumeList) {
        setShowResumeList(false);
      }
      if (showJobDescriptionList) {
        setShowJobDescriptionList(false);
      }
    }
  }

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [showResumeList, showJobDescriptionList]);


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
              {/* Resume selection */}
              <div
  ref={resumeDropdownRef}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    position: "relative",
  }}
>

                <label>Resume</label>

                {/* Selected value */}
                <div
                  onClick={() => setShowResumeList((v) => !v)}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #334155",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {resumeId
                    ? (() => {
                        const selected = resumes.find((r) => r.id === resumeId);
                        return selected
                          ? selected.resumeTitle || selected.originalFileName
                          : "Select a resume";
                      })()
                    : resumesLoading
                      ? "Loading resumes..."
                      : resumes.length === 0
                        ? "No resumes uploaded"
                        : "Select a resume"}
                </div>

                {/* Dropdown list */}
                {showResumeList && !resumesLoading && resumes.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "#020617",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                      marginTop: "0.25rem",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 20,
                    }}
                  >
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        onClick={() => {
                          setResumeId(resume.id);
                          setShowResumeList(false);
                        }}
                        style={{
                          padding: "0.5rem",
                          cursor: "pointer",
                          backgroundColor:
                            resume.id === resumeId ? "#1e293b" : "#020617",
                          color: "#e5e7eb",
                        }}
                      >
                        {resume.resumeTitle || resume.originalFileName}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Description selection */}

              <div
  ref={jdDropdownRef}
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    position: "relative",
  }}
>

                <label>Job Description</label>

                {/* Selected value */}
                <div
                  onClick={() => {
                    setShowJobDescriptionList((v) => !v);
                  }}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #334155",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {jobDescriptionId
                    ? (() => {
                        const selected = jobDescriptions.find(
                          (j) => j.id === jobDescriptionId,
                        );
                        return selected
                          ? `${selected.jdTitle} — ${selected.companyName}`
                          : "Select a job description";
                      })()
                    : jobDescriptionsLoading
                      ? "Loading job descriptions..."
                      : jobDescriptions.length === 0
                        ? "No job descriptions created"
                        : "Select a job description"}
                </div>

                {/* Dropdown list */}
                {showJobDescriptionList && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "#020617",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                      marginTop: "0.25rem",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 20,
                    }}
                  >
                    {jobDescriptionsLoading && (
                      <div style={{ padding: "0.5rem", color: "#94a3b8" }}>
                        Loading job descriptions...
                      </div>
                    )}

                    {!jobDescriptionsLoading &&
                      jobDescriptions.length === 0 && (
                        <div style={{ padding: "0.5rem", color: "#94a3b8" }}>
                          No job descriptions created
                        </div>
                      )}

                    {!jobDescriptionsLoading &&
                      jobDescriptions.map((jd) => (
                        <div
                          key={jd.id}
                          onClick={() => {
                            setJobDescriptionId(jd.id);
                            setShowJobDescriptionList(false);
                          }}
                          style={{
                            padding: "0.5rem",
                            cursor: "pointer",
                            backgroundColor:
                              jd.id === jobDescriptionId
                                ? "#1e293b"
                                : "#020617",
                            color: "#e5e7eb",
                          }}
                        >
                          {jd.jdTitle} — {jd.companyName}
                        </div>
                      ))}
                  </div>
                )}

                {jobDescriptionsError && (
                  <span style={{ color: "#f87171", fontSize: "0.85rem" }}>
                    {jobDescriptionsError}
                  </span>
                )}
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
