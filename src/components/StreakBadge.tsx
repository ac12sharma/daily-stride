import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  value: number | string;
  label: string;
  color?: string;
}

export default function StreakBadge({ icon, value, label, color }: Props) {
  return (
    <motion.div
      className="glass-card rounded-2xl p-4 flex flex-col items-center gap-1 press-effect"
      whileTap={{ scale: 0.96 }}
    >
      <span className="text-lg">{icon}</span>
      <motion.span
        className="font-display text-xl font-bold"
        style={{ color }}
        key={String(value)}
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {value}
      </motion.span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}
