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
      <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
        Rewards
      </h2>
      <div className="grid gap-2.5">
        {rewards.map((reward, i) => {
          const isNext = !reward.unlocked && (i === 0 || rewards[i - 1].unlocked);
          const daysLeft = reward.requiredStreak - currentStreak;

          return (
            <motion.div
              key={reward.id}
              className={`rounded-2xl p-4 flex items-center gap-4 press-effect ${
                reward.unlocked
                  ? "glass-card glow-primary"
                  : "glass-card"
              }`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative ${
                  reward.unlocked ? "" : ""
                }`}
                style={{
                  background: reward.unlocked
                    ? "hsla(82,85%,55%,0.12)"
                    : "hsla(0,0%,100%,0.04)",
                }}
              >
                {reward.unlocked ? (
                  <motion.span
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {reward.icon}
                  </motion.span>
                ) : (
                  <div className="relative flex items-center justify-center">
                    <span className="blur-locked text-lg">{reward.icon}</span>
                    <Lock className="absolute h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${reward.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {reward.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {reward.unlocked
                    ? "Unlocked ✓"
                    : isNext
                      ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} to go`
                      : reward.description}
                </p>
              </div>

              {reward.unlocked && (
                <motion.div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "hsla(82,85%,55%,0.15)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 * i }}
                >
                  <span className="text-xs font-bold text-primary">✓</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
