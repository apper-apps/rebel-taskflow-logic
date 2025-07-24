import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService, projectService } from "@/services/api";
import { toast } from "react-toastify";

const TaskList = ({ 
  filters = {}, 
  limit,
  showHeader = true,
  onTaskUpdate,
  onAddTask 
}) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      let filteredTasks = tasksData;
      
      // Apply filters
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => 
          task.status?.toLowerCase() === filters.status.toLowerCase()
        );
      }
      
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => 
          task.priority?.toLowerCase() === filters.priority.toLowerCase()
        );
      }
      
      if (filters.projectId) {
        filteredTasks = filteredTasks.filter(task => 
          task.projectId === filters.projectId
        );
      }
      
      if (filters.dueToday) {
        const today = new Date().toDateString();
        filteredTasks = filteredTasks.filter(task => 
          task.dueDate && new Date(task.dueDate).toDateString() === today
        );
      }
      
      // Sort by priority and due date
      filteredTasks.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority?.toLowerCase()] || 2;
        const bPriority = priorityOrder[b.priority?.toLowerCase()] || 2;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      if (limit) {
        filteredTasks = filteredTasks.slice(0, limit);
      }
      
      setTasks(filteredTasks);
      setProjects(projectsData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      await taskService.update(taskId, {
        ...task,
        status: "completed",
        completedAt: new Date().toISOString()
      });
      
      await loadData();
      onTaskUpdate?.();
      toast.success("Task completed successfully!");
    } catch (err) {
      toast.error("Failed to complete task");
      console.error("Error completing task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    try {
      await taskService.delete(taskId);
      await loadData();
      onTaskUpdate?.();
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const handleStartTimer = (task) => {
    toast.info(`Timer started for: ${task.title}`);
    // Timer functionality would be implemented here
  };

  const handleEditTask = (task) => {
    toast.info("Edit task functionality coming soon!");
    // Edit functionality would be implemented here
  };

  if (loading) {
    return <Loading type="tasks" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load tasks"
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty 
        type="tasks"
        onAction={onAddTask}
      />
    );
  }

  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filters.dueToday ? "Today's Tasks" : "Tasks"}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({tasks.length})
            </span>
          </h2>
        </div>
      )}
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => {
            const project = projects.find(p => p.Id === task.projectId);
            return (
              <TaskCard
                key={task.Id}
                task={task}
                project={project}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStartTimer={handleStartTimer}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;