import { motion } from "motion/react";
import Button from "../components/Button";

const MainHero = () => {
  return (
    <section className="relative pt-18 md:pt-46 md:pb-32 px-6 lg:px-12 max-w-7xl mx-auto border-b border-border-dark-subtle">
      <button className="uppercase flex gap-2 items-center border border-coral-subtle bg-coral-glow py-1 px-3 rounded-pill mb-12">
        <motion.span
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-coral"
        />
        <span className="text-coral-hover font-display text-[11px] font-bold tracking-[0.25em]">
          API Monitoring Platform
        </span>
      </button>
      <div>
        <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-[0.95] text-[#F5F3EE] mb-8 md:mb-10 text-balance font-display">
          Know when
          <br />
          your APIs
          <br />
          <span className="text-coral">go down.</span>
        </h1>
        <p className="text-lg sm:text-xl text-text-light-secondary leading-relaxed max-w-2xl font-normal mb-10 md:mb-14">
          Monitor uptime, latency and incidents from one place. PulseCheck
          checks your endpoints automatically and tells you when something
          changes.
        </p>
        <Button />
      </div>
    </section>
  );
};

export default MainHero;
