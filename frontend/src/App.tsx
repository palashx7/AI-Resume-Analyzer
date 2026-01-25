import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AuthGuard from "./routes/AuthGuard";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ResumesPage from "./pages/resumes/ResumesPage";
import JobDescriptionsPage from "./pages/jobDescriptions/JobDescriptionsPage";
import AnalysisPage from "./pages/analysis/AnalysisPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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
</Route>


      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
