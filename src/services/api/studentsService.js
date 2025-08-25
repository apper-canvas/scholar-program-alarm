class StudentsService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'student_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "parent_name_c" } },
          { field: { Name: "parent_email_c" } },
          { field: { Name: "parent_phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching students:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        grade: student.grade_c || '',
        dateOfBirth: student.date_of_birth_c || '',
        email: student.email_c || '',
        phone: student.phone_c || '',
        parentName: student.parent_name_c || '',
        parentEmail: student.parent_email_c || '',
        parentPhone: student.parent_phone_c || '',
        address: student.address_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        status: student.status_c || 'active'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching students:", error);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "parent_name_c" } },
          { field: { Name: "parent_email_c" } },
          { field: { Name: "parent_phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching student:", response.message);
        throw new Error(response.message || "Student not found");
      }

      if (!response.data) {
        throw new Error("Student not found");
      }

      // Transform database fields to match UI expectations
      const student = response.data;
      return {
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        grade: student.grade_c || '',
        dateOfBirth: student.date_of_birth_c || '',
        email: student.email_c || '',
        phone: student.phone_c || '',
        parentName: student.parent_name_c || '',
        parentEmail: student.parent_email_c || '',
        parentPhone: student.parent_phone_c || '',
        address: student.address_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        status: student.status_c || 'active'
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching student with ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching student:", error);
        throw error;
      }
    }
  }

  async create(studentData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          grade_c: studentData.grade,
          date_of_birth_c: studentData.dateOfBirth,
          email_c: studentData.email,
          phone_c: studentData.phone,
          parent_name_c: studentData.parentName,
          parent_email_c: studentData.parentEmail,
          parent_phone_c: studentData.parentPhone,
          address_c: studentData.address,
          enrollment_date_c: studentData.enrollmentDate,
          status_c: studentData.status || 'active'
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error creating student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create student records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdStudent = successfulRecords[0].data;
          // Transform back to UI format
          return {
            Id: createdStudent.Id,
            firstName: createdStudent.first_name_c || '',
            lastName: createdStudent.last_name_c || '',
            grade: createdStudent.grade_c || '',
            dateOfBirth: createdStudent.date_of_birth_c || '',
            email: createdStudent.email_c || '',
            phone: createdStudent.phone_c || '',
            parentName: createdStudent.parent_name_c || '',
            parentEmail: createdStudent.parent_email_c || '',
            parentPhone: createdStudent.parent_phone_c || '',
            address: createdStudent.address_c || '',
            enrollmentDate: createdStudent.enrollment_date_c || '',
            status: createdStudent.status_c || 'active'
          };
        }
      }

      throw new Error("Failed to create student");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating student:", error);
        throw error;
      }
    }
  }

  async update(id, studentData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          grade_c: studentData.grade,
          date_of_birth_c: studentData.dateOfBirth,
          email_c: studentData.email,
          phone_c: studentData.phone,
          parent_name_c: studentData.parentName,
          parent_email_c: studentData.parentEmail,
          parent_phone_c: studentData.parentPhone,
          address_c: studentData.address,
          enrollment_date_c: studentData.enrollmentDate,
          status_c: studentData.status || 'active'
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error updating student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update student records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedStudent = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            Id: updatedStudent.Id,
            firstName: updatedStudent.first_name_c || '',
            lastName: updatedStudent.last_name_c || '',
            grade: updatedStudent.grade_c || '',
            dateOfBirth: updatedStudent.date_of_birth_c || '',
            email: updatedStudent.email_c || '',
            phone: updatedStudent.phone_c || '',
            parentName: updatedStudent.parent_name_c || '',
            parentEmail: updatedStudent.parent_email_c || '',
            parentPhone: updatedStudent.parent_phone_c || '',
            address: updatedStudent.address_c || '',
            enrollmentDate: updatedStudent.enrollment_date_c || '',
            status: updatedStudent.status_c || 'active'
          };
        }
      }

      throw new Error("Failed to update student");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating student:", error);
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
        console.error("Error deleting student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete student records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting student:", error);
        throw error;
      }
    }
  }
}

export const studentsService = new StudentsService();