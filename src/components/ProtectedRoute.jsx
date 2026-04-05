import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// FIX: ProtectedRoute now handles the loading state
// AuthContext no longer blocks the whole app — only protected pages wait
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Wait for auth check to finish before deciding to redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Role check (e.g. requiredRole="alumni" for mentor profile)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;