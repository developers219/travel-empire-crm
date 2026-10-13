import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import LeadDistribution from "./pages/LeadDistribution.jsx";
import Login from "./pages/Login.jsx";

const ADMIN_ONLY = ["admin"];

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/leads" replace />} />
        <Route path="dashboard" element={<ComingSoon title="Dashboard" />} />
        <Route path="leads" element={<LeadDistribution />} />
        <Route path="followups" element={<ComingSoon title="Follow-ups" />} />
        <Route path="customers" element={<ComingSoon title="Customers" />} />
        <Route path="companies" element={<ComingSoon title="Companies" />} />

        <Route
          path="settings"
          element={
            <ProtectedRoute roles={ADMIN_ONLY}>
              <ComingSoon title="Settings" />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={ADMIN_ONLY}>
              <ComingSoon title="User access" />
            </ProtectedRoute>
          }
        />
        <Route
          path="audit-logs"
          element={
            <ProtectedRoute roles={ADMIN_ONLY}>
              <ComingSoon title="Audit logs" />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/leads" replace />} />
    </Routes>
  );
}
