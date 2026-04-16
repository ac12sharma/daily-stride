import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";

const REWARDS = [
  { streak: 1, icon: "👟", title: "First Step", desc: "Complete 1 goal" },
  { streak: 3, icon: "🔥", title: "Consistent", desc: "3-day streak" },
  { streak: 7, icon: "⚡", title: "Momentum", desc: "7-day streak" },
  { streak: 14, icon: "💪", title: "Discipline", desc: "14-day streak" },
  { streak: 30, icon: "🏆", title: "Champion", desc: "30-day streak" },
];

interface Props {
  streak: number;
}

export default function RewardsList({ streak }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider text-center">
        Rewards
      </p>
      <div className="grid grid-cols-2 gap-3">
        {REWARDS.map((r, i) => {
          const unlocked = streak >= r.streak;
          return (
            <motion.div
              key={r.streak}
              className={`relative rounded-2xl p-4 press-effect ${
                unlocked ? "glass-card-elevated shimmer" : "glass-card"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className={unlocked ? "" : "blur-locked"}>
                <span className="text-2xl">{r.icon}</span>
                <p className="text-sm font-semibold text-foreground mt-2">
                  {r.title}
                </p>
                <p className="text-[10px] text-muted-foreground">{r.desc}</p>
              </div>
              {!unlocked && (
                <Lock className="absolute top-3 right-3 h-4 w-4 text-muted-foreground" />
              )}
              {unlocked && (
                <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-primary" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
