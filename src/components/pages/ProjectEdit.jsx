import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { projectService } from "@/services/api/projectService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

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
  const [milestones, setMilestones] = useState([]);
  const [editingMilestone, setEditingMilestone] = useState(null);

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
      setMilestones(data.milestones || []);
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
        objectives: formData.objectives.filter(obj => obj.trim() !== ""),
        milestones: milestones
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

  // Milestone management functions
  const addMilestone = () => {
    const newMilestone = {
      id: `m${Date.now()}`,
      name: "",
      dueDate: new Date().toISOString().split('T')[0],
      completed: false
    };
    setMilestones(prev => [...prev, newMilestone]);
    setEditingMilestone(newMilestone.id);
  };

  const removeMilestone = (milestoneId) => {
    setMilestones(prev => prev.filter(m => m.id !== milestoneId));
    setEditingMilestone(null);
  };

  const toggleMilestoneCompletion = (milestoneId) => {
    setMilestones(prev => prev.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    ));
  };

  const updateMilestone = (milestoneId, field, value) => {
    setMilestones(prev => prev.map(m => 
      m.id === milestoneId ? { ...m, [field]: value } : m
    ));
  };

  const saveMilestone = (milestoneId) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone?.name.trim()) {
      toast.error("Il nome della milestone è obbligatorio");
      return;
    }
    setEditingMilestone(null);
  };

  const cancelMilestoneEdit = (milestoneId) => {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone?.name.trim()) {
      removeMilestone(milestoneId);
    } else {
      setEditingMilestone(null);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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

          {/* Milestones Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Milestone
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon="Plus"
                onClick={addMilestone}
              >
                Aggiungi Milestone
              </Button>
            </div>
            
            <div className="space-y-4">
              {milestones.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Target" size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>Nessuna milestone definita</p>
                  <p className="text-sm">Aggiungi milestone per tracciare i progressi del progetto</p>
                </div>
              )}
              
              {milestones.map((milestone) => (
                <div key={milestone.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    {!milestone.completed && (
                      <button
                        type="button"
                        onClick={() => toggleMilestoneCompletion(milestone.id)}
                        className="flex-shrink-0 w-5 h-5 mt-1 border-2 border-gray-300 rounded-full hover:border-primary-500 transition-colors"
                        title="Segna come completata"
                      />
                    )}
                    
                    {milestone.completed && (
                      <button
                        type="button"
                        onClick={() => toggleMilestoneCompletion(milestone.id)}
                        className="flex-shrink-0 w-5 h-5 mt-1 bg-green-500 border-2 border-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                        title="Segna come non completata"
                      >
                        <ApperIcon name="Check" size={12} className="text-white" />
                      </button>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {editingMilestone === milestone.id ? (
                        <div className="space-y-3">
                          <Input
                            type="text"
                            value={milestone.name}
                            onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                            placeholder="Nome della milestone"
                            className="w-full"
                            autoFocus
                          />
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Data di scadenza
                              </label>
                              <Input
                                type="date"
                                value={formatDateForInput(milestone.dueDate)}
                                onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                                className="w-full"
                              />
                            </div>
                            
                            <div className="flex space-x-2 sm:mt-5">
                              <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                icon="Check"
                                onClick={() => saveMilestone(milestone.id)}
                              >
                                Salva
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                icon="X"
                                onClick={() => cancelMilestoneEdit(milestone.id)}
                              >
                                Annulla
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {milestone.name || 'Milestone senza nome'}
                            </h4>
                            
                            <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <ApperIcon name="Calendar" size={14} />
                                <span>{formatDateForDisplay(milestone.dueDate)}</span>
                              </div>
                              
                              {milestone.completed && (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <ApperIcon name="CheckCircle" size={14} />
                                  <span>Completata</span>
                                </div>
                              )}
                              
                              {!milestone.completed && new Date(milestone.dueDate) < new Date() && (
                                <div className="flex items-center space-x-1 text-red-600">
                                  <ApperIcon name="AlertCircle" size={14} />
                                  <span>In ritardo</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              icon="Edit"
                              onClick={() => setEditingMilestone(milestone.id)}
                            >
                              Modifica
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              icon="Trash2"
                              onClick={() => removeMilestone(milestone.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Rimuovi
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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