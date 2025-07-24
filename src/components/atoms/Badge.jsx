import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  size = "md",
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-700",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-700",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-700",
    urgent: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md",
    high: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700",
    medium: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700",
    low: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
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