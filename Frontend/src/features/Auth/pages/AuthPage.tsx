import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Outlet } from "react-router";

const AuthPage = () => {
  return (
    <main className="min-h-screen bg-canvas p-10">
      <section>
        <nav className="max-w-7xl w-full mx-auto flex items-center justify-between pb-8 border-b border-white/8">
          <motion.button
            className="group inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-neutral hover:text-text-light-primary transition-colors"
            whileHover="hover"
          >
            <motion.span
              variants={{
                hover: {
                  x: -4,
                },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </motion.span>

            <span>Back To Overview</span>
          </motion.button>
          <div className="font-extrabold tracking-tighter text-xl leading-none text-text-light-primary flex flex-col text-right">
            <span className="tracking-tighter">Monitor</span>
            <span className="tracking-tighter text-coral">Pulse</span>
          </div>
        </nav>
      </section>
      <Outlet />
      <footer>
        <div className="max-w-7xl w-full mx-auto pt-6 border-t border-white/6 text-xs font-mono text-text-dark-secondary flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>© 2026 MonitorPulse Infrastructure Inc.</div>
          <div>Encrypted TLS 1.3 · SAML 2.0 & OIDC Compatible</div>
        </div>
      </footer>
    </main>
  );
};

export default AuthPage;
