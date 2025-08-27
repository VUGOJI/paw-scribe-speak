import { NavLink } from "react-router-dom";
import { Home, User, Settings, Crown } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Pets", path: "/pets" },
    { icon: Crown, label: "Premium", path: "/premium" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border/50 z-50">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "text-primary bg-primary-soft/50"
                  : "text-muted-foreground hover:text-primary"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;