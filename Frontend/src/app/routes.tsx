import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../features/Landing/pages/LandingPage";
import AuthPage from "../features/Auth/pages/AuthPage";
import LoginPage from "../features/Auth/pages/LoginPage";
import RegisterPage from "../features/Auth/pages/RegisterPage";
import Dashboard from "../features/Dashboard/pages/Dashboard";
import ProtectedRoute from "../features/Auth/components/ProtectedRoute";
import { ApiTesterPage } from "../features/ApiTester/pages/ApiTesterPage";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/api-tester",
        element: <ApiTesterPage />,
      },
    ],
  },
]);
