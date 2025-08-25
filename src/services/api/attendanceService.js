import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.data = [...attendanceData];
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
    const attendance = this.data.find(item => item.Id === parseInt(id));
    if (!attendance) {
      throw new Error("Attendance record not found");
    }
    return { ...attendance };
  }

  async create(attendanceData) {
    await this.delay();
    const newAttendance = {
      Id: Math.max(...this.data.map(a => a.Id), 0) + 1,
      ...attendanceData
    };
    this.data.push(newAttendance);
    return { ...newAttendance };
  }

  async update(id, attendanceData) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    this.data[index] = { ...this.data[index], ...attendanceData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    
    this.data.splice(index, 1);
    return true;
  }

  async getByStudent(studentId) {
    await this.delay();
    return this.data.filter(record => record.studentId === parseInt(studentId));
  }

  async getByDate(date) {
    await this.delay();
    const targetDate = new Date(date).toDateString();
    return this.data.filter(record => 
      new Date(record.date).toDateString() === targetDate
    );
  }
}

export const attendanceService = new AttendanceService();