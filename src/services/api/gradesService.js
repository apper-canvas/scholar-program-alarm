class GradesService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'grade_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "assignment_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching grades:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submittedDate: grade.submitted_date_c || '',
        comments: grade.comments_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c || null,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades:", error);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "assignment_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching grade:", response.message);
        throw new Error(response.message || "Grade not found");
      }

      if (!response.data) {
        throw new Error("Grade not found");
      }

      // Transform database fields to match UI expectations
      const grade = response.data;
      return {
        Id: grade.Id,
        score: grade.score_c || 0,
        submittedDate: grade.submitted_date_c || '',
        comments: grade.comments_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c || null,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grade with ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grade:", error);
        throw error;
      }
    }
  }

  async create(gradeData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: `Grade for Student ${gradeData.studentId}`,
          score_c: parseFloat(gradeData.score),
          submitted_date_c: gradeData.submittedDate,
          comments_c: gradeData.comments || '',
          student_id_c: parseInt(gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignmentId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error creating grade:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create grade records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdGrade = successfulRecords[0].data;
          // Transform back to UI format
          return {
            Id: createdGrade.Id,
            score: createdGrade.score_c || 0,
            submittedDate: createdGrade.submitted_date_c || '',
            comments: createdGrade.comments_c || '',
            studentId: createdGrade.student_id_c?.Id || createdGrade.student_id_c || null,
            assignmentId: createdGrade.assignment_id_c?.Id || createdGrade.assignment_id_c || null
          };
        }
      }

      throw new Error("Failed to create grade");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating grade:", error);
        throw error;
      }
    }
  }

  async update(id, gradeData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Grade for Student ${gradeData.studentId}`,
          score_c: parseFloat(gradeData.score),
          submitted_date_c: gradeData.submittedDate,
          comments_c: gradeData.comments || '',
          student_id_c: parseInt(gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignmentId)
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error updating grade:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update grade records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedGrade = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            Id: updatedGrade.Id,
            score: updatedGrade.score_c || 0,
            submittedDate: updatedGrade.submitted_date_c || '',
            comments: updatedGrade.comments_c || '',
            studentId: updatedGrade.student_id_c?.Id || updatedGrade.student_id_c || null,
            assignmentId: updatedGrade.assignment_id_c?.Id || updatedGrade.assignment_id_c || null
          };
        }
      }

      throw new Error("Failed to update grade");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating grade:", error);
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
        console.error("Error deleting grade:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete grade records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting grade:", error);
        throw error;
      }
    }
  }

  async getByStudent(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "assignment_id_c" },
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
        console.error("Error fetching grades by student:", response.message);
        throw new Error(response.message);
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submittedDate: grade.submitted_date_c || '',
        comments: grade.comments_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c || null,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades by student:", error);
        throw error;
      }
    }
  }

  async getByAssignment(assignmentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score_c" } },
          { field: { Name: "submitted_date_c" } },
          { field: { Name: "comments_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "assignment_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "assignment_id_c",
            Operator: "EqualTo",
            Values: [parseInt(assignmentId)]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching grades by assignment:", response.message);
        throw new Error(response.message);
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submittedDate: grade.submitted_date_c || '',
        comments: grade.comments_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c || null,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades by assignment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grades by assignment:", error);
        throw error;
      }
    }
  }
}

export const gradesService = new GradesService();