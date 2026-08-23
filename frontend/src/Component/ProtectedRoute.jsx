 import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Wait for /api/auth/me
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Authentication check finished
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User authenticated
  return <Outlet />;
};

export default ProtectedRoute;