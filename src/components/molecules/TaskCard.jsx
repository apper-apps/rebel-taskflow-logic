import React, { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
const TaskCard = React.forwardRef(({ 
  task, 
  project, 
  onComplete, 
  onEdit, 
  onDelete, 
  onStartTimer, 
  onStopTimer,
  isTimerActive = false,
  elapsedTime = 0,
  formatElapsedTime
}, ref) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeInput, setTimeInput] = useState('');
  
  function getPriorityVariant(priority) {
    const variants = {
      High: "destructive",
      Medium: "warning",
      Low: "default"
    };
    return variants[priority] || "default";
  }

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
    setShowTimeModal(true);
  };

  const handleCloseTimeModal = () => {
    setShowTimeModal(false);
    setTimeInput('');
    setIsCompleting(false);
  };

  const handleCompleteWithoutTime = () => {
    onComplete?.(task.Id);
    handleCloseTimeModal();
  };

  const handleCompleteWithTime = () => {
    const hours = parseFloat(timeInput);
    if (!isNaN(hours) && hours > 0) {
      const minutes = Math.round(hours * 60);
      onComplete?.(task.Id, minutes);
    } else {
      onComplete?.(task.Id);
    }
    handleCloseTimeModal();
  };

const formatTime = (minutes) => {
    if (!minutes) return "0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
    >
<Card ref={ref} className="p-4 hover:shadow-md transition-all duration-200">
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
                  : isTimerActive
                  ? "text-primary-500 animate-pulse"
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
                  {isTimerActive && (
                    <span className="ml-1 text-primary-600 font-semibold animate-pulse">
                      ({formatElapsedTime(elapsedTime)} attivo)
                    </span>
                  )}
                  {!isTimerActive && task.actualMinutes > 0 && (
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
                    icon={isTimerActive ? "Square" : "Play"}
                    onClick={() => isTimerActive ? onStopTimer?.() : onStartTimer?.(task)}
                    className={isTimerActive ? "text-red-500 hover:text-red-600" : ""}
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

        {/* Time Input Modal */}
        {showTimeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleCloseTimeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Registra Tempo
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={handleCloseTimeModal}
                />
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Quanto tempo hai impiegato per completare "{task.title}"?
                </p>
                <Input
                  type="number"
                  placeholder="es. 2.5 (ore)"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  step="0.25"
                  min="0"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Inserisci il tempo in ore (es. 1.5 per 1 ora e 30 minuti)
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleCompleteWithoutTime}
                  className="flex-1"
                >
                  Completa senza tempo
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCompleteWithTime}
                  className="flex-1"
                >
                  Registra e completa
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
})

TaskCard.displayName = 'TaskCard'
export default TaskCard;