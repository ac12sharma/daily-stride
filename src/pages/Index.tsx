import { motion } from "framer-motion";
import { StepRing } from "@/components/StepRing";
import { StreakBadge } from "@/components/StreakBadge";
import { RewardsList } from "@/components/RewardsList";
import { GoalSetter } from "@/components/GoalSetter";
import { StepSimulator } from "@/components/StepSimulator";
import { useStepTracker } from "@/hooks/useStepTracker";
import { Activity } from "lucide-react";

const Index = () => {
  const {
    steps, goal, streak, bestStreak,
    progress, goalReached, rewards,
    addSteps, setGoal,
  } = useStepTracker();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-5 pt-14 pb-12 max-w-md mx-auto select-none">
      {/* Header */}
      <motion.div
        className="flex items-center gap-2 mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Activity className="h-5 w-5 text-primary" />
        <h1 className="text-base font-extrabold tracking-[0.15em] text-foreground uppercase">
          Stride
        </h1>
      </motion.div>

      {/* Progress Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StepRing progress={progress} steps={steps} goal={goal} goalReached={goalReached} />
      </motion.div>

      {/* Content below ring */}
      <div className="w-full mt-10 space-y-6">
        <StreakBadge streak={streak} bestStreak={bestStreak} />
        <GoalSetter goal={goal} onSetGoal={setGoal} />
        <StepSimulator onAddSteps={addSteps} />

        {/* Divider */}
        <div className="w-full h-px bg-border opacity-50" />

        <RewardsList rewards={rewards} currentStreak={streak} />
      </div>
    </div>
  );
};

export default Index;
