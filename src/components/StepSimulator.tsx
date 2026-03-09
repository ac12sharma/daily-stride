import { Footprints } from "lucide-react";

interface StepSimulatorProps {
  onAddSteps: (amount: number) => void;
}

export function StepSimulator({ onAddSteps }: StepSimulatorProps) {
  return (
    <div className="w-full">
      <p className="text-[10px] text-muted-foreground mb-2 px-1 uppercase tracking-[0.15em] font-semibold">
        Simulate steps
      </p>
      <div className="flex gap-2">
        {[500, 1000, 2500].map(amount => (
          <button
            key={amount}
            onClick={() => onAddSteps(amount)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-2xl glass-card text-sm font-semibold text-secondary-foreground press-effect card-hover"
          >
            <Footprints className="h-4 w-4" />
            +{amount.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
