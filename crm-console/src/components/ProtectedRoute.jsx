import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute({ children, roles }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <p className="p-6 text-muted">Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/leads" replace />;
  }

  return children;
}
