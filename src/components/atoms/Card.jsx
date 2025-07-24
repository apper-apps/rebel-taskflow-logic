import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  hover = true,
  gradient = false,
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-lg",
        hover && "hover:shadow-xl transition-shadow duration-200",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        className
      )}
      whileHover={hover ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = "Card";

export default Card;