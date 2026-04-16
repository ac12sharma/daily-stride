interface Props {
  goal: number;
  onChange: (goal: number) => void;
}

const GOALS = [5000, 8000, 10000, 15000];

export default function GoalSetter({ goal, onChange }: Props) {
  return (
    <div className="flex gap-2 justify-center">
      {GOALS.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`px-4 py-2 rounded-full text-xs font-semibold press-effect transition-colors ${
            goal === g
              ? "bg-primary text-primary-foreground"
              : "glass-card text-muted-foreground"
          }`}
        >
          {(g / 1000).toFixed(0)}K
        </button>
      ))}
    </div>
  );
}
