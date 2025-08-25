import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    error: "bg-error/10 text-error border border-error/20",
    info: "bg-info/10 text-info border border-info/20",
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20"
  };

  return (
    <span
      className={cn(
        "status-badge inline-flex items-center",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;