import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatsGrid = ({ stats }) => {
  const defaultStats = [
    {
      title: "Active Projects",
      value: "8",
      change: "+2 this week",
      icon: "FolderOpen",
      color: "primary",
      trend: "up"
    },
    {
      title: "Tasks Today",
      value: "12",
      change: "4 completed",
      icon: "CheckSquare",
      color: "success",
      trend: "up"
    },
    {
      title: "Hours This Week",
      value: "34.5",
      change: "+8.2 from last week",
      icon: "Clock",
      color: "accent",
      trend: "up"
    },
    {
      title: "Team Efficiency",
      value: "87%",
      change: "+5% improvement",
      icon: "TrendingUp",
      color: "secondary",
      trend: "up"
    }
  ];

  const displayStats = stats || defaultStats;

  const getColorClasses = (color) => {
    const colors = {
      primary: "from-primary-500 to-primary-600",
      secondary: "from-secondary-500 to-secondary-600",
      accent: "from-accent-500 to-accent-600",
      success: "from-green-500 to-green-600",
      error: "from-red-500 to-red-600"
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
              </div>
              {stat.trend && (
                <div className={`flex items-center text-sm ${
                  stat.trend === "up" 
                    ? "text-success" 
                    : stat.trend === "down" 
                    ? "text-error" 
                    : "text-gray-500"
                }`}>
                  <ApperIcon 
                    name={stat.trend === "up" ? "TrendingUp" : stat.trend === "down" ? "TrendingDown" : "Minus"} 
                    className="w-4 h-4 mr-1" 
                  />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-2">
                {stat.title}
              </p>
              <p className="text-xs text-gray-500">
                {stat.change}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;