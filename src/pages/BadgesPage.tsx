import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import { useBadges } from "@/hooks/useBadges";

export default function BadgesPage() {
  const { badges, loading } = useBadges();

  return (
    <div className="min-h-dvh app-bg px-5 pt-14 pb-28 max-w-md mx-auto select-none">
      <motion.h1
        className="font-display text-xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Badge Gallery
      </motion.h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              className={`relative rounded-2xl p-4 flex flex-col items-center text-center press-effect ${
                badge.unlocked ? "glass-card-elevated" : "glass-card"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className={badge.unlocked ? "" : "blur-locked"}>
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-xs font-semibold text-foreground mt-2">
                  {badge.name}
                </p>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  {badge.desc}
                </p>
              </div>
              {!badge.unlocked && (
                <Lock className="absolute top-2 right-2 h-3.5 w-3.5 text-muted-foreground" />
              )}
              {badge.unlocked && (
                <CheckCircle2 className="absolute top-2 right-2 h-3.5 w-3.5 text-primary" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
