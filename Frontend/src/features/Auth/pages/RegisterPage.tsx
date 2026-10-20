import { Eye, EyeClosed } from "lucide-react";
import { motion } from "motion/react";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import { apiClient, useAuth } from "../AuthContext";
import { registerSchema } from "../schemas/authSchemas";
import axios from "axios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};


const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { refreshUser } = useAuth();
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  const {
    googleAuth,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuth(async () => {
    await refreshUser();
    navigate("/dashboard");
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmitRegisterForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError(null);

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      setValidationError(
        result.error.issues[0]?.message ?? "Invalid registration data",
      );
      return;
    }

    try {
      setRegisterLoading(true);

      await apiClient.post("/api/auth/register", {
        username: `${result.data.firstName} ${result.data.lastName}`,
        email: result.data.email,
        password: result.data.password,
      });

      await refreshUser();
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setValidationError(
          err.response?.data?.message ?? "Failed to create account.",
        );
      } else {
        setValidationError("Something went wrong. Please try again.");
      }
    } finally {
      setRegisterLoading(false);
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
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.98] text-[#F5F3EE] text-balance font-display">
            Join the
            <br />
            new standard
            <br />
            <span className="text-coral">in monitoring.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-light-secondary leading-relaxed max-w-lg font-mono">
            Deploy edge probes in seconds. Monitor uptime, p99 latency
            regressions, and trigger zero-false-positive alerts for your
            engineering team.
          </p>
        </motion.div>

        {/* Right Form Card */}
        <motion.div variants={cardVariants} className="lg:col-span-6">
          <div className="bg-text-light-primary text-text-dark-primary rounded-[28px] sm:rounded-CARD-lg p-8 sm:p-12 border border-black/10 shadow-2xl relative">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-black/5 rounded-xl border border-black/10 mb-8 font-mono text-xs">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg font-bold tracking-wider transition-all uppercase text-text-dark-secondary hover:text-text-dark-primary"
                onClick={() => navigate("/auth/login")}
              >
                Log In
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg font-bold tracking-wider transition-all uppercase bg-text-dark-primary text-text-light-primary shadow-sm"
              >
                Sign up
              </button>
            </div>

            {/* Google OAuth */}
            <div className="grid mb-6">
              <motion.button
                type="button"
                disabled={isGoogleLoading || registerLoading}
                onClick={() => googleAuth()}
                className="py-3 px-4 rounded-xl bg-white border border-black/15 hover:border-black/30 text-xs font-bold font-mono text-text-dark-primary transition-all shadow-sm hover:shadow disabled:opacity-60"
                whileHover={isGoogleLoading ? undefined : "hover"}
              >
                <motion.span
                  variants={{ hover: { scale: 1.05 } }}
                  className="flex items-center justify-center gap-2"
                >
                  {isGoogleLoading ? (
                    "Signing Up..."
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
                Or With Work Email
              </span>
              <div className="grow border-t border-black/10" />
            </div>

            {/* Registration Form */}
            <form
              onSubmit={handleSubmitRegisterForm}
              className="space-y-4"
              noValidate
            >
              {validationError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-mono text-xs"
                >
                  {validationError}
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="mb-1 block font-mono text-[11px] font-bold uppercase tracking-wider text-text-dark-secondary"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder="Anuj"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 font-mono text-sm text-text-dark-primary placeholder-neutral transition-colors focus:border-[#FF5A5F] focus:outline-none"
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="mb-1 block font-mono text-[11px] font-bold uppercase tracking-wider text-text-dark-secondary"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    placeholder="Dandavate"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 font-mono text-sm text-text-dark-primary placeholder-neutral transition-colors focus:border-[#FF5A5F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="workEmail"
                  className="block text-[11px] font-bold tracking-wider uppercase text-text-dark-secondary mb-1 font-mono"
                >
                  Work Email Address
                </label>
                <input
                  id="workEmail"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="anuj@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-black/15 focus:border-[#FF5A5F] rounded-xl px-3.5 py-3 text-sm text-text-dark-primary placeholder-neutral font-mono focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="registerPassword"
                  className="block text-[11px] font-bold tracking-wider uppercase text-text-dark-secondary font-mono mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="registerPassword"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
                  text={
                    registerLoading ? "Creating account..." : "Create Account"
                  }
                  disabled={registerLoading}
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

export default RegisterPage;
