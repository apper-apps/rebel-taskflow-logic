import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const TaskCard = ({ task, project, onComplete, onEdit, onDelete, onStartTimer }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const getPriorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent": return "urgent";
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "CheckCircle2";
      case "in-progress": return "Play";
      case "scheduled": return "Calendar";
      default: return "Circle";
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete?.(task.Id);
      setIsCompleting(false);
    }, 500);
  };

  const formatTime = (minutes) => {
    if (!minutes) return "0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
return `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
    >
      <Card className="p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-start space-x-4">
          {/* Status Checkbox */}
          <motion.button
            onClick={handleComplete}
            disabled={isCompleting || task.status === "completed"}
            className="mt-1 flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon 
              name={getStatusIcon(task.status)} 
              className={`w-5 h-5 ${
                task.status === "completed" 
                  ? "text-success" 
                  : "text-gray-400 hover:text-primary-500"
              }`}
            />
          </motion.button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className={`font-medium text-gray-900 ${
                task.status === "completed" ? "line-through text-gray-500" : ""
              }`}>
                {task.title}
              </h4>
              <div className="flex items-center space-x-2 ml-4">
                <Badge variant={getPriorityVariant(task.priority)} size="sm">
                  {task.priority || "Medium"}
                </Badge>
              </div>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {project && (
                  <div className="flex items-center">
                    <ApperIcon name="Folder" className="w-4 h-4 mr-1" />
                    <span>{project.name}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                  <span>{formatTime(task.estimatedMinutes)}</span>
                  {task.actualMinutes > 0 && (
                    <span className="ml-1 text-primary-600">
                      ({formatTime(task.actualMinutes)} logged)
                    </span>
                  )}
                </div>

                {task.dueDate && (
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                    <span>{format(new Date(task.dueDate), "MMM d")}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {task.status !== "completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Play"
                    onClick={() => onStartTimer?.(task)}
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                  onClick={() => onEdit?.(task)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={() => onDelete?.(task.Id)}
                />
              </div>
            </div>
</div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;