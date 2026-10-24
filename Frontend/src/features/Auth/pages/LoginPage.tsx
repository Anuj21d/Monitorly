import { Eye, EyeClosed } from "lucide-react";
import { motion } from "motion/react";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import { loginSchema } from "../schemas/authSchemas";
import { apiClient, useAuth } from "../AuthContext";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const { refreshUser } = useAuth();

  const {
    googleAuth,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuth(async () => {
    await refreshUser();
    navigate("/dashboard", { replace: true });
  });

  async function handleSubmitLoginForm(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError(null);
    setLoginError(null);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const firstIssue =
        result.error.issues[0]?.message || "Invalid email or password.";
      setValidationError(firstIssue);
      return;
    }

    try {
      setLoginLoading(true);
      const response = await apiClient.post(`/api/auth/login`, {
        email: result.data.email,
        password: result.data.password,
      });

      if (response.status !== 200) {
        setLoginError(response.data.message);
        return;
      }

      await refreshUser();

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setLoginError("Incorrect email or password.");
        } else {
          setLoginError(
            err.response?.data?.message ||
              "Failed to sign in. Please try again.",
          );
        }
      } else {
        setLoginError("Something went wrong. Please try again.");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <section>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl w-full mx-auto py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
      >
        {/* Left Branding Column */}
        <motion.div
          variants={leftPanelVariants}
          className="lg:col-span-6 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-coral">
              Developer Infrastructure
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.98] text-text-light-primary text-balance font-display">
            Your APIs
            <br />
            Always
            <br />
            <span className="text-coral">visible.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-light-secondary leading-relaxed max-w-lg">
            Access real-time telemetry, active incident root-causes, and
            multi-region synthetic heartbeats in one unified console.
          </p>
        </motion.div>

        {/* Right Form Card */}
        <motion.div variants={cardVariants} className="lg:col-span-6">
          <div className="bg-text-light-primary text-text-dark-primary rounded-[28px] sm:rounded-CARD-lg p-8 sm:p-12 border border-black/10 shadow-2xl relative">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-black/5 rounded-xl border border-black/10 mb-8 font-mono text-xs">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg font-bold tracking-wider transition-all uppercase bg-text-dark-primary text-text-light-primary shadow-sm"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => navigate("/auth/register", { replace: true })}
                className="flex-1 py-2.5 rounded-lg font-bold tracking-wider transition-all uppercase text-text-dark-secondary hover:text-text-dark-primary"
              >
                Sign up
              </button>
            </div>

            {/* Google OAuth */}
            <div className="grid mb-6">
              <motion.button
                type="button"
                disabled={isGoogleLoading || loginLoading}
                onClick={() => googleAuth()}
                className="py-3 px-4 rounded-xl bg-white border border-black/15 hover:border-black/30 text-xs font-bold font-mono text-text-dark-primary transition-all shadow-sm hover:shadow disabled:opacity-60"
                whileHover={isGoogleLoading ? undefined : "hover"}
              >
                <motion.span
                  variants={{
                    hover: { scale: 1.05 },
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  {isGoogleLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      <span className="scale-80">
                        <img
                          src="/google-stroke-rounded.svg"
                          alt="Google logo"
                          width={18}
                          height={18}
                        />
                      </span>
                      Google SSO
                    </>
                  )}
                </motion.span>
              </motion.button>
              {googleError && (
                <p
                  role="alert"
                  className="text-red-500 font-mono text-xs mt-2 pl-2"
                >
                  {googleError}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-6">
              <div className="grow border-t border-black/10" />
              <span className="shrink mx-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-light-muted">
                Or With Email
              </span>
              <div className="grow border-t border-black/10" />
            </div>

            {/* Credential Form */}
            <form
              onSubmit={handleSubmitLoginForm}
              className="space-y-4"
              noValidate
            >
              {(validationError || loginError) && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-mono text-xs"
                >
                  {validationError || loginError}
                </div>
              )}

              <div>
                <label
                  htmlFor="work-email"
                  className="block text-[11px] font-bold tracking-wider uppercase text-text-dark-secondary mb-1 font-mono"
                >
                  Work Email Address
                </label>
                <input
                  id="work-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-black/15 focus:border-[#FF5A5F] rounded-xl px-3.5 py-3 text-sm text-text-dark-primary placeholder-neutral font-mono focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="account-password"
                    className="block text-[11px] font-bold tracking-wider uppercase text-text-dark-secondary font-mono"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/auth/forgot-password")}
                    className="text-xs font-mono text-text-dark-secondary hover:text-coral transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="account-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-black/15 focus:border-[#FF5A5F] rounded-xl px-3.5 py-3 pr-10 text-sm text-text-dark-primary placeholder-neutral font-mono focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dark-muted hover:text-text-dark-primary p-1"
                  >
                    {showPassword ? (
                      <EyeClosed size={16} strokeWidth={1.5} />
                    ) : (
                      <Eye size={16} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  text={loginLoading ? "Signing in..." : "Sign In to Console"}
                  disabled={loginLoading}
                />
              </div>
            </form>

            <div className="mt-8 pt-4 border-t border-black/10 text-center text-[11px] font-mono text-text-dark-muted">
              By continuing you agree to MonitorPulse&apos;s Terms of Service
              and SOC2 Privacy Standards.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LoginPage;
