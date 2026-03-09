import { motion } from "framer-motion";
import { Flame, Trophy, TrendingUp } from "lucide-react";

interface StreakBadgeProps {
  icon: "flame" | "trophy" | "percent";
  value: number;
  label: string;
  accentVar: string;
}

const icons = {
  flame: Flame,
  trophy: Trophy,
  percent: TrendingUp,
};

export function StreakBadge({ icon, value, label, accentVar }: StreakBadgeProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      className="glass-card-elevated rounded-2xl p-4 flex flex-col items-center gap-2 press-effect card-hover"
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `hsla(${accentVar.startsWith('--') ? `var(${accentVar})` : accentVar}, 0.1)` }}
      >
        <Icon
          className="h-4.5 w-4.5"
          style={{ color: `hsl(${accentVar.startsWith('--') ? `var(${accentVar})` : accentVar})` }}
        />
      </div>
      <motion.span
        className="font-display text-2xl font-bold text-foreground leading-none"
        key={value}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
      >
        {icon === "percent" ? `${value}%` : value}
      </motion.span>
      <span className="text-[9px] text-muted-foreground uppercase tracking-[0.18em] font-semibold">
        {label}
      </span>
    </motion.div>
  );
}
