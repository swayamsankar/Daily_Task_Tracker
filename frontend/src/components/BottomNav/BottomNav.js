import { NavLink } from "react-router-dom";
import { Home, CheckSquare, BarChart2, Settings } from "lucide-react";

export const BottomNav = () => {
  return (
    <div className="bottom-nav">
      <NavLink to="/" className="nav-item">
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/tasks" className="nav-item">
        <CheckSquare size={22} />
        <span>Tasks</span>
      </NavLink>

      <NavLink to="/analytics" className="nav-item">
        <BarChart2 size={22} />
        <span>Stats</span>
      </NavLink>

      <NavLink to="/settings" className="nav-item">
        <Settings size={22} />
        <span>Settings</span>
      </NavLink>
    </div>
  );
};