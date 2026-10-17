import { useGoogleLogin } from "@react-oauth/google";

export function useGoogleAuth() {
  const googleAuth = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (response) => {
      console.log("Google authorization succeeded");

      const code = response.code;

      if (!code) {
        console.error("Authorization code is missing");
        return;
      }

      // We'll send this code to your backend in the next step.
      console.log("Authorization code received");
    },

    onError: (error) => {
      console.error("Google OAuth failed", error);
    },

    onNonOAuthError: (error) => {
      console.error("Google popup error", error);
    },
  });

  return { googleAuth };
}
