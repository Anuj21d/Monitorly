import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

type ButtonProps = {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
};

const Button = ({ className = "", type = "button" }: ButtonProps) => {
  return (
    <motion.button
      className={`group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-control text-sm font-bold tracking-wider uppercase bg-coral text-white hover:bg-coral-hover transition-all shadow-lg shadow-[#FF5A5F]/15 active:scale-[0.98] font-mono ${className}`}
      whileHover="hover"
      type={type}
    >
      <span>Start Monitoring </span>
      <motion.span
        variants={{
          hover: { x: 4 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <ArrowRight size={16} strokeWidth={2} />
      </motion.span>
    </motion.button>
  );
};

export default Button;
