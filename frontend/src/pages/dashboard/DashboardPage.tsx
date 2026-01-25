import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>You are logged in.</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DashboardPage;
