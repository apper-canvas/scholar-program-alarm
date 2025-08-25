class AssignmentsService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "class_id_c" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching assignments:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        category: assignment.category_c || '',
        totalPoints: assignment.total_points_c || 0,
        dueDate: assignment.due_date_c || '',
        classId: assignment.class_id_c || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching assignments:", error);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "total_points_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "class_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching assignment:", response.message);
        throw new Error(response.message || "Assignment not found");
      }

      if (!response.data) {
        throw new Error("Assignment not found");
      }

      // Transform database fields to match UI expectations
      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c || '',
        category: assignment.category_c || '',
        totalPoints: assignment.total_points_c || 0,
        dueDate: assignment.due_date_c || '',
        classId: assignment.class_id_c || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignment with ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching assignment:", error);
        throw error;
      }
    }
  }

  async create(assignmentData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: assignmentData.title,
          title_c: assignmentData.title,
          category_c: assignmentData.category,
          total_points_c: parseInt(assignmentData.totalPoints),
          due_date_c: assignmentData.dueDate,
          class_id_c: assignmentData.classId
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error creating assignment:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create assignment records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdAssignment = successfulRecords[0].data;
          // Transform back to UI format
          return {
            Id: createdAssignment.Id,
            title: createdAssignment.title_c || '',
            category: createdAssignment.category_c || '',
            totalPoints: createdAssignment.total_points_c || 0,
            dueDate: createdAssignment.due_date_c || '',
            classId: createdAssignment.class_id_c || ''
          };
        }
      }

      throw new Error("Failed to create assignment");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating assignment:", error);
        throw error;
      }
    }
  }

  async update(id, assignmentData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.title,
          title_c: assignmentData.title,
          category_c: assignmentData.category,
          total_points_c: parseInt(assignmentData.totalPoints),
          due_date_c: assignmentData.dueDate,
          class_id_c: assignmentData.classId
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error updating assignment:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignment records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedAssignment = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            Id: updatedAssignment.Id,
            title: updatedAssignment.title_c || '',
            category: updatedAssignment.category_c || '',
            totalPoints: updatedAssignment.total_points_c || 0,
            dueDate: updatedAssignment.due_date_c || '',
            classId: updatedAssignment.class_id_c || ''
          };
        }
      }

      throw new Error("Failed to update assignment");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating assignment:", error);
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
        console.error("Error deleting assignment:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete assignment records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting assignment:", error);
        throw error;
      }
    }
  }
}

export const assignmentsService = new AssignmentsService();