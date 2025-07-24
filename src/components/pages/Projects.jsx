import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProjectGrid from "@/components/organisms/ProjectGrid";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { toast } from "react-toastify";

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleProjectClick = (project) => {
    toast.info(`Opening project: ${project.name}`);
    // Navigate to project detail view
  };

  const handleAddProject = () => {
    toast.info("Create project functionality coming soon!");
    // Open create project modal or navigate to form
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search functionality
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your marketing campaigns and client work</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={handleAddProject}
        >
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search projects..."
            onSearch={handleSearch}
            onClear={() => setSearchTerm("")}
          />
        </div>
        
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
          
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Clients</option>
            <option value="acme-corp">Acme Corp</option>
            <option value="tech-startup">Tech Startup Inc</option>
            <option value="fashion-brand">Fashion Brand Co</option>
          </select>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600">Active Projects</p>
              <p className="text-2xl font-bold text-primary-900">8</p>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                💼
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-accent-600">Due This Week</p>
              <p className="text-2xl font-bold text-accent-900">3</p>
            </div>
            <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              📅
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-success/10 to-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success">Completed</p>
              <p className="text-2xl font-bold text-success">12</p>
            </div>
            <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
              ✅
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <ProjectGrid
        onProjectClick={handleProjectClick}
        onAddProject={handleAddProject}
      />
    </motion.div>
  );
};

export default Projects;