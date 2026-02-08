import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  bestStreak: number;
}

export function StreakBadge({ streak, bestStreak }: StreakBadgeProps) {
  return (
    <div className="flex gap-4 w-full">
      <motion.div
        className="flex-1 rounded-2xl bg-card p-5 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Flame className="h-6 w-6 text-streak" />
        <span className="text-3xl font-bold text-foreground">{streak}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Day Streak</span>
      </motion.div>

      <motion.div
        className="flex-1 rounded-2xl bg-card p-5 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-lg">🏅</span>
        <span className="text-3xl font-bold text-foreground">{bestStreak}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Best Streak</span>
      </motion.div>
    </div>
  );
}
