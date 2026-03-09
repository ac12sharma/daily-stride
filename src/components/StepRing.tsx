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
  const size = 260;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const prevGoalReached = useRef(goalReached);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (goalReached && !prevGoalReached.current) {
      setShowCelebration(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.45, x: 0.5 },
        colors: ["#a3e635", "#84cc16", "#65a30d", "#ffffff"],
        gravity: 1.2,
        scalar: 0.8,
        ticks: 120,
      });
      setTimeout(() => setShowCelebration(false), 2000);
    }
    prevGoalReached.current = goalReached;
  }, [goalReached]);

  const pct = Math.round(progress * 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow behind ring */}
      {goalReached && (
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsla(82,85%,55%,0.25) 0%, transparent 70%)",
          }}
        />
      )}

      <svg
        width={size}
        height={size}
        className={`-rotate-90 ${goalReached ? "glow-pulse" : ""}`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          opacity={0.5}
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
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(82 85% 55%)" />
            <stop offset="100%" stopColor="hsl(82 90% 72%)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-5xl font-extrabold tracking-tight ${goalReached ? "text-gradient" : "text-foreground"}`}
          key={steps}
          initial={{ scale: 1.08, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {steps.toLocaleString()}
        </motion.span>
        <span className="text-xs text-muted-foreground mt-1 font-medium tracking-wide uppercase">
          of {goal.toLocaleString()} steps
        </span>
        <div className="mt-2 text-xs font-semibold text-muted-foreground">{pct}%</div>

        <AnimatePresence>
          {goalReached && (
            <motion.span
              className="text-[11px] font-bold text-primary mt-2 uppercase tracking-[0.2em]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              🎯 Goal Reached
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration flash */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(82,85%,55%,0.2) 0%, transparent 60%)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
