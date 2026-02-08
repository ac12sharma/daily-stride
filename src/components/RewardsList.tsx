import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Reward } from "@/hooks/useStepTracker";

interface RewardsListProps {
  rewards: Reward[];
  currentStreak: number;
}

export function RewardsList({ rewards, currentStreak }: RewardsListProps) {
  return (
    <div className="w-full space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest px-1">
        Rewards
      </h2>
      <div className="grid gap-3">
        {rewards.map((reward, i) => {
          const isNext = !reward.unlocked && (i === 0 || rewards[i - 1].unlocked);
          const daysLeft = reward.requiredStreak - currentStreak;

          return (
            <motion.div
              key={reward.id}
              className={`rounded-2xl p-4 flex items-center gap-4 transition-colors ${
                reward.unlocked
                  ? "bg-card border border-primary/20"
                  : "bg-card/50 border border-border"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  reward.unlocked ? "bg-primary/10" : "bg-muted"
                }`}
              >
                {reward.unlocked ? reward.icon : <Lock className="h-5 w-5 text-muted-foreground" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${reward.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {reward.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {reward.unlocked
                    ? "Unlocked!"
                    : isNext
                      ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} to go`
                      : reward.description}
                </p>
              </div>

              {reward.unlocked && (
                <span className="text-xs font-bold text-primary uppercase">✓</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
