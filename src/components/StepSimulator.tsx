interface Props {
  onAdd: (amount: number) => void;
}

export default function StepSimulator({ onAdd }: Props) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider text-center mb-3">
        Demo Simulator
      </p>
      <div className="flex gap-2 justify-center">
        {[500, 1000, 2500].map((n) => (
          <button
            key={n}
            onClick={() => onAdd(n)}
            className="bg-primary/10 text-primary px-4 py-2.5 rounded-xl text-sm font-semibold press-effect hover:bg-primary/20 transition-colors"
          >
            +{n.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
