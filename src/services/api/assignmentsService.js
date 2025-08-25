import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentsService {
  constructor() {
    this.data = [...assignmentsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    const assignment = this.data.find(item => item.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  }

  async create(assignmentData) {
    await this.delay();
    const newAssignment = {
      Id: Math.max(...this.data.map(a => a.Id), 0) + 1,
      ...assignmentData
    };
    this.data.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.data[index] = { ...this.data[index], ...assignmentData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export const assignmentsService = new AssignmentsService();