import { Eye, EyeClosed } from "lucide-react";
import { motion } from "motion/react";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [hide, setHide] = useState("hide");

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
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.98] text-text-light-primary text-balance font-display">
            Your APIs
            <br />
            Always
            <br />
            <span className="text-coral">visible.</span>
          </h1>
          <p className="text-base sm:text-lg text-text-light-secondary leading-relaxed max-w-lg font">
            Access real-time telemetry, active incident root-causes, and
            multi-region synthetic heartbeats in one unified console.
          </p>
        </div>
        <div className="lg:col-span-6">
          <div className="bg-text-light-primary text-text-dark-primary rounded-[28px] sm:rounded-CARD-lg p-8 sm:p-12 border border-black/10 shadow-2xl relative">
            <div className="flex items-center gap-1 p-1 bg-black/5 rounded-xl border border-black/10 mb-8 font-mono text-xs">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg font-bold tracking-wider transition-all uppercase bg-text-dark-primary text-text-light-primary shadow-sm"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  navigate("/auth/register");
                }}
                className="flex-1 py-2.5 rounded-lg font-bold tracking-wider transition-all uppercase text-text-dark-secondary hover:text-text-dark-primary"
              >
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
              <div>
                <label
                  htmlFor=""
                  className="block text-[11px] font-bold tracking-wider uppercase text-text-dark-secondary mb-1 font-mono"
                >
                  Work Email Address
                </label>
                <input
                  required
                  placeholder="alex@company.com"
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

export default LoginPage;
