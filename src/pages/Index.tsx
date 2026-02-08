import { motion } from "framer-motion";
import { StepRing } from "@/components/StepRing";
import { StreakBadge } from "@/components/StreakBadge";
import { RewardsList } from "@/components/RewardsList";
import { GoalSetter } from "@/components/GoalSetter";
import { StepSimulator } from "@/components/StepSimulator";
import { useStepTracker } from "@/hooks/useStepTracker";

const Index = () => {
  const {
    steps, goal, streak, bestStreak,
    progress, goalReached, rewards,
    addSteps, setGoal,
  } = useStepTracker();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10 max-w-md mx-auto">
      {/* Header */}
      <motion.h1
        className="text-lg font-bold tracking-tight text-foreground mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        STRIDE
      </motion.h1>

      {/* Progress Ring */}
      <StepRing progress={progress} steps={steps} goal={goal} goalReached={goalReached} />

      {/* Streak */}
      <div className="w-full mt-8 space-y-6">
        <StreakBadge streak={streak} bestStreak={bestStreak} />

        {/* Goal Setter */}
        <GoalSetter goal={goal} onSetGoal={setGoal} />

        {/* Simulator (for demo) */}
        <StepSimulator onAddSteps={addSteps} />

        {/* Rewards */}
        <RewardsList rewards={rewards} currentStreak={streak} />
      </div>

      {/* Footer spacer */}
      <div className="h-10" />
    </div>
  );
};

export default Index;
