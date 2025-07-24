import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatsGrid from "@/components/organisms/StatsGrid";
import TaskList from "@/components/organisms/TaskList";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddTask = () => {
    navigate("/tasks");
  };

  const handleTaskUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold mb-2">Good morning, Agency Team!</h1>
          <p className="text-primary-100 text-lg">
            You have 5 tasks due today and 3 projects requiring attention.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="primary"
            className="justify-start"
            icon="Plus"
            onClick={() => navigate("/tasks")}
          >
            Add Task
          </Button>
          <Button
            variant="secondary"
            className="justify-start"
            icon="FolderPlus"
            onClick={() => navigate("/projects")}
          >
            New Project
          </Button>
          <Button
            variant="secondary"
            className="justify-start"
            icon="Clock"
            onClick={() => navigate("/calendar")}
          >
            View Schedule
          </Button>
          <Button
            variant="secondary"
            className="justify-start"
            icon="BarChart3"
            onClick={() => navigate("/reports")}
          >
            See Reports
          </Button>
        </div>
      </Card>

      {/* Today's Tasks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Today's Priority Tasks</h3>
          <Button
            variant="ghost"
            size="sm"
            icon="Plus"
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </div>
        <TaskList
          key={refreshKey}
          filters={{ dueToday: true }}
          limit={5}
          showHeader={false}
          onTaskUpdate={handleTaskUpdate}
          onAddTask={handleAddTask}
        />
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            {
              action: "completed",
              item: "Social media strategy review",
              project: "Brand X Campaign",
              time: "2 hours ago",
              icon: "CheckCircle2",
              color: "text-success"
            },
            {
              action: "started",
              item: "Client presentation design",
              project: "Tech Startup Launch",
              time: "4 hours ago",
              icon: "Play",
              color: "text-primary-500"
            },
            {
              action: "created",
              item: "Q4 campaign planning meeting",
              project: "General",
              time: "6 hours ago",
              icon: "Plus",
              color: "text-accent-500"
            }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className={`${activity.color}`}>
                <ApperIcon name={activity.icon} className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  <span className="capitalize">{activity.action}</span> "{activity.item}"
                </p>
                <p className="text-xs text-gray-500">
                  {activity.project} • {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;