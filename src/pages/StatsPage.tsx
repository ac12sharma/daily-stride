import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useStats } from "@/hooks/useStats";

export default function StatsPage() {
  const { weekData, totalSteps, avgSteps, loading } = useStats();

  const chartData = weekData.map((d) => ({
    day: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
    steps: d.steps,
    goal: d.goal,
    reached: d.steps >= d.goal,
  }));

  return (
    <div className="min-h-dvh app-bg px-5 pt-14 pb-28 max-w-md mx-auto select-none">
      <motion.h1
        className="font-display text-xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Statistics
      </motion.h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chart */}
          <div className="glass-card rounded-2xl p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-4">
              Last 7 Days
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(0 0% 55%)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.reached
                          ? "hsl(82 85% 55%)"
                          : "hsl(0 0% 25%)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">
                {totalSteps.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Total Steps
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">
                {avgSteps.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Daily Average
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
