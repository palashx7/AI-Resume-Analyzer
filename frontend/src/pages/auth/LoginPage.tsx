import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { login } from "../../api/auth.api";

function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuth(data.user, data.token);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#020617",
      }}
    >
      {/* Login Card */}
      <div
        style={{
          width: "360px",
          backgroundColor: "#0f172a",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Login</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #334155",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #334155",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "1rem",
              width: "100%",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
