import { motion } from "framer-motion";
import StepRing from "@/components/StepRing";
import StreakBadge from "@/components/StreakBadge";
import GoalSetter from "@/components/GoalSetter";
import StepSimulator from "@/components/StepSimulator";
import RewardsList from "@/components/RewardsList";
import { useStepTracker } from "@/hooks/useStepTracker";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export default function HomePage() {
  const { steps, goal, streak, bestStreak, goalReached, addSteps, changeGoal } =
    useStepTracker();
  const { signOut } = useAuth();
  const progressPct = Math.min(Math.round((steps / goal) * 100), 100);

  return (
    <div className="min-h-dvh app-bg px-5 pt-14 pb-28 max-w-md mx-auto select-none">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="font-display text-2xl font-bold text-foreground"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          STRIDE
        </motion.h1>
        <button onClick={signOut} className="text-muted-foreground press-effect p-2">
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {goalReached && (
        <motion.p
          className="text-center text-primary text-sm font-semibold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🎉 Goal reached! Keep going!
        </motion.p>
      )}

      <div className="flex justify-center mb-8">
        <StepRing steps={steps} goal={goal} goalReached={goalReached} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StreakBadge icon="🔥" value={streak} label="Streak" color="hsl(35 90% 55%)" />
        <StreakBadge icon="🏆" value={bestStreak} label="Best" color="hsl(45 90% 55%)" />
        <StreakBadge icon="📊" value={`${progressPct}%`} label="Progress" color="hsl(82 85% 55%)" />
      </div>

      <div className="space-y-4 mb-6">
        <GoalSetter goal={goal} onChange={changeGoal} />
        <StepSimulator onAdd={addSteps} />
      </div>

      <RewardsList streak={streak} />
    </div>
  );
}
