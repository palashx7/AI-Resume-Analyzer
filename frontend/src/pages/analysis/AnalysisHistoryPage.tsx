import { useEffect, useState } from "react";
import {
  getAnalysisHistory,
  type AnalysisHistoryItem,
  type FitLabel,
} from "../../api/analysis.api";

interface AnalysisHistoryPageProps {
  onSelectAnalysis: (analysisId: string) => void;
  selectedAnalysisId: string | null;
}

/**
 * Helper for fit label colors
 */
function getFitStyles(label: FitLabel) {
  switch (label) {
    case "High Fit":
      return { background: "#16a34a", color: "#022c22" };
    case "Medium Fit":
      return { background: "#facc15", color: "#422006" };
    case "Low Fit":
      return { background: "#ef4444", color: "#450a0a" };
    default:
      return { background: "#334155", color: "#e5e7eb" };
  }
}

function AnalysisHistoryPage({
  onSelectAnalysis,
  selectedAnalysisId,
}: AnalysisHistoryPageProps) {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        setError(null);

        const response = await getAnalysisHistory(page, 10);

        setHistory(response.analyses);
        setTotal(response.total);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError("Failed to load analysis history.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [page]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page Header */}
      <div>
        <h1>Analysis History</h1>
        <p style={{ opacity: 0.8 }}>
          View all your past resume–job analyses here.
        </p>
      </div>

      {/* History Card */}
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "12px",
          backgroundColor: "#020617",
          border: "1px solid #1e293b",
          maxWidth: "800px",
        }}
      >
        {loading && <p>Loading analysis history…</p>}

        {error && (
          <p style={{ color: "#f87171", fontSize: "0.9rem" }}>{error}</p>
        )}

        {!loading && !error && history.length === 0 && (
          <p style={{ opacity: 0.7 }}>
            No analysis history yet. Run your first analysis to see it here.
          </p>
        )}

        {!loading && !error && history.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {history.map((item) => {
              const isSelected =
                item.analysisId === selectedAnalysisId;

              return (
                <div
                  key={item.analysisId}
                  onClick={() => onSelectAnalysis(item.analysisId)}
                  style={{
                    padding: "1rem",
                    borderRadius: "10px",
                    border: isSelected
                      ? "1px solid #2563eb"
                      : "1px solid #1e293b",
                    backgroundColor: "#020617",
                    boxShadow: isSelected
                      ? "0 0 0 1px rgba(37, 99, 235, 0.6)"
                      : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease-in-out",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                      {item.finalScore}%
                    </div>

                    <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                      ATS: {item.atsScore}% · Similarity:{" "}
                      {item.similarityScore}%
                    </div>

                    <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <span
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      ...getFitStyles(item.fitLabel),
                    }}
                  >
                    {item.fitLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && total > 10 && (
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: "1rem",
            }}
          >
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>

            <button
              disabled={page * 10 >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisHistoryPage;
