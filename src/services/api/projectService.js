import projectData from "@/services/mockData/projects.json";
class ProjectService {
  constructor() {
    this.projects = [...projectData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.projects];
  }

  async getById(Id) {
    await this.delay(200);
    const project = this.projects.find(p => p.Id === Id);
    if (!project) {
      throw new Error(`Project with Id ${Id} not found`);
    }
    return { ...project };
  }

  async create(projectData) {
    await this.delay(400);
    const newId = Math.max(...this.projects.map(p => p.Id)) + 1;
    const newProject = {
      ...projectData,
      Id: newId,
      createdAt: new Date().toISOString(),
      totalEstimatedHours: 0,
      totalActualHours: 0,
      status: "active"
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(Id, updates) {
    await this.delay(300);
    const index = this.projects.findIndex(p => p.Id === Id);
    if (index === -1) {
      throw new Error(`Project with Id ${Id} not found`);
    }
    this.projects[index] = { ...this.projects[index], ...updates };
    return { ...this.projects[index] };
  }
async delete(Id) {
    await this.delay(250);
    const index = this.projects.findIndex(p => p.Id === Id);
    if (index === -1) {
      throw new Error(`Project with Id ${Id} not found`);
    }
    this.projects.splice(index, 1);
    return true;
  }

  async logTimeToProject(projectId, minutes) {
    await this.delay(200);
    const index = this.projects.findIndex(p => p.Id === projectId);
    if (index === -1) {
      throw new Error(`Project with Id ${projectId} not found`);
    }
    
    const hours = minutes / 60;
    this.projects[index].totalActualHours = Math.round((this.projects[index].totalActualHours + hours) * 100) / 100;
    return { ...this.projects[index] };
  }
async search(searchTerm) {
    await this.delay(200);
    if (!searchTerm) return [...this.projects];
    
    const term = searchTerm.toLowerCase();
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.clientName.toLowerCase().includes(term)
    );
  }

  async getByFilters({ searchTerm = "", statusFilter = "", clientFilter = "" }) {
    await this.delay(250);
    
    let filtered = [...this.projects];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.clientName.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    if (clientFilter) {
      filtered = filtered.filter(project => project.clientName === clientFilter);
    }
    
    return filtered;
  }

async getUniqueClients() {
    await this.delay(100);
    const clients = [...new Set(this.projects.map(p => p.clientName))];
    return clients.sort();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create and export an instance of the service
const projectService = new ProjectService();
export default projectService;