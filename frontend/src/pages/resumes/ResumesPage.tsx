import { useEffect, useRef, useState } from "react";
import { uploadResume, getResumes, type Resume } from "../../api/resumes.api";

const MAX_FILE_SIZE_MB = 2;

function ResumesPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 🆕 Resume list state (Step 8.5.2)
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [resumeFetchError, setResumeFetchError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (isUploading) return;

    setError(null);
    setSuccessMessage(null);
    setSelectedFile(null);

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setError("File size must be 2MB or less.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await uploadResume(selectedFile);
      setSuccessMessage("Resume uploaded successfully.");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      if (err?.response) {
        const status = err.response.status;

        if (status === 401) {
          setError("Session expired. Please log in again.");
        } else if (status === 413) {
          setError("File too large. Maximum allowed size is 2MB.");
        } else if (status === 422) {
          setError(
            "The uploaded PDF appears to be image-based. Please upload a text-based PDF resume."
          );
        } else {
          setError("Upload failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page header */}
      <div>
        <h1>Resumes</h1>
        <p style={{ opacity: 0.8 }}>
          Upload and manage your resumes for analysis.
        </p>
      </div>

      {/* Upload card */}
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "12px",
          backgroundColor: "#020617",
          border: "1px solid #1e293b",
          maxWidth: "520px",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Upload Resume (PDF)</h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            disabled={isUploading}
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] || null)
            }
          />

          {error && (
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>
              {error}
            </p>
          )}

          {successMessage && (
            <p style={{ color: "#4ade80", fontSize: "0.9rem" }}>
              {successMessage}
            </p>
          )}

          {isUploading && (
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Uploading…
            </p>
          )}

          {selectedFile && !error && (
            <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
              Selected file: <strong>{selectedFile.name}</strong>
            </p>
          )}

          <button
            disabled={!selectedFile || !!error || isUploading}
            onClick={handleUpload}
          >
            Upload Resume
          </button>
        </div>
      </div>

      

      {/* ⚠️ Resume list NOT rendered yet (next step) */}
    </div>
  );
}

export default ResumesPage;
