import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface to-primary-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse"></div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-primary-200 to-primary-300 rounded-lg animate-pulse"></div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Task List */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-6 animate-pulse"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-100 last:border-b-0">
                <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (type === "projects") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
              <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full mb-4 animate-pulse"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === "tasks") {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 mb-2 animate-pulse"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;