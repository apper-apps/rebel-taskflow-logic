import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
title = "Qualcosa è andato storto", 
  message = "Abbiamo riscontrato un errore durante il caricamento dei tuoi dati. Riprova.",
  onRetry,
  type = "default"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-error to-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
<span>Riprova</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;