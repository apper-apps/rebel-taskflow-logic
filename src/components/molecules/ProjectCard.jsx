import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ProjectCard = ({ project, onClick, className }) => {
  const progressPercentage = project.totalEstimatedHours > 0 
    ? Math.min((project.totalActualHours / project.totalEstimatedHours) * 100, 100)
    : 0;

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "success";
      case "in-progress": return "primary";
      case "on-hold": return "warning";
      default: return "default";
    }
  };

  const upcomingMilestone = project.milestones?.find(m => !m.completed && new Date(m.dueDate) > new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={className}
    >
      <Card 
        className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={() => onClick?.(project)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              <ApperIcon name="Building2" className="w-4 h-4 mr-1" />
              {project.clientName}
            </p>
          </div>
          <Badge variant={getStatusVariant(project.status)} size="sm">
            {project.status || "Active"}
          </Badge>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-600">
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            <span>{project.totalActualHours || 0}h logged</span>
          </div>
          <div className="flex items-center text-gray-600">
            <ApperIcon name="Target" className="w-4 h-4 mr-1" />
            <span>{project.totalEstimatedHours || 0}h estimated</span>
          </div>
        </div>

        {upcomingMilestone && (
          <div className="mt-4 p-3 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg">
            <div className="flex items-center text-sm">
              <ApperIcon name="Flag" className="w-4 h-4 mr-2 text-accent-600" />
              <span className="font-medium text-accent-800">Next milestone:</span>
              <span className="ml-2 text-accent-700">{upcomingMilestone.name}</span>
            </div>
            <div className="text-xs text-accent-600 mt-1">
              Due: {format(new Date(upcomingMilestone.dueDate), "MMM d, yyyy")}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ProjectCard;