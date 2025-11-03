import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/", icon: "Home", label: "Home", color: "text-primary" },
    { to: "/math", icon: "Calculator", label: "Math Zone", color: "text-primary" },
    { to: "/reading", icon: "BookOpen", label: "Reading Zone", color: "text-secondary" },
    { to: "/rewards", icon: "Award", label: "Rewards", color: "text-accent" },
    { to: "/profile", icon: "User", label: "Profile", color: "text-info" },
  ];

  const bottomNavItems = navItems.slice(0, 4); // Show first 4 in bottom nav
  const menuItems = navItems; // Show all in menu

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-primary to-secondary px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <ApperIcon name="Sparkles" size={24} className="text-white mr-2" />
          <h1 className="text-xl font-display text-white">LearnQuest</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <NavLink to="/parent" className="text-white">
            <ApperIcon name="Users" size={20} />
          </NavLink>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white"
          >
            <ApperIcon name={isOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center h-16 px-4 bg-gradient-to-r from-primary to-secondary">
                  <ApperIcon name="Sparkles" size={24} className="text-white mr-2" />
                  <h1 className="text-xl font-display text-white">LearnQuest</h1>
                </div>
                
                <nav className="flex-1 px-2 py-4 space-y-2">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
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
                  
                  <NavLink
                    to="/parent"
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-200 mt-4 pt-4"
                  >
                    <ApperIcon name="Users" size={20} className="mr-3 flex-shrink-0 text-warning" />
                    Parent Dashboard
                  </NavLink>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex justify-around">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive ? "text-primary" : "text-gray-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={isActive ? item.color : "text-gray-600"}
                  />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNav;