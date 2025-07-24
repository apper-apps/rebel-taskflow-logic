import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg focus:ring-primary-500",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md hover:shadow-lg focus:ring-accent-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };
  
  return (
    <motion.button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;