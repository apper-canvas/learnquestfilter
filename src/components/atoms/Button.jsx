import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 hover:-translate-y-1 focus:ring-primary",
    secondary: "bg-gradient-to-r from-secondary to-info text-white hover:shadow-lg hover:scale-105 hover:-translate-y-1 focus:ring-secondary",
    accent: "bg-gradient-to-r from-accent to-warning text-gray-800 hover:shadow-lg hover:scale-105 hover:-translate-y-1 focus:ring-accent",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-105",
    ghost: "text-primary hover:bg-primary/10 hover:scale-105",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 24 : 20} className="mr-2" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;