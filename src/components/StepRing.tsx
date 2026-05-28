import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface Props {
  steps: number;
  goal: number;
  goalReached: boolean;
}

export default function StepRing({ steps, goal, goalReached }: Props) {
  const progress = Math.min(steps / goal, 1);
  const radius = 110;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const hasConfettied = useRef(false);

  useEffect(() => {
    if (goalReached && !hasConfettied.current) {
      hasConfettied.current = true;
      const today = new Date().toISOString().split("T")[0];
      const storageKey = `stride_confetti_${today}`;
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, "1");
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.4 },
          colors: ["#a3e635", "#22d3ee", "#facc15"],
        });
      }
    }
  }, [goalReached]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow */}
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(82 85% 55% / ${0.06 + progress * 0.12}) 0%, transparent 70%)`,
        }}
      />

      <svg width="260" height="260" className="transform -rotate-90">
        {/* Track */}
        <circle
          cx="130"
          cy="130"
          r={radius}
          fill="none"
          stroke="hsl(0 0% 15%)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Progress */}
        <motion.circle
          cx="130"
          cy="130"
          r={radius}
          fill="none"
          stroke="hsl(82 85% 55%)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            filter: goalReached
              ? "drop-shadow(0 0 12px hsl(82 85% 55% / 0.6))"
              : "drop-shadow(0 0 6px hsl(82 85% 55% / 0.3))",
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="font-display text-5xl font-bold text-foreground"
          key={steps}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {steps.toLocaleString()}
        </motion.span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
          steps
        </span>
      </div>
    </div>
  );
}
