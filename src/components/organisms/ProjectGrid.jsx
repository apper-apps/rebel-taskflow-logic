import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { projectService } from "@/services/api/index";
import ProjectCard from "@/components/molecules/ProjectCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const ProjectGrid = ({ searchTerm, statusFilter, clientFilter, onProjectClick, onAddProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFilteredProjects();
  }, [searchTerm, statusFilter, clientFilter]);

const loadFilteredProjects = async () => {
    try {
      setError("");
      setLoading(true);
      
      // Use filtered search if any filters are applied
      if (searchTerm || statusFilter || clientFilter) {
        const data = await projectService.getByFilters({
          searchTerm: searchTerm || "",
          statusFilter: statusFilter || "",
          clientFilter: clientFilter || ""
        });
        setProjects(data);
      } else {
        // Load all projects if no filters
        const data = await projectService.getAll();
        setProjects(data);
      }
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
        onRetry={loadFilteredProjects}
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