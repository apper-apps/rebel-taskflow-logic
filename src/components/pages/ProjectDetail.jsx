import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "@/services/api";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setError("");
      setLoading(true);
      const projectId = parseInt(id);
      if (isNaN(projectId)) {
        throw new Error("ID progetto non valido");
      }
      const data = await projectService.getById(projectId);
      if (!data) {
        throw new Error("Progetto non trovato");
      }
      setProject(data);
    } catch (err) {
      setError(err.message || "Errore nel caricamento del progetto");
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  };

const handleBackClick = () => {
    navigate("/projects");
  };

  const handleEditClick = () => {
    navigate(`/projects/${id}/edit`);
  };
  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "in-progress":
        return "warning";
      case "completed":
        return "info";
      case "on-hold":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Attivo";
      case "in-progress":
        return "In Corso";
      case "completed":
        return "Completato";
      case "on-hold":
        return "In Pausa";
      default:
        return status;
    }
  };

  if (loading) {
    return <Loading type="project" />;
  }

  if (error) {
    return (
      <Error 
        title="Errore nel caricamento"
        message={error}
        onRetry={loadProject}
      />
    );
  }

  if (!project) {
    return (
      <Error 
        title="Progetto non trovato"
        message="Il progetto richiesto non esiste o è stato rimosso"
        onRetry={() => navigate("/projects")}
      />
    );
  }

  const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  const hoursProgress = project.totalEstimatedHours > 0 ? Math.round((project.totalActualHours / project.totalEstimatedHours) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button
          onClick={handleBackClick}
          className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Progetti</span>
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900 font-medium">{project.name}</span>
      </div>

      {/* Project Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <Badge variant={getStatusVariant(project.status)}>
              {getStatusLabel(project.status)}
            </Badge>
          </div>
          <p className="text-gray-600 text-lg mb-4">{project.description}</p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="User" size={16} />
              <span>{project.clientName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={16} />
              <span>Creato il {format(new Date(project.createdAt), "dd MMMM yyyy", { locale: it })}</span>
            </div>
          </div>
        </div>
<div className="flex space-x-3">
          <Button variant="secondary" icon="Edit" onClick={handleEditClick}>
            Modifica
          </Button>
          <Button variant="primary" icon="Play">
            Avvia Timer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progresso Milestone</p>
              <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
              <p className="text-xs text-gray-500">{completedMilestones} di {totalMilestones} completate</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={20} className="text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ore Lavorate</p>
              <p className="text-2xl font-bold text-gray-900">{project.totalActualHours}</p>
              <p className="text-xs text-gray-500">di {project.totalEstimatedHours} stimate</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-accent-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Efficienza</p>
              <p className="text-2xl font-bold text-gray-900">{hoursProgress}%</p>
              <p className="text-xs text-gray-500">del budget ore</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={20} className="text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Milestone Attive</p>
              <p className="text-2xl font-bold text-gray-900">{totalMilestones - completedMilestones}</p>
              <p className="text-xs text-gray-500">in corso</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Flag" size={20} className="text-warning" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Objectives */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ApperIcon name="Bullseye" size={20} />
              <span>Obiettivi</span>
            </h3>
            <div className="space-y-3">
              {project.objectives?.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{objective}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Milestones */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <ApperIcon name="Flag" size={20} />
              <span>Milestone</span>
            </h3>
            <div className="space-y-4">
              {project.milestones?.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.completed 
                      ? 'bg-success text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {milestone.completed ? (
                      <ApperIcon name="Check" size={14} />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      milestone.completed ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {milestone.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Scadenza: {format(new Date(milestone.dueDate), "dd MMMM yyyy", { locale: it })}
                    </p>
                  </div>
                  <Badge variant={milestone.completed ? "success" : "secondary"}>
                    {milestone.completed ? "Completata" : "In Corso"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;