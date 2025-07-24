import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProjectGrid from "@/components/organisms/ProjectGrid";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { toast } from "react-toastify";
import { projectService } from "@/services/api";
import ApperIcon from "@/components/ApperIcon";

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientName: "",
    status: "active",
    priority: "medium",
    estimatedHours: "",
    budget: "",
    startDate: "",
    endDate: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const handleProjectClick = (project) => {
    const projectId = parseInt(project.Id);
    navigate(`/projects/${projectId}`);
  };

  const handleAddProject = () => {
    setShowCreateModal(true);
    setFormData({
      name: "",
      description: "",
      clientName: "",
      status: "active",
      priority: "medium",
      estimatedHours: "",
      budget: "",
      startDate: "",
      endDate: ""
    });
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      name: "",
      description: "",
      clientName: "",
      status: "active",
      priority: "medium",
      estimatedHours: "",
      budget: "",
      startDate: "",
      endDate: ""
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Il nome del progetto è obbligatorio";
    }
    
    if (!formData.description.trim()) {
      errors.description = "La descrizione è obbligatoria";
    }
    
    if (!formData.clientName.trim()) {
      errors.clientName = "Il nome del cliente è obbligatorio";
    }
    
    if (formData.estimatedHours && (isNaN(formData.estimatedHours) || parseFloat(formData.estimatedHours) <= 0)) {
      errors.estimatedHours = "Le ore stimate devono essere un numero positivo";
    }
    
    if (formData.budget && (isNaN(formData.budget) || parseFloat(formData.budget) <= 0)) {
      errors.budget = "Il budget deve essere un numero positivo";
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = "La data di fine deve essere successiva alla data di inizio";
    }
    
    return errors;
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsCreating(true);
    
    try {
      const projectData = {
        ...formData,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : 0,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        actualHours: 0,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const newProject = await projectService.create(projectData);
      
      toast.success("Progetto creato con successo!");
      handleCloseModal();
      
      // Navigate to the new project detail page
      setTimeout(() => {
        navigate(`/projects/${newProject.Id}`);
      }, 500);
      
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Errore nella creazione del progetto. Riprova.");
    } finally {
      setIsCreating(false);
    }
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
      
      {/* Create Project Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nuovo Progetto</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isCreating}
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Progetto *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Inserisci il nome del progetto"
                      className={formErrors.name ? "border-red-500" : ""}
                      disabled={isCreating}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente *
                    </label>
                    <Input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      placeholder="Nome del cliente"
                      className={formErrors.clientName ? "border-red-500" : ""}
                      disabled={isCreating}
                    />
                    {formErrors.clientName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.clientName}</p>
                    )}
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stato
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={isCreating}
                    >
                      <option value="active">Attivo</option>
                      <option value="in-progress">In Corso</option>
                      <option value="on-hold">In Pausa</option>
                      <option value="completed">Completato</option>
                    </select>
                  </div>
                  
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorità
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={isCreating}
                    >
                      <option value="low">Bassa</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                  
                  {/* Estimated Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ore Stimate
                    </label>
                    <Input
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) => handleInputChange("estimatedHours", e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.5"
                      className={formErrors.estimatedHours ? "border-red-500" : ""}
                      disabled={isCreating}
                    />
                    {formErrors.estimatedHours && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.estimatedHours}</p>
                    )}
                  </div>
                  
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Inizio
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  
                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Fine
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      className={formErrors.endDate ? "border-red-500" : ""}
                      disabled={isCreating}
                    />
                    {formErrors.endDate && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>
                    )}
                  </div>
                  
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (€)
                    </label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={formErrors.budget ? "border-red-500" : ""}
                      disabled={isCreating}
                    />
                    {formErrors.budget && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.budget}</p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrizione *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descrivi il progetto, gli obiettivi e i deliverable principali..."
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                      formErrors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isCreating}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                    disabled={isCreating}
                    className="w-full sm:w-auto"
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isCreating}
                    className="w-full sm:w-auto"
                    icon={isCreating ? undefined : "Plus"}
                  >
                    {isCreating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creazione...</span>
                      </div>
                    ) : (
                      "Crea Progetto"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Projects;