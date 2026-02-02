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

  const handleLogin = async () => {
    if (loading) return;

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
      <div
        style={{
          width: "360px",
          backgroundColor: "#0f172a",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Login
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  marginTop: "0.25rem",
  borderRadius: "6px",
  border: "1px solid #334155",
  backgroundColor: "#020617",
  color: "#e5e7eb",
};

export default LoginPage;
