import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function LeaderboardPage() {
  const { entries, loading } = useLeaderboard();

  const podiumColors = [
    "from-primary/20 to-primary/5",
    "from-muted/40 to-muted/10",
    "from-muted/30 to-muted/5",
  ];

  const podiumIcons = [
    <Crown className="h-5 w-5 text-yellow-400" />,
    <Medal className="h-5 w-5 text-gray-300" />,
    <Medal className="h-5 w-5 text-amber-600" />,
  ];

  return (
    <div className="min-h-screen app-bg px-5 pt-14 pb-28 max-w-md mx-auto select-none">
      <motion.h1
        className="font-display text-xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Leaderboard
      </motion.h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm mt-20">
          <Trophy className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
          <p>No activity yet today.</p>
          <p className="text-xs mt-1">Start walking to appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.user_id}
              className={`flex items-center gap-3 p-4 rounded-2xl ${
                i < 3 ? `glass-card-elevated bg-gradient-to-r ${podiumColors[i]}` : "glass-card"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {i < 3 ? podiumIcons[i] : (
                  <span className="text-muted-foreground">{i + 1}</span>
                )}
              </div>

              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground overflow-hidden">
                {entry.avatar_url ? (
                  <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  entry.display_name?.charAt(0)?.toUpperCase() || "?"
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {entry.display_name || "Anonymous"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-display text-lg font-bold text-foreground">
                  {entry.steps.toLocaleString()}
                </p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">steps</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
