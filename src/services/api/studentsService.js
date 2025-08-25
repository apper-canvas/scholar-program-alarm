import studentsData from "@/services/mockData/students.json";

class StudentsService {
  constructor() {
    this.data = [...studentsData];
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
    const student = this.data.find(item => item.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  }

  async create(studentData) {
    await this.delay();
    const newStudent = {
      Id: Math.max(...this.data.map(s => s.Id), 0) + 1,
      ...studentData
    };
    this.data.push(newStudent);
    return { ...newStudent };
  }

  async update(id, studentData) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    this.data[index] = { ...this.data[index], ...studentData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export const studentsService = new StudentsService();