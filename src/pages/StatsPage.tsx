import { motion } from "framer-motion";
import { BarChart3, Flame, TrendingUp, Calendar } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function StatsPage() {
  const { weeklyData, totalSteps, avgSteps, currentStreak, bestStreak, loading } = useStats();

  return (
    <div className="min-h-screen app-bg px-5 pt-14 pb-28 max-w-md mx-auto select-none">
      <motion.h1
        className="font-display text-xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Stats
      </motion.h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: TrendingUp, label: "Total Steps", value: totalSteps.toLocaleString(), accent: "--primary" },
              { icon: BarChart3, label: "Daily Avg", value: avgSteps.toLocaleString(), accent: "--stat-blue" },
              { icon: Flame, label: "Current Streak", value: `${currentStreak}d`, accent: "--streak-gold" },
              { icon: Calendar, label: "Best Streak", value: `${bestStreak}d`, accent: "--stat-purple" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card-elevated rounded-2xl p-4 flex flex-col gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <stat.icon className="h-4 w-4" style={{ color: `hsl(var(${stat.accent}))` }} />
                <span className="font-display text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Weekly chart */}
          <motion.div
            className="glass-card-elevated rounded-2xl p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-4">
              Last 7 Days
            </h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} steps`, ""]}
                  />
                  <Bar
                    dataKey="steps"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    opacity={0.85}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
