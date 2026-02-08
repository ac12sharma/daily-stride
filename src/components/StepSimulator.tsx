import { Footprints } from "lucide-react";

interface StepSimulatorProps {
  onAddSteps: (amount: number) => void;
}

export function StepSimulator({ onAddSteps }: StepSimulatorProps) {
  return (
    <div className="w-full">
      <p className="text-xs text-muted-foreground mb-2 px-1">Simulate steps (demo only)</p>
      <div className="flex gap-2">
        {[500, 1000, 2500].map(amount => (
          <button
            key={amount}
            onClick={() => onAddSteps(amount)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-card text-sm font-medium text-secondary-foreground hover:bg-secondary transition-colors"
          >
            <Footprints className="h-4 w-4" />
            +{amount.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
