import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: "Home", label: "Home", color: "text-primary" },
    { to: "/math", icon: "Calculator", label: "Math Zone", color: "text-primary" },
    { to: "/reading", icon: "BookOpen", label: "Reading Zone", color: "text-secondary" },
    { to: "/rewards", icon: "Award", label: "Rewards", color: "text-accent" },
    { to: "/profile", icon: "User", label: "Profile", color: "text-info" },
    { to: "/parent", icon: "Users", label: "Parent View", color: "text-warning" },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-primary to-secondary">
          <ApperIcon name="Sparkles" size={32} className="text-white mr-3" />
          <h1 className="text-2xl font-display text-white">LearnQuest</h1>
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <ApperIcon
                  name={item.icon}
                  size={20}
                  className={`mr-3 flex-shrink-0 ${item.color}`}
                />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;