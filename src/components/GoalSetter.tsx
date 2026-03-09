import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check } from "lucide-react";

interface GoalSetterProps {
  goal: number;
  onSetGoal: (goal: number) => void;
}

const PRESETS = [5000, 8000, 10000, 15000];

export function GoalSetter({ goal, onSetGoal }: GoalSetterProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-1 press-effect"
      >
        <Target className="h-3.5 w-3.5" />
        <span className="font-medium tracking-wide">Daily goal · {goal.toLocaleString()} steps</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="flex gap-2 mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => { onSetGoal(p); setOpen(false); }}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all press-effect ${
                  p === goal
                    ? "bg-primary text-primary-foreground glow-primary-strong"
                    : "glass-card text-secondary-foreground hover:bg-secondary"
                }`}
              >
                {p === goal && <Check className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />}
                {(p / 1000).toFixed(0)}k
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
