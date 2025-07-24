import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { projectService } from "@/services/api";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientName: "",
    status: "active",
    totalEstimatedHours: 0,
    objectives: []
  });

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
      setFormData({
        name: data.name || "",
        description: data.description || "",
        clientName: data.clientName || "",
        status: data.status || "active",
        totalEstimatedHours: data.totalEstimatedHours || 0,
        objectives: data.objectives || []
      });
    } catch (err) {
      setError(err.message || "Errore nel caricamento del progetto");
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, ""]
    }));
  };

  const removeObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Il nome del progetto è obbligatorio");
      return;
    }

    if (!formData.clientName.trim()) {
      toast.error("Il nome del cliente è obbligatorio");
      return;
    }

    try {
      setSaving(true);
      const projectId = parseInt(id);
      
      const updateData = {
        ...formData,
        objectives: formData.objectives.filter(obj => obj.trim() !== "")
      };

      await projectService.update(projectId, updateData);
      toast.success("Progetto aggiornato con successo");
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error(err.message || "Errore nell'aggiornamento del progetto");
      console.error("Error updating project:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${id}`);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Progetti</span>
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="hover:text-primary-600 transition-colors"
        >
          {project.name}
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900 font-medium">Modifica</span>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ApperIcon name="Edit" size={24} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Modifica Progetto</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Progetto *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Inserisci il nome del progetto"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <Input
                type="text"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                placeholder="Nome del cliente"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stato
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="active">Attivo</option>
                <option value="in-progress">In Corso</option>
                <option value="completed">Completato</option>
                <option value="on-hold">In Pausa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ore Stimate
              </label>
              <Input
                type="number"
                value={formData.totalEstimatedHours}
                onChange={(e) => handleInputChange("totalEstimatedHours", parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descrizione del progetto"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Obiettivi
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon="Plus"
                onClick={addObjective}
              >
                Aggiungi Obiettivo
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    type="text"
                    value={objective}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    placeholder={`Obiettivo ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon="Trash2"
                    onClick={() => removeObjective(index)}
                    className="text-red-600 hover:text-red-700"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              icon={saving ? "Loader2" : "Save"}
            >
              {saving ? "Salvataggio..." : "Salva Modifiche"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProjectEdit;