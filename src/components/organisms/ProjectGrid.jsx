import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/molecules/ProjectCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api";

const ProjectGrid = ({ onProjectClick, onAddProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="projects" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load projects"
        message={error}
        onRetry={loadProjects}
      />
    );
  }

  if (projects.length === 0) {
    return (
      <Empty 
        type="projects"
        onAction={onAddProject}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ProjectCard
            project={project}
            onClick={onProjectClick}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectGrid;