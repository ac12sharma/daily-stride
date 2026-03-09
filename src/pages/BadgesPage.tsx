import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import { useBadges, BADGE_DEFINITIONS } from "@/hooks/useBadges";

export default function BadgesPage() {
  const { unlockedBadgeIds, loading } = useBadges();

  return (
    <div className="min-h-screen app-bg px-5 pt-14 pb-28 max-w-md mx-auto select-none">
      <motion.h1
        className="font-display text-xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Badges
      </motion.h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {BADGE_DEFINITIONS.map((badge, i) => {
            const unlocked = unlockedBadgeIds.has(badge.id);
            return (
              <motion.div
                key={badge.id}
                className={`rounded-2xl p-4 flex flex-col items-center gap-2 text-center press-effect ${
                  unlocked ? "glass-card-elevated glow-primary" : "glass-card"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.03 * i }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl relative"
                  style={{
                    background: unlocked
                      ? "hsla(82,85%,55%,0.1)"
                      : "hsla(220,20%,100%,0.03)",
                  }}
                >
                  {unlocked ? (
                    <motion.span
                      initial={{ scale: 0.5, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {badge.icon}
                    </motion.span>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <span className="blur-locked text-2xl">{badge.icon}</span>
                      <Lock className="absolute h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className={`text-[11px] font-semibold leading-tight ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {badge.title}
                </p>
                <p className="text-[9px] text-muted-foreground leading-tight">
                  {badge.description}
                </p>
                {unlocked && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
