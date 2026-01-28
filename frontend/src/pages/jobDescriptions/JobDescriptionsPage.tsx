import { useState } from "react";
import { createJobDescription } from "../../api/jobDescription.api";

function JobDescriptionsPage() {
  const [jdTitle, setJdTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jdText, setJdText] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isFormValid =
    jdTitle.trim().length > 0 &&
    companyName.trim().length > 0 &&
    jdText.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
          await createJobDescription({
      jdTitle: jdTitle.trim(),
      companyName: companyName.trim(),
      jdText: jdText.trim(),
    });

    setSuccessMessage("Job description created successfully.");

    // ✅ Reset form after success
    setJdTitle("");
    setCompanyName("");
    setJdText("");
    } catch (err: any) {
      if (err?.response) {
        if (err.response.status === 401) {
          setErrorMessage("Session expired. Please log in again.");
        } else {
          setErrorMessage("Failed to create job description.");
        }
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page header */}
      <div>
        <h1>Job Descriptions</h1>
        <p style={{ opacity: 0.8 }}>
          Create job descriptions to analyze resumes against.
        </p>
      </div>

      {/* Job Description creation card */}
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "12px",
          backgroundColor: "#020617",
          border: "1px solid #1e293b",
          maxWidth: "720px",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Create Job Description</h3>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Job Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label>Job Title</label>
            <input
              type="text"
              value={jdTitle}
              onChange={(e) => setJdTitle(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Frontend Engineer"
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #334155",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>

          {/* Company Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Google"
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #334155",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>

          {/* Job Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label>Job Description</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={isSubmitting}
              rows={8}
              placeholder="Paste the full job description here..."
              style={{
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #334155",
                backgroundColor: "#020617",
                color: "#e5e7eb",
                resize: "vertical",
              }}
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>
              {errorMessage}
            </p>
          )}

          {/* Success message */}
          {successMessage && (
            <p style={{ color: "#4ade80", fontSize: "0.9rem" }}>
              {successMessage}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Job Description"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobDescriptionsPage;
