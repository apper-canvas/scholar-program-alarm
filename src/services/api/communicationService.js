import communicationsData from "@/services/mockData/communications.json";

class CommunicationService {
  constructor() {
    this.data = [...communicationsData];
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
    const communication = this.data.find(item => item.Id === parseInt(id));
    if (!communication) {
      throw new Error("Communication not found");
    }
    return { ...communication };
  }

  async getByStudentId(studentId) {
    await this.delay();
    const communications = this.data.filter(item => item.studentId === parseInt(studentId));
    return communications.map(comm => ({ ...comm })).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async create(communicationData) {
    await this.delay();
    const newCommunication = {
      Id: Math.max(...this.data.map(c => c.Id), 0) + 1,
      ...communicationData,
      createdAt: new Date().toISOString()
    };
    this.data.push(newCommunication);
    return { ...newCommunication };
  }

  async update(id, communicationData) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Communication not found");
    }
    
    this.data[index] = { 
      ...this.data[index], 
      ...communicationData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Communication not found");
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export const communicationService = new CommunicationService();