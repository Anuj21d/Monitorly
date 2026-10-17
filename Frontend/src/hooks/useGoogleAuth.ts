import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuthService } from "../services/googleAuthService";

export function useGoogleAuth(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleAuth = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (response) => {
      const code = response.code;

      if (!code) {
        setError("Google authorization code is missing");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await googleAuthService(code);

        console.log("Google login successful:", data.user);

        onSuccess?.();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Google authentication failed";

        setError(message);
        console.error("Google authentication failed:", err);
      } finally {
        setIsLoading(false);
      }
    },

    onError: () => {
      setError("Google authorization failed. Please try again.");
    },

    onNonOAuthError: (error) => {
      console.error("Google popup error:", error);
      setError("The Google sign-in popup could not be completed.");
    },
  });

  return {
    googleAuth,
    isLoading,
    error,
  };
}
