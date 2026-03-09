import { NavLink, useLocation } from "react-router-dom";
import { Home, Trophy, Award, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/leaderboard", icon: Trophy, label: "Ranks" },
  { to: "/badges", icon: Award, label: "Badges" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div className="glass-card-elevated border-t border-border/50 px-2 pt-2 pb-6 flex justify-around">
          {tabs.map(tab => {
            const active = location.pathname === tab.to;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
              >
                {active && (
                  <motion.div
                    className="absolute -top-2 w-5 h-0.5 rounded-full bg-primary"
                    layoutId="tab-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={`h-5 w-5 transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-[9px] font-semibold tracking-wide transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
