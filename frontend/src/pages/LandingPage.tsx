import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          textAlign: "center",
          backgroundColor: "#0f172a",
          padding: "3rem 2.5rem",
          borderRadius: "14px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          AI Resume Analyzer
        </h1>

        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "#cbd5f5",
            marginBottom: "2.5rem",
          }}
        >
          Analyze your resume against real job descriptions using AI.
          Identify missing skills, understand ATS scores, and improve your
          chances of getting shortlisted.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "#020617",
              color: "#e5e7eb",
              border: "1px solid #334155",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
