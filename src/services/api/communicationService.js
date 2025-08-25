class CommunicationService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'communication_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "teacher_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "created_at_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "teacher_id_c" },
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
        console.error("Error fetching communications:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to match UI expectations
      return response.data.map(communication => ({
        Id: communication.Id,
        teacherName: communication.teacher_name_c || '',
        date: communication.date_c || '',
        type: communication.type_c || '',
        subject: communication.subject_c || '',
        notes: communication.notes_c || '',
        followUpRequired: communication.follow_up_required_c || false,
        createdAt: communication.created_at_c || new Date().toISOString(),
        studentId: communication.student_id_c?.Id || communication.student_id_c || null,
        teacherId: communication.teacher_id_c?.Id || communication.teacher_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communications:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching communications:", error);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "teacher_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "created_at_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "teacher_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error("Error fetching communication:", response.message);
        throw new Error(response.message || "Communication not found");
      }

      if (!response.data) {
        throw new Error("Communication not found");
      }

      // Transform database fields to match UI expectations
      const communication = response.data;
      return {
        Id: communication.Id,
        teacherName: communication.teacher_name_c || '',
        date: communication.date_c || '',
        type: communication.type_c || '',
        subject: communication.subject_c || '',
        notes: communication.notes_c || '',
        followUpRequired: communication.follow_up_required_c || false,
        createdAt: communication.created_at_c || new Date().toISOString(),
        studentId: communication.student_id_c?.Id || communication.student_id_c || null,
        teacherId: communication.teacher_id_c?.Id || communication.teacher_id_c || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communication with ID:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching communication:", error);
        throw error;
      }
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "teacher_name_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "subject_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "follow_up_required_c" } },
          { field: { Name: "created_at_c" } },
          { 
            field: { name: "student_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { name: "teacher_id_c" },
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
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Error fetching communications by student:", response.message);
        throw new Error(response.message);
      }

      return response.data.map(communication => ({
        Id: communication.Id,
        teacherName: communication.teacher_name_c || '',
        date: communication.date_c || '',
        type: communication.type_c || '',
        subject: communication.subject_c || '',
        notes: communication.notes_c || '',
        followUpRequired: communication.follow_up_required_c || false,
        createdAt: communication.created_at_c || new Date().toISOString(),
        studentId: communication.student_id_c?.Id || communication.student_id_c || null,
        teacherId: communication.teacher_id_c?.Id || communication.teacher_id_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching communications by student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching communications by student:", error);
        throw error;
      }
    }
  }

  async create(communicationData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: communicationData.subject,
          teacher_name_c: communicationData.teacherName,
          date_c: communicationData.date,
          type_c: communicationData.type,
          subject_c: communicationData.subject,
          notes_c: communicationData.notes,
          follow_up_required_c: communicationData.followUpRequired || false,
          created_at_c: new Date().toISOString(),
          student_id_c: parseInt(communicationData.studentId),
          teacher_id_c: communicationData.teacherId ? parseInt(communicationData.teacherId) : null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error creating communication:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create communication records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdCommunication = successfulRecords[0].data;
          // Transform back to UI format
          return {
            Id: createdCommunication.Id,
            teacherName: createdCommunication.teacher_name_c || '',
            date: createdCommunication.date_c || '',
            type: createdCommunication.type_c || '',
            subject: createdCommunication.subject_c || '',
            notes: createdCommunication.notes_c || '',
            followUpRequired: createdCommunication.follow_up_required_c || false,
            createdAt: createdCommunication.created_at_c || new Date().toISOString(),
            studentId: createdCommunication.student_id_c?.Id || createdCommunication.student_id_c || null,
            teacherId: createdCommunication.teacher_id_c?.Id || createdCommunication.teacher_id_c || null
          };
        }
      }

      throw new Error("Failed to create communication");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating communication:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating communication:", error);
        throw error;
      }
    }
  }

  async update(id, communicationData) {
    try {
      // Transform UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Id: parseInt(id),
          Name: communicationData.subject,
          teacher_name_c: communicationData.teacherName,
          date_c: communicationData.date,
          type_c: communicationData.type,
          subject_c: communicationData.subject,
          notes_c: communicationData.notes,
          follow_up_required_c: communicationData.followUpRequired || false,
          student_id_c: parseInt(communicationData.studentId),
          teacher_id_c: communicationData.teacherId ? parseInt(communicationData.teacherId) : null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Error updating communication:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update communication records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedCommunication = successfulUpdates[0].data;
          // Transform back to UI format
          return {
            Id: updatedCommunication.Id,
            teacherName: updatedCommunication.teacher_name_c || '',
            date: updatedCommunication.date_c || '',
            type: updatedCommunication.type_c || '',
            subject: updatedCommunication.subject_c || '',
            notes: updatedCommunication.notes_c || '',
            followUpRequired: updatedCommunication.follow_up_required_c || false,
            createdAt: updatedCommunication.created_at_c || new Date().toISOString(),
            studentId: updatedCommunication.student_id_c?.Id || updatedCommunication.student_id_c || null,
            teacherId: updatedCommunication.teacher_id_c?.Id || updatedCommunication.teacher_id_c || null
          };
        }
      }

      throw new Error("Failed to update communication");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating communication:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating communication:", error);
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
        console.error("Error deleting communication:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete communication records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting communication:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting communication:", error);
        throw error;
      }
    }
  }
}

export const communicationService = new CommunicationService();