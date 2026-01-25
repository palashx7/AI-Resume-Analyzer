import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "0.95rem",
    color: isActive ? "#0f172a" : "#e5e7eb",
    backgroundColor: isActive ? "#38bdf8" : "transparent",
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          backgroundColor: "#020617",
          padding: "1.25rem 1rem",
          borderRight: "1px solid #1e293b",
        }}
      >
        <h2 style={{ marginBottom: "2rem" }}>AI Resume Analyzer</h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <NavLink to="/dashboard" end style={navLinkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/resumes" style={navLinkStyle}>
            Resumes
          </NavLink>
          <NavLink to="/dashboard/job-descriptions" style={navLinkStyle}>
            Job Descriptions
          </NavLink>
          <NavLink to="/dashboard/analysis" style={navLinkStyle}>
            Analysis
          </NavLink>
        </nav>
      </aside>

      {/* Main area */}
      <div
        style={{
          flex: 1, // ✅ KEY FIX
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#020617",
        }}
      >
        {/* Header */}
        <header
          style={{
            height: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1.5rem",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <span style={{ fontWeight: 500, opacity: 0.85 }}>
            
          </span>
          <button onClick={handleLogout}>Logout</button>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            padding: "2rem",
            backgroundColor: "#020617",
          }}
        >
          <div
            style={{
              backgroundColor: "#0f172a",
              borderRadius: "12px",
              padding: "2rem",
              minHeight: "100%",
              width: "100%", // ✅ KEY FIX
            }}
          >
            <Outlet /> {/* ✅ REQUIRED */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
