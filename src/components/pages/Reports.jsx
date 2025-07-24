import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { projectService, taskService } from "@/services/api";
import { format, subDays, subWeeks, subMonths } from "date-fns";

const Reports = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("week");
  const [selectedProject, setSelectedProject] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load report data. Please try again.");
      console.error("Error loading report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Filter by project
    if (selectedProject !== "all") {
      filtered = filtered.filter(task => task.projectId === selectedProject);
    }
    
    // Filter by time range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case "day":
        startDate = subDays(now, 1);
        break;
      case "week":
        startDate = subWeeks(now, 1);
        break;
      case "month":
        startDate = subMonths(now, 1);
        break;
      case "quarter":
        startDate = subMonths(now, 3);
        break;
      default:
        startDate = subWeeks(now, 1);
    }
    
    return filtered.filter(task => 
      task.completedAt && new Date(task.completedAt) >= startDate
    );
  };

  const calculateProjectStats = () => {
    const filteredTasks = getFilteredTasks();
    
    return projects.map(project => {
      const projectTasks = filteredTasks.filter(task => task.projectId === project.Id);
      const completedTasks = projectTasks.filter(task => task.status === "completed");
      
      const totalEstimated = projectTasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0);
      const totalActual = projectTasks.reduce((sum, task) => sum + (task.actualMinutes || 0), 0);
      
      const efficiency = totalEstimated > 0 ? ((totalEstimated / Math.max(totalActual, 1)) * 100) : 0;
      
      return {
        ...project,
        tasksCompleted: completedTasks.length,
        totalTasks: projectTasks.length,
        estimatedHours: Math.round(totalEstimated / 60 * 10) / 10,
        actualHours: Math.round(totalActual / 60 * 10) / 10,
        efficiency: Math.round(efficiency)
      };
    }).filter(project => project.totalTasks > 0);
  };

  const calculateOverallStats = () => {
    const filteredTasks = getFilteredTasks();
    const completedTasks = filteredTasks.filter(task => task.status === "completed");
    
    const totalEstimated = filteredTasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0);
    const totalActual = filteredTasks.reduce((sum, task) => sum + (task.actualMinutes || 0), 0);
    
    return {
      totalTasks: filteredTasks.length,
      completedTasks: completedTasks.length,
      estimatedHours: Math.round(totalEstimated / 60 * 10) / 10,
      actualHours: Math.round(totalActual / 60 * 10) / 10,
      efficiency: totalEstimated > 0 ? Math.round((totalEstimated / Math.max(totalActual, 1)) * 100) : 0,
      completionRate: filteredTasks.length > 0 ? Math.round((completedTasks.length / filteredTasks.length) * 100) : 0
    };
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load reports"
        message={error}
        onRetry={loadData}
      />
    );
  }

  const projectStats = calculateProjectStats();
  const overallStats = calculateOverallStats();

  if (projectStats.length === 0) {
    return (
      <Empty 
        type="reports"
        onAction={() => {/* Navigate to projects */}}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Track your team's productivity and project progress</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon="Download">
            Export
          </Button>
          <Button variant="primary" size="sm" icon="RefreshCw" onClick={loadData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.Id} value={project.Id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <Badge variant="primary" size="sm">
            {projectStats.length} active projects
          </Badge>
        </div>
      </Card>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </div>
            <Badge variant="primary" size="sm">
              {overallStats.completionRate}%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {overallStats.completedTasks}
          </h3>
          <p className="text-sm text-gray-600">
            Tasks Completed
          </p>
          <p className="text-xs text-gray-500 mt-1">
            of {overallStats.totalTasks} total tasks
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-white" />
            </div>
            <Badge variant="accent" size="sm">
              Logged
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {overallStats.actualHours}h
          </h3>
          <p className="text-sm text-gray-600">
            Time Tracked
          </p>
          <p className="text-xs text-gray-500 mt-1">
            vs {overallStats.estimatedHours}h estimated
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
            <Badge variant="success" size="sm">
              {overallStats.efficiency > 100 ? "Over" : "Under"}
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {overallStats.efficiency}%
          </h3>
          <p className="text-sm text-gray-600">
            Time Efficiency
          </p>
          <p className="text-xs text-gray-500 mt-1">
            estimated vs actual
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="FolderOpen" className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" size="sm">
              Active
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {projectStats.length}
          </h3>
          <p className="text-sm text-gray-600">
            Projects
          </p>
          <p className="text-xs text-gray-500 mt-1">
            with activity this {timeRange}
          </p>
        </Card>
      </div>

      {/* Project Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Project Performance</h3>
          <Button variant="ghost" size="sm" icon="BarChart3">
            View Chart
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Project</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Tasks</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Estimated</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Actual</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {projectStats.map((project, index) => (
                <motion.tr
                  key={project.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-900">{project.clientName}</p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-gray-900">{project.tasksCompleted}</span>
                      <span className="text-gray-500">/ {project.totalTasks}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-gray-900">{project.estimatedHours}h</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-gray-900">{project.actualHours}h</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge 
                      variant={project.efficiency >= 90 ? "success" : project.efficiency >= 70 ? "warning" : "error"}
                      size="sm"
                    >
                      {project.efficiency}%
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Distribution by Priority</h3>
          
          <div className="space-y-4">
            {["urgent", "high", "medium", "low"].map((priority) => {
              const priorityTasks = getFilteredTasks().filter(task => 
                task.priority?.toLowerCase() === priority
              );
              const totalHours = priorityTasks.reduce((sum, task) => 
                sum + (task.actualMinutes || 0), 0
              ) / 60;
              const percentage = overallStats.actualHours > 0 
                ? (totalHours / overallStats.actualHours) * 100 
                : 0;
              
              return (
                <div key={priority} className="flex items-center space-x-4">
                  <div className="w-20">
                    <Badge 
                      variant={priority} 
                      size="sm"
                      className="capitalize"
                    >
                      {priority}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{Math.round(totalHours * 10) / 10}h</span>
                      <span className="text-gray-500">{Math.round(percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          priority === "urgent" ? "bg-red-500" :
                          priority === "high" ? "bg-orange-500" :
                          priority === "medium" ? "bg-blue-500" : "bg-gray-400"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Projects</h3>
          
          <div className="space-y-4">
            {projectStats
              .sort((a, b) => b.efficiency - a.efficiency)
              .slice(0, 5)
              .map((project, index) => (
                <div key={project.Id} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.clientName}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={project.efficiency >= 90 ? "success" : "primary"}
                      size="sm"
                    >
                      {project.efficiency}%
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {project.actualHours}h logged
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Reports;