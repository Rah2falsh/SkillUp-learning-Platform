import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const userRole = localStorage.getItem("skillup_role");

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}