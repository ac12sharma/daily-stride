import { motion } from "framer-motion";
import { StepRing } from "@/components/StepRing";
import { StreakBadge } from "@/components/StreakBadge";
import { RewardsList } from "@/components/RewardsList";
import { GoalSetter } from "@/components/GoalSetter";
import { StepSimulator } from "@/components/StepSimulator";
import { useStepTracker } from "@/hooks/useStepTracker";
import { Activity, TrendingUp } from "lucide-react";

const motivationalMessages = [
  "Keep your streak alive 🔥",
  "Every step counts 💪",
  "You're building momentum ⚡",
  "Stay consistent, stay strong 🏆",
];

const Index = () => {
  const {
    steps, goal, streak, bestStreak,
    progress, goalReached, rewards,
    addSteps, setGoal,
  } = useStepTracker();

  const message = motivationalMessages[streak % motivationalMessages.length];
  const pct = Math.round(progress * 100);

  return (
    <div className="min-h-screen app-bg flex flex-col items-center px-5 pb-16 max-w-md mx-auto select-none overflow-hidden">
      {/* Status bar spacer */}
      <div className="w-full h-14" />

      {/* Header */}
      <motion.div
        className="flex flex-col items-center gap-1.5 mb-2"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-display text-lg font-bold tracking-[0.12em] text-foreground uppercase">
            Stride
          </h1>
        </div>
        <motion.p
          className="text-[11px] text-muted-foreground font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {message}
        </motion.p>
      </motion.div>

      {/* Progress Ring — hero element */}
      <motion.div
        className="relative my-6"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Ambient glow behind ring */}
        <div
          className="absolute inset-0 -m-12 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsla(82,85%,55%,${goalReached ? 0.08 : 0.03}) 0%, transparent 65%)`,
          }}
        />
        <StepRing progress={progress} steps={steps} goal={goal} goalReached={goalReached} />
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="w-full grid grid-cols-3 gap-2.5 mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <StreakBadge
          icon="flame"
          value={streak}
          label="Streak"
          accentVar="--streak-gold"
        />
        <StreakBadge
          icon="trophy"
          value={bestStreak}
          label="Best"
          accentVar="--stat-purple"
        />
        <StreakBadge
          icon="percent"
          value={pct}
          label="Progress"
          accentVar="--primary"
        />
      </motion.div>

      {/* Goal and Simulator */}
      <div className="w-full space-y-4 mb-6">
        <GoalSetter goal={goal} onSetGoal={setGoal} />
        <StepSimulator onAddSteps={addSteps} />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

      {/* Rewards */}
      <RewardsList rewards={rewards} currentStreak={streak} />
    </div>
  );
};

export default Index;
