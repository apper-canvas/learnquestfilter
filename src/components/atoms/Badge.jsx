import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "primary", children, ...props }, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    secondary: "bg-gradient-to-r from-secondary to-info text-white",
    accent: "bg-gradient-to-r from-accent to-warning text-gray-800",
    success: "bg-success text-white",
    warning: "bg-warning text-gray-800",
    error: "bg-error text-white",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;