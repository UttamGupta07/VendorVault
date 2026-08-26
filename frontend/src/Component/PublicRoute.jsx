import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  // Wait until /api/auth/me finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Already authenticated
  if (user) {
    if (user.role === "SUPER_ADMIN") {
      return (
        <Navigate
          to="/super-admin/dashboard"
          replace
        />
      );
    }
    else if (user.role === "COMPLIANCE_OFFICER") {
      return (
        <Navigate
          to="/compliance/dashboard"
          replace
        />
      );

    }
    else if (user.role === "AUDITOR") {
      return (
        <Navigate
          to="/auditor/dashboard"
          replace
        />
      );
    } else if (user.role === "VENDOR") {
      return (
        <Navigate
          to="/vendor/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  // Not authenticated
  return <Outlet />;
};

export default PublicRoute;