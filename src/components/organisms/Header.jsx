import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick, title, subtitle, actions }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden"
          />
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {actions}
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Agency User</p>
              <p className="text-xs text-gray-500">Marketing Team</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;