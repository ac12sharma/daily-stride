import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  bestStreak: number;
}

export function StreakBadge({ streak, bestStreak }: StreakBadgeProps) {
  return (
    <div className="flex gap-3 w-full">
      <motion.div
        className="flex-1 rounded-2xl glass-card p-5 flex flex-col items-center gap-2 press-effect card-hover"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsla(40,95%,55%,0.12)" }}>
          <Flame className="h-5 w-5 text-streak" />
        </div>
        <motion.span
          className="text-3xl font-extrabold text-foreground"
          key={streak}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {streak}
        </motion.span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">
          Day Streak
        </span>
      </motion.div>

      <motion.div
        className="flex-1 rounded-2xl glass-card p-5 flex flex-col items-center gap-2 press-effect card-hover"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsla(0,0%,100%,0.06)" }}>
          <span className="text-lg">🏅</span>
        </div>
        <motion.span
          className="text-3xl font-extrabold text-foreground"
          key={bestStreak}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {bestStreak}
        </motion.span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">
          Best Streak
        </span>
      </motion.div>
    </div>
  );
}
