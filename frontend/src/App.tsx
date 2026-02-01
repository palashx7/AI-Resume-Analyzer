// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import LandingPage from "./pages/LandingPage";
import AuthGuard from "./routes/AuthGuard";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ResumesPage from "./pages/resumes/ResumesPage";
import JobDescriptionsPage from "./pages/jobDescriptions/JobDescriptionsPage";
import AnalysisPage from "./pages/analysis/AnalysisPage";
import RegisterPage from "./pages/auth/RegisterPage";



function App() {
  const auth = useAuth();

  // ⏳ Wait for auth bootstrap (prevents flicker)
  if (!auth.isInitialized) {
    return <div>Initializing...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          auth.isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <LandingPage />
        }
      />
      <Route path="/" element={
        auth.isAuthenticated
          ? <Navigate to="/dashboard" replace />
          : <LandingPage />
      } />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="resumes" element={<ResumesPage />} />
        <Route path="job-descriptions" element={<JobDescriptionsPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route
          path="/dashboard/analysis/history"
        />
      </Route>
    </Routes>
  );
}

export default App;
