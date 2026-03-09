import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Check } from "lucide-react";

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
        <Settings className="h-3.5 w-3.5" />
        <span className="font-medium">Daily goal: {goal.toLocaleString()} steps</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="flex gap-2 mt-3 flex-wrap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => { onSetGoal(p); setOpen(false); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all press-effect ${
                  p === goal
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "glass-card text-secondary-foreground hover:bg-secondary"
                }`}
              >
                {p === goal && <Check className="inline h-3.5 w-3.5 mr-1" />}
                {p.toLocaleString()}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
