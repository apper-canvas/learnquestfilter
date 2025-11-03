import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Avatar = ({ avatarId = "1", size = "md", className = "" }) => {
  const avatars = {
    "1": { icon: "User", color: "from-primary to-secondary" },
    "2": { icon: "Smile", color: "from-secondary to-info" },
    "3": { icon: "Heart", color: "from-accent to-warning" },
    "4": { icon: "Star", color: "from-success to-secondary" },
    "5": { icon: "Zap", color: "from-warning to-primary" },
    "6": { icon: "Sparkles", color: "from-info to-accent" },
    "7": { icon: "Sun", color: "from-accent to-success" },
    "8": { icon: "Moon", color: "from-info to-primary" },
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
    xl: 40,
  };

  const avatar = avatars[avatarId] || avatars["1"];

  return (
    <div className={`${sizes[size]} bg-gradient-to-br ${avatar.color} rounded-full flex items-center justify-center shadow-lg ${className}`}>
      <ApperIcon name={avatar.icon} size={iconSizes[size]} className="text-white" />
    </div>
  );
};

export default Avatar;