import { motion } from "framer-motion";
import { Footprints } from "lucide-react";

interface StepSimulatorProps {
  onAddSteps: (amount: number) => void;
}

export function StepSimulator({ onAddSteps }: StepSimulatorProps) {
  return (
    <div className="w-full">
      <p className="text-[9px] text-muted-foreground mb-2.5 px-1 uppercase tracking-[0.2em] font-semibold">
        Simulate steps
      </p>
      <div className="flex gap-2">
        {[500, 1000, 2500].map((amount, i) => (
          <motion.button
            key={amount}
            onClick={() => onAddSteps(amount)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl glass-card-elevated text-sm font-semibold text-secondary-foreground press-effect"
            whileTap={{ scale: 0.94 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
          >
            <Footprints className="h-4 w-4 text-primary/60" />
            +{amount >= 1000 ? `${(amount / 1000).toFixed(amount % 1000 ? 1 : 0)}k` : amount}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
