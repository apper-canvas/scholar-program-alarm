class AttendanceService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        pagingInfo: {
          limit: 200,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching attendance:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      return response.data.map(attendance => ({
        Id: attendance.Id,
        date: attendance.date_c || '',
        status: attendance.status_c || '',
        reason: attendance.reason_c || '',
        studentId: attendance.student_id_c?.Id || attendance.student_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance:", error);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching attendance record:", response.message);
        throw new Error(response.message || "Attendance record not found");
      }

      if (!response.data) {
        throw new Error("Attendance record not found");
      }

      // Transform database fields to match UI expectations
      const attendance = response.data;
      return {
        Id: attendance.Id,
        date: attendance.date_c || '',
        status: attendance.status_c || '',
        reason: attendance.reason_c || '',
        studentId: attendance.student_id_c?.Id || attendance.student_id_c || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance record with ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance record:", error);
        throw error;
      }
    }
  }

  async create(attendanceData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: `Attendance for ${attendanceData.date}`,
          date_c: attendanceData.date,
          status_c: attendanceData.status,
          reason_c: attendanceData.reason || '',
          student_id_c: parseInt(attendanceData.studentId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error creating attendance record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdAttendance = successfulRecords[0].data;
          // Transform back to UI format
          return {
            Id: createdAttendance.Id,
            date: createdAttendance.date_c || '',
            status: createdAttendance.status_c || '',
            reason: createdAttendance.reason_c || '',
            studentId: createdAttendance.student_id_c?.Id || createdAttendance.student_id_c || null
          };
        }
      }

      throw new Error("Failed to create attendance record");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating attendance record:", error);
        throw error;
      }
    }
  }

  async update(id, attendanceData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Attendance for ${attendanceData.date}`,
          date_c: attendanceData.date,
          status_c: attendanceData.status,
          reason_c: attendanceData.reason || '',
          student_id_c: parseInt(attendanceData.studentId)
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error updating attendance record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update attendance records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedAttendance = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            Id: updatedAttendance.Id,
            date: updatedAttendance.date_c || '',
            status: updatedAttendance.status_c || '',
            reason: updatedAttendance.reason_c || '',
            studentId: updatedAttendance.student_id_c?.Id || updatedAttendance.student_id_c || null
          };
        }
      }

      throw new Error("Failed to update attendance record");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating attendance record:", error);
        throw error;
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error deleting attendance record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete attendance records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting attendance record:", error);
        throw error;
      }
    }
  }

  async getByStudent(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching attendance by student:", response.message);
        throw new Error(response.message);
      }

      return response.data.map(attendance => ({
        Id: attendance.Id,
        date: attendance.date_c || '',
        status: attendance.status_c || '',
        reason: attendance.reason_c || '',
        studentId: attendance.student_id_c?.Id || attendance.student_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by student:", error);
        throw error;
      }
    }
  }

  async getByDate(date) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching attendance by date:", response.message);
        throw new Error(response.message);
      }

      return response.data.map(attendance => ({
        Id: attendance.Id,
        date: attendance.date_c || '',
        status: attendance.status_c || '',
        reason: attendance.reason_c || '',
        studentId: attendance.student_id_c?.Id || attendance.student_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by date:", error);
        throw error;
      }
    }
  }
}

export const attendanceService = new AttendanceService();