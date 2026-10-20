import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main className="min-h-screen bg-canvas p-6 sm:p-10 flex flex-col">
      <motion.section
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <nav className="max-w-7xl w-full mx-auto flex items-center justify-between pb-8 border-b border-white/8">
          <motion.button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-neutral hover:text-text-light-primary transition-colors"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              variants={{
                hover: { x: -4 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </motion.span>

            <span>Back To Overview</span>
          </motion.button>

          <motion.div
            className="font-extrabold tracking-tighter text-xl leading-none text-text-light-primary flex flex-col text-right"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
          >
            <span>Monitor</span>
            <span className="text-coral">Pulse</span>
          </motion.div>
        </nav>
      </motion.section>

      <div className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Outlet />
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-7xl w-full mx-auto pt-6 border-t border-white/6 text-xs font-mono text-text-dark-secondary flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>© 2026 MonitorPulse Infrastructure Inc.</div>
          <div>Encrypted TLS 1.3 · SAML 2.0 & OIDC Compatible</div>
        </div>
      </motion.footer>
    </main>
  );
};

export default AuthPage;
