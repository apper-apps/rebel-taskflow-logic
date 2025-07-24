import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by creating your first item.", 
  actionLabel = "Get Started",
  onAction,
  icon = "Inbox",
  type = "default"
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case "projects":
        return {
          title: "No projects yet",
          message: "Create your first project to start managing tasks and tracking time for your marketing campaigns.",
          actionLabel: "Create Project",
          icon: "FolderPlus"
        };
      case "tasks":
        return {
          title: "No tasks found",
          message: "Add your first task using natural language like 'Review client proposal 2 hours tomorrow urgent'",
          actionLabel: "Add Task",
          icon: "ListPlus"
        };
      case "reports":
        return {
          title: "No data to report",
          message: "Complete some tasks and log time to see insightful reports about your project progress.",
          actionLabel: "View Projects",
          icon: "BarChart3"
        };
      default:
        return { title, message, actionLabel, icon };
    }
  };

  const content = getEmptyStateContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <ApperIcon name={content.icon} className="w-10 h-10 text-primary-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
          {content.title}
        </h3>
        <p className="text-gray-600 max-w-md text-lg leading-relaxed">
          {content.message}
        </p>
      </div>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>{content.actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;