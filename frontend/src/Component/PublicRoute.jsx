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

    return <Navigate to="/" replace />;
  }

  // Not authenticated
  return <Outlet />;
};

export default PublicRoute;