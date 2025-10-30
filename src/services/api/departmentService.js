import { getApperClient } from "@/services/apperClient";

export const departmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("department_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "head_of_department_c" } },
          { field: { Name: "description_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("department_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "head_of_department_c" } },
          { field: { Name: "description_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(deptData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Name: deptData.name_c,
          department_id_c: deptData.department_id_c,
          name_c: deptData.name_c,
          head_of_department_c: deptData.head_of_department_c,
          description_c: deptData.description_c
        }]
      };

      const response = await apperClient.createRecord("department_c", payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to create department");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, deptData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: deptData.name_c,
          department_id_c: deptData.department_id_c,
          name_c: deptData.name_c,
          head_of_department_c: deptData.head_of_department_c,
          description_c: deptData.description_c
        }]
      };

      const response = await apperClient.updateRecord("department_c", payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to update department");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("department_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to delete department");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};