import gradesData from "@/services/mockData/grades.json";

class GradesService {
  constructor() {
    this.data = [...gradesData];
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
    const grade = this.data.find(item => item.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async create(gradeData) {
    await this.delay();
    const newGrade = {
      Id: Math.max(...this.data.map(g => g.Id), 0) + 1,
      ...gradeData
    };
    this.data.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    this.data[index] = { ...this.data[index], ...gradeData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    this.data.splice(index, 1);
    return true;
  }

  async getByStudent(studentId) {
    await this.delay();
    return this.data.filter(grade => grade.studentId === parseInt(studentId));
  }

  async getByAssignment(assignmentId) {
    await this.delay();
    return this.data.filter(grade => grade.assignmentId === parseInt(assignmentId));
  }
}

export const gradesService = new GradesService();