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
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    loadData();
    loadTimerState();
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
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
setError("Impossibile caricare le attività. Riprova.");
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
      toast.success("Attività completata con successo!");
    } catch (err) {
      toast.error("Failed to complete task");
      console.error("Error completing task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
if (!window.confirm("Sei sicuro di voler eliminare questa attività?")) {
      return;
    }
    
    try {
      await taskService.delete(taskId);
      await loadData();
onTaskUpdate?.();
      toast.success("Attività eliminata con successo!");
    } catch (err) {
toast.error("Impossibile eliminare l'attività");
      console.error("Error deleting task:", err);
    }
  };

const loadTimerState = () => {
    const savedTimer = localStorage.getItem('activeTimer');
    if (savedTimer) {
      const timerData = JSON.parse(savedTimer);
      const now = Date.now();
      const elapsed = Math.floor((now - timerData.startTime) / 1000);
      
      setActiveTimer(timerData.taskId);
      setElapsedTime(elapsed);
      startTimerInterval();
    }
  };

  const saveTimerState = (taskId, startTime) => {
    localStorage.setItem('activeTimer', JSON.stringify({
      taskId,
      startTime
    }));
  };

  const clearTimerState = () => {
    localStorage.removeItem('activeTimer');
  };

  const startTimerInterval = () => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    return interval;
  };

  const handleStartTimer = async (task) => {
    try {
      // Stop any existing timer
      if (activeTimer) {
        await handleStopTimer();
      }

      // Start new timer
      const startTime = Date.now();
      setActiveTimer(task.Id);
      setElapsedTime(0);
      saveTimerState(task.Id, startTime);
      
      const interval = startTimerInterval();
      
      // Update task status to in-progress
      await taskService.update(task.Id, {
        ...task,
        status: "in-progress"
      });
      
      await loadData();
      onTaskUpdate?.();
      toast.success(`Timer avviato per: ${task.title}`);
    } catch (err) {
      toast.error("Impossibile avviare il timer");
      console.error("Error starting timer:", err);
    }
  };

  const handleStopTimer = async () => {
    if (!activeTimer || timerInterval === null) return;

    try {
      // Clear interval
      clearInterval(timerInterval);
      setTimerInterval(null);

      // Find the task and update with elapsed time
      const task = tasks.find(t => t.Id === activeTimer);
      if (task) {
        const minutesWorked = Math.max(1, Math.round(elapsedTime / 60));
        
        await taskService.update(task.Id, {
          ...task,
          actualMinutes: (task.actualMinutes || 0) + minutesWorked,
          status: "pending" // Return to pending after stopping timer
        });

        toast.success(`Timer fermato. ${minutesWorked} minuti registrati per: ${task.title}`);
      }

      // Reset timer state
      setActiveTimer(null);
      setElapsedTime(0);
      clearTimerState();
      
      await loadData();
      onTaskUpdate?.();
    } catch (err) {
      toast.error("Impossibile fermare il timer");
      console.error("Error stopping timer:", err);
    }
  };

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEditTask = (task) => {
    toast.info("Funzionalità di modifica attività in arrivo!");
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
            {filters.dueToday ? "Attività di Oggi" : "Attività"}
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
                onStopTimer={handleStopTimer}
                isTimerActive={activeTimer === task.Id}
                elapsedTime={activeTimer === task.Id ? elapsedTime : 0}
                formatElapsedTime={formatElapsedTime}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;