import React from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Projects", path: "/projects", icon: "FolderOpen" },
    { name: "Tasks", path: "/tasks", icon: "CheckSquare" },
    { name: "Calendar", path: "/calendar", icon: "Calendar" },
    { name: "Reports", path: "/reports", icon: "BarChart3" },
    { name: "Settings", path: "/settings", icon: "Settings" }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              TaskFlow Pro
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Agency User</p>
              <p className="text-xs text-gray-500">Marketing Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Agency User</p>
                <p className="text-xs text-gray-500">Marketing Team</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;