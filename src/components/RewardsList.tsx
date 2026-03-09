import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import type { Reward } from "@/hooks/useStepTracker";

interface RewardsListProps {
  rewards: Reward[];
  currentStreak: number;
}

export function RewardsList({ rewards, currentStreak }: RewardsListProps) {
  return (
    <div className="w-full space-y-3">
      <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.22em] px-1">
        Achievements
      </h2>
      <div className="grid gap-2.5">
        {rewards.map((reward, i) => {
          const isNext = !reward.unlocked && (i === 0 || rewards[i - 1].unlocked);
          const daysLeft = reward.requiredStreak - currentStreak;

          return (
            <motion.div
              key={reward.id}
              className={`rounded-2xl p-4 flex items-center gap-4 press-effect relative overflow-hidden ${
                reward.unlocked
                  ? "glass-card-elevated glow-primary"
                  : "glass-card"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Shimmer on unlocked */}
              {reward.unlocked && (
                <div className="absolute inset-0 shimmer pointer-events-none" />
              )}

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl relative shrink-0"
                style={{
                  background: reward.unlocked
                    ? "hsla(82,85%,55%,0.1)"
                    : "hsla(220,20%,100%,0.03)",
                }}
              >
                {reward.unlocked ? (
                  <motion.span
                    initial={{ scale: 0.4, rotate: -25 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  >
                    {reward.icon}
                  </motion.span>
                ) : (
                  <div className="relative flex items-center justify-center">
                    <span className="blur-locked text-lg">{reward.icon}</span>
                    <Lock className="absolute h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm leading-tight ${reward.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {reward.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {reward.unlocked
                    ? "Unlocked"
                    : isNext
                      ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} to go`
                      : reward.description}
                </p>
              </div>

              {reward.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.08 * i }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
