import { ArrowUpRight } from "lucide-react";
import PageContainer from "./PageContainer";
import { motion } from "motion/react";

type NavItem = {
  path: string;
  name: string;
};

const navLink: NavItem[] = [
  {
    path: "#product",
    name: "Product",
  },
  {
    path: "#features",
    name: "Features",
  },
  {
    path: "#example",
    name: "Demo API",
  },
];

const MarketingNavbar = () => {
  return (
    <nav className="fixed top-0 flex h-20 w-full items-center justify-between bg-canvas font-body border-b border-border-dark-medium z-10">
      <PageContainer className="flex justify-between items-center w-full">
        <div className="flex justify-between items-center gap-30">
          <motion.div
            whileHover={{ rotate: 1.5 }}
            className="font-extrabold tracking-tighter text-xl leading-none text-[#F5F3EE] flex flex-col"
          >
            <span className="text-text-light-primary font-display font-bold tracking-[-0.05em] ">
              Monitor
            </span>
            <span className="text-coral font-display font-bold hover:text-text-light-primary tracking-[-0.05em]">
              Plus
            </span>
          </motion.div>
          <div className="flex gap-8 items-center justify-center">
            <div className="flex items-center gap-8">
              {navLink.map((nav) => (
                <a
                  key={nav.path}
                  href={nav.path}
                  className="text-sm text-text-light-secondary transition-colors hover:text-text-light-primary font-semibold"
                >
                  {nav.name}
                </a>
              ))}
            </div>
            <button className="flex items-center gap-2 rounded-control border border-border-dark-medium px-3 py-1.5 font-mono text-[12px] text-text-light-secondary">
              <motion.span
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1.3,
                  ease: "easeOut",
                  repeat: Infinity,
                }}
                className="h-2 w-2 rounded-full bg-healthy"
              />
              <span>All System Working</span>
            </button>
          </div>
        </div>
        <div className="flex gap-10">
          <button className="font-mono uppercase text-text-light-secondary text-sm hover:text-text-light-primary font-semibold">
            Login
          </button>
          <motion.button
            className="group flex items-center justify-between gap-1 rounded-control bg-coral px-4 py-2 font-mono text-sm uppercase tracking-tighter text-text-light-primary hover:bg-coral-hover"
            whileHover="hover"
          >
            Get started
            <motion.span
              variants={{
                hover: { y: -2, x: 2 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </motion.span>
          </motion.button>
        </div>
      </PageContainer>
    </nav>
  );
};

export default MarketingNavbar;
