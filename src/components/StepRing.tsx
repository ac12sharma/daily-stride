import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

interface StepRingProps {
  progress: number;
  steps: number;
  goal: number;
  goalReached: boolean;
}

export function StepRing({ progress, steps, goal, goalReached }: StepRingProps) {
  const size = 280;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const prevGoalReached = useRef(goalReached);
  const [showCelebration, setShowCelebration] = useState(false);
  const nearGoal = progress >= 0.85 && !goalReached;

  useEffect(() => {
    if (goalReached && !prevGoalReached.current) {
      setShowCelebration(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.4, x: 0.5 },
        colors: ["#a3e635", "#84cc16", "#65a30d", "#ffffff", "#fbbf24"],
        gravity: 1.1,
        scalar: 0.9,
        ticks: 150,
      });
      setTimeout(() => setShowCelebration(false), 2500);
    }
    prevGoalReached.current = goalReached;
  }, [goalReached]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className={`-rotate-90 ${goalReached ? "glow-pulse" : nearGoal ? "pulse-ring-animation" : ""}`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
          opacity={0.4}
        />
        {/* Secondary faint glow track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          opacity={0.04}
          strokeDasharray={circumference}
          strokeDashoffset={0}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Glow overlay for the progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGlow)"
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          opacity={0.15}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(82 85% 50%)" />
            <stop offset="50%" stopColor="hsl(82 90% 60%)" />
            <stop offset="100%" stopColor="hsl(82 95% 72%)" />
          </linearGradient>
          <linearGradient id="ringGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(82 85% 55%)" />
            <stop offset="100%" stopColor="hsl(82 95% 72%)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-display text-[56px] font-bold tracking-tight leading-none ${goalReached ? "text-gradient" : "text-foreground"}`}
          key={steps}
          initial={{ scale: 1.06, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
        >
          {steps.toLocaleString()}
        </motion.span>
        <span className="text-[11px] text-muted-foreground mt-1 font-medium tracking-widest uppercase">
          of {goal.toLocaleString()}
        </span>

        <AnimatePresence>
          {goalReached && (
            <motion.div
              className="flex items-center gap-1 mt-3 px-3 py-1 rounded-full"
              style={{ background: "hsla(82,85%,55%,0.1)" }}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">
                🎯 Goal Reached
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration flash */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsla(82,85%,55%,0.15) 0%, transparent 55%)",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
