import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const TaskInputBar = ({ onSubmit, placeholder = "Add task: 'Review client proposal 2 hours tomorrow urgent'" }) => {
  const [taskText, setTaskText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(taskText);
      }
      setTaskText("");
      setIsProcessing(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sticky top-4 z-10"
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            icon="MessageSquare"
            iconPosition="left"
            className="text-base py-3"
          />
          {isProcessing && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="Brain" className="w-5 h-5 text-secondary-500" />
              </motion.div>
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!taskText.trim() || isProcessing}
          loading={isProcessing}
          icon={isProcessing ? undefined : "Plus"}
        >
          {isProcessing ? "Processing..." : "Add Task"}
        </Button>
      </form>
      
      <div className="mt-3 flex items-center text-sm text-gray-500">
        <ApperIcon name="Sparkles" className="w-4 h-4 mr-2 text-secondary-500" />
        <span>AI will automatically extract project, time estimate, and priority</span>
      </div>
    </motion.div>
  );
};

export default TaskInputBar;