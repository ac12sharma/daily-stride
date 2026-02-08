import { motion } from "framer-motion";

interface StepRingProps {
  progress: number;
  steps: number;
  goal: number;
  goalReached: boolean;
}

export function StepRing({ progress, steps, goal, goalReached }: StepRingProps) {
  const size = 280;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={goalReached ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-5xl font-bold tracking-tight ${goalReached ? "text-gradient" : "text-foreground"}`}
          key={steps}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {steps.toLocaleString()}
        </motion.span>
        <span className="text-sm text-muted-foreground mt-1">
          / {goal.toLocaleString()} steps
        </span>
        {goalReached && (
          <motion.span
            className="text-xs font-semibold text-primary mt-2 uppercase tracking-widest"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Goal Complete
          </motion.span>
        )}
      </div>
    </div>
  );
}
