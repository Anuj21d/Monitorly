import { createBrowserRouter } from "react-router";
import LandingPage from "../features/Landing/pages/LandingPage";
import AuthPage from "../features/Auth/pages/AuthPage";
import LoginPage from "../features/Auth/pages/LoginPage";
import RegisterPage from "../features/Auth/pages/RegisterPage";

export const router = createBrowserRouter([
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
]);
