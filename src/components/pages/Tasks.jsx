import React, { useState } from "react";
import { motion } from "framer-motion";
import TaskInputBar from "@/components/molecules/TaskInputBar";
import TaskList from "@/components/organisms/TaskList";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { taskService } from "@/services/api";
import { toast } from "react-toastify";

const Tasks = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { key: "all", label: "All Tasks", count: 24 },
    { key: "today", label: "Due Today", count: 5 },
    { key: "urgent", label: "Urgent", count: 3 },
    { key: "in-progress", label: "In Progress", count: 8 },
    { key: "completed", label: "Completed", count: 12 }
  ];

  const getTaskFilters = () => {
    switch (activeFilter) {
      case "today":
        return { dueToday: true };
      case "urgent":
        return { priority: "urgent" };
      case "in-progress":
        return { status: "in-progress" };
      case "completed":
        return { status: "completed" };
      default:
        return {};
    }
  };

  const handleAddTask = async (taskText) => {
    try {
      // Parse the natural language input (simplified AI simulation)
      const parsed = parseTaskInput(taskText);
      
      const newTask = {
        title: parsed.title,
        description: parsed.description || "",
        projectId: parsed.projectId || null,
        priority: parsed.priority || "medium",
        estimatedMinutes: parsed.estimatedMinutes || 60,
        status: "pending",
        dueDate: parsed.dueDate ? parsed.dueDate.toISOString() : null,
        createdAt: new Date().toISOString()
      };

      await taskService.create(newTask);
      setRefreshKey(prev => prev + 1);
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error("Failed to add task");
      console.error("Error adding task:", err);
    }
  };

  const parseTaskInput = (input) => {
    // Simple parsing logic (in a real app, this would use AI)
    const text = input.toLowerCase();
    
    // Extract priority
    let priority = "medium";
    if (text.includes("urgent")) priority = "urgent";
    else if (text.includes("high")) priority = "high";
    else if (text.includes("low")) priority = "low";
    
    // Extract time estimate
    let estimatedMinutes = 60;
    const timeMatch = text.match(/(\d+)\s*(hour|hr|h|minute|min|m)/);
    if (timeMatch) {
      const value = parseInt(timeMatch[1]);
      const unit = timeMatch[2];
      if (unit.startsWith("h")) {
        estimatedMinutes = value * 60;
      } else {
        estimatedMinutes = value;
      }
    }
    
    // Extract due date
    let dueDate = null;
    if (text.includes("today")) {
      dueDate = new Date();
    } else if (text.includes("tomorrow")) {
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
    }
    
    // Clean title (remove priority and time indicators)
    let title = input
      .replace(/\b(urgent|high|medium|low)\b/gi, "")
      .replace(/\d+\s*(hour|hr|h|minute|min|m)s?/gi, "")
      .replace(/\b(today|tomorrow)\b/gi, "")
      .trim();
    
    return {
      title: title || input,
      priority,
      estimatedMinutes,
      dueDate
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="text-gray-600 mt-1">Manage your daily tasks and priorities</p>
      </div>

      {/* Task Input */}
      <TaskInputBar onSubmit={handleAddTask} />

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeFilter === filter.key
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {filter.label}
            <Badge 
              variant={activeFilter === filter.key ? "primary" : "default"}
              size="sm"
              className="ml-2"
            >
              {filter.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {activeFilter !== "completed" && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">Select all visible tasks</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" icon="Edit">
              Edit Selected
            </Button>
            <Button variant="ghost" size="sm" icon="Archive">
              Archive
            </Button>
            <Button variant="ghost" size="sm" icon="Trash2">
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Task List */}
      <TaskList
        key={`${refreshKey}-${activeFilter}`}
        filters={getTaskFilters()}
        onTaskUpdate={() => setRefreshKey(prev => prev + 1)}
        showHeader={false}
      />
    </motion.div>
  );
};

export default Tasks;