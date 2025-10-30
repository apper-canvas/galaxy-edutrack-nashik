import { getApperClient } from "@/services/apperClient";

export const teacherService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("teacher_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "teacher_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "subjects_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "joining_date_c" } },
          { field: { Name: "qualification_c" } },
          { field: { Name: "department_id_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching teachers:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("teacher_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "teacher_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "subjects_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "joining_date_c" } },
          { field: { Name: "qualification_c" } },
          { field: { Name: "department_id_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching teacher ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(teacherData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const subjectsString = Array.isArray(teacherData.subjects_c) 
        ? teacherData.subjects_c.join(',') 
        : teacherData.subjects_c;

      const payload = {
        records: [{
          Name: teacherData.name_c,
          teacher_id_c: teacherData.teacher_id_c,
          name_c: teacherData.name_c,
          gender_c: teacherData.gender_c,
          subjects_c: subjectsString,
          email_c: teacherData.email_c,
          contact_c: teacherData.contact_c,
          joining_date_c: teacherData.joining_date_c,
          qualification_c: teacherData.qualification_c,
          department_id_c: parseInt(teacherData.department_id_c?.Id || teacherData.department_id_c)
        }]
      };

      const response = await apperClient.createRecord("teacher_c", payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to create teacher");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating teacher:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, teacherData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const subjectsString = Array.isArray(teacherData.subjects_c) 
        ? teacherData.subjects_c.join(',') 
        : teacherData.subjects_c;

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: teacherData.name_c,
          teacher_id_c: teacherData.teacher_id_c,
          name_c: teacherData.name_c,
          gender_c: teacherData.gender_c,
          subjects_c: subjectsString,
          email_c: teacherData.email_c,
          contact_c: teacherData.contact_c,
          joining_date_c: teacherData.joining_date_c,
          qualification_c: teacherData.qualification_c,
          department_id_c: parseInt(teacherData.department_id_c?.Id || teacherData.department_id_c)
        }]
      };

      const response = await apperClient.updateRecord("teacher_c", payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to update teacher");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating teacher:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("teacher_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to delete teacher");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting teacher:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async filterByDepartment(departmentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("teacher_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "teacher_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "subjects_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "joining_date_c" } },
          { field: { Name: "qualification_c" } },
          { field: { Name: "department_id_c" } }
        ],
        where: [{
          FieldName: "department_id_c",
          Operator: "EqualTo",
          Values: [parseInt(departmentId)]
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error filtering teachers by department:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};