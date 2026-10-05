import { Eye, EyeClosed } from "lucide-react";
import { motion } from "motion/react";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [hide, setHide] = useState("hide");
  const navigate = useNavigate();

  return (
    <section>
      <div className="max-w-7xl w-full mx-auto py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-6 space-y-8">
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
        </div>
        <div className="lg:col-span-6">
          <div className="bg-text-light-primary text-text-dark-primary rounded-[28px] sm:rounded-CARD-lg p-8 sm:p-12 border border-black/10 shadow-2xl relative">
            <div className="flex items-center gap-1 p-1 bg-black/5 rounded-xl border border-black/10 mb-8 font-mono text-xs">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg font-bold tracking-wider transition-all uppercase text-text-dark-secondary hover:text-text-dark-primary"
                onClick={() => {
                  navigate("/auth/login");
                }}
              >
                Log In
              </button>
              <button className="flex-1 py-2.5 rounded-lg font-bold tracking-wider transition-all uppercase bg-text-dark-primary text-text-light-primary shadow-sm">
                Sign up
              </button>
            </div>
            <div className="grid mb-6">
              <motion.button
                type="button"
                className="py-3 px-4 rounded-xl bg-white border border-black/15 hover:border-black/30 text-xs font-bold font-mono text-text-dark-primary transition-all shadow-sm hover:shadow"
                whileHover="hover"
              >
                <motion.span
                  variants={{
                    hover: { scale: 1.08 },
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className="scale-80">
                    <img src="/google-stroke-rounded.svg" alt="Google logo" />
                  </span>
                  Google SSO
                </motion.span>
              </motion.button>
            </div>
            <div className="relative flex py-2 items-center mb-6">
              <div className="grow border-t border-black/10"></div>
              <span className="shrink mx-4 text-[10px] font-mono uppercase tracking-[0.2em] text-text-light-muted">
                Or With Work Email
              </span>
              <div className="grow border-t border-black/10"></div>
            </div>
            <form action="" className="space-y-4">
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
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 font-mono text-sm text-text-dark-primary placeholder-neutral transition-colors focus:border-[#FF5A5F] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor=""
                  className="block text-[11px] font-bold tracking-wider uppercase text-text-dark-secondary mb-1 font-mono"
                >
                  Work Email Address
                </label>
                <input
                  required
                  placeholder="anuj@company.com"
                  type="email"
                  className="w-full bg-white border border-black/15 focus:border-[#FF5A5F] rounded-xl px-3.5 py-3 text-sm text-text-dark-primary placeholder-neutral font-mono focus:outline-none transition-colors"
                  name=""
                  id=""
                  autoComplete="off"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor=""
                    className="block text-[11px] font-bold tracking-wider uppercase text-text-dark-secondary font-mono"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-mono text-text-dark-secondary hover:text-coral transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-black/15 focus:border-[#FF5A5F] rounded-xl px-3.5 py-3 pr-10 text-sm text-text-dark-primary placeholder-neutral font-mono focus:outline-none transition-colors"
                    type={hide === "hide" ? "password" : "text"}
                    name=""
                    id=""
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dark-muted hover:text-text-dark-primary"
                    onClick={() => {
                      if (hide === "hide") {
                        setHide("unhide");
                      } else {
                        setHide("hide");
                      }
                    }}
                  >
                    {hide === "hide" ? (
                      <Eye size={16} strokeWidth={1.5} />
                    ) : (
                      <EyeClosed size={16} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <Button text="Sign In to Console" />
              </div>
            </form>
            <div className="mt-8 pt-4 border-t border-black/10 text-center text-[11px] font-mono text-text-dark-muted">
              By continuing you agree to MonitorPulse's Terms of Service and
              SOC2 Privacy Standards.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
