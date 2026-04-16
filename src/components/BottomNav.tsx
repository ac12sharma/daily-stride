import { NavLink } from "react-router-dom";
import { Home, Trophy, Award, BarChart3, Users } from "lucide-react";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/leaderboard", icon: Trophy, label: "Ranks" },
  { to: "/friends", icon: Users, label: "Friends" },
  { to: "/badges", icon: Award, label: "Badges" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card-elevated safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 press-effect transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
