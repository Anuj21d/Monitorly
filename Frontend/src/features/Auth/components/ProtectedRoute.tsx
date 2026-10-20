import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="flex flex-col items-center rounded-2xl border border-border-dark-subtle bg-canvas p-8 shadow-2xl">
          <div className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-border-dark-subtle border-t-border-light-subtle" />

          <h2 className="text-lg font-semibold text-text-light-primary">
            Checking your session
          </h2>

          <p className="mt-2 text-sm text-text-light-secondary">
            Securely preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
