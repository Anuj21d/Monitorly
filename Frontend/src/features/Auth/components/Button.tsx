import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

type ButtonProps = {
  text: string;
};

const Button = ({ text }: ButtonProps) => {
  return (
    <motion.button
      className="w-full group inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-xs font-bold tracking-widest uppercase bg-coral hover:bg-coral-hover text-white transition-all shadow-lg shadow-[#FF5A5F]/20 disabled:opacity-50 active:scale-[0.99]"
      whileHover="hover"
    >
      {text}
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
