import taskData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.tasks];
  }

  async getById(Id) {
    await this.delay(200);
    const task = this.tasks.find(t => t.Id === Id);
    if (!task) {
      throw new Error(`Task with Id ${Id} not found`);
    }
    return { ...task };
  }

async create(taskData) {
    await this.delay(350);
    const newId = Math.max(...this.tasks.map(t => t.Id)) + 1;
    const newTask = {
      ...taskData,
      Id: newId,
      createdAt: new Date().toISOString(),
      actualMinutes: 0,
      status: "pending",
      lunchBreakExcluded: true // Flag to indicate lunch break should be excluded from time calculations
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(Id, updates) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === Id);
    if (index === -1) {
      throw new Error(`Task with Id ${Id} not found`);
    }
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  async delete(Id) {
    await this.delay(250);
    const index = this.tasks.findIndex(t => t.Id === Id);
    if (index === -1) {
      throw new Error(`Task with Id ${Id} not found`);
    }
    this.tasks.splice(index, 1);
    return true;
  }

  async getByProject(projectId) {
    await this.delay(200);
    return this.tasks.filter(task => task.projectId === projectId);
  }

  async getByStatus(status) {
    await this.delay(200);
    return this.tasks.filter(task => task.status?.toLowerCase() === status.toLowerCase());
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const taskService = new TaskService();