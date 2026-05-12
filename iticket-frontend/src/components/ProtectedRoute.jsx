import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminPanel = false, requiredRoles = [] }) {
  const { isAuthenticated, roles } = useAuth();

  const normalizeRole = (role) => {
    const roleValue = typeof role === "string"
      ? role
      : role?.name || role?.roleName || role?.value || "";

    return String(roleValue).trim().toLowerCase();
  };

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (adminPanel && requiredRoles.length > 0) {
    const normalizedRequiredRoles = requiredRoles.map(normalizeRole);
    const hasRequiredRole = roles.some((role) =>
      normalizedRequiredRoles.includes(normalizeRole(role))
    );

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
