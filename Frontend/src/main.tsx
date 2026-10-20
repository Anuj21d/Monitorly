import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./app/App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "./features/Auth/AuthContext";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </GoogleOAuthProvider>,
);
