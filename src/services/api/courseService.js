import { getApperClient } from "@/services/apperClient";

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("course_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "credit_hours_c" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "assigned_teacher_id_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("course_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "credit_hours_c" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "assigned_teacher_id_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Name: courseData.name_c,
          course_id_c: courseData.course_id_c,
          name_c: courseData.name_c,
          description_c: courseData.description_c,
          credit_hours_c: parseInt(courseData.credit_hours_c),
          department_id_c: parseInt(courseData.department_id_c?.Id || courseData.department_id_c),
          assigned_teacher_id_c: parseInt(courseData.assigned_teacher_id_c?.Id || courseData.assigned_teacher_id_c)
        }]
      };

      const response = await apperClient.createRecord("course_c", payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to create course");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: courseData.name_c,
          course_id_c: courseData.course_id_c,
          name_c: courseData.name_c,
          description_c: courseData.description_c,
          credit_hours_c: parseInt(courseData.credit_hours_c),
          department_id_c: parseInt(courseData.department_id_c?.Id || courseData.department_id_c),
          assigned_teacher_id_c: parseInt(courseData.assigned_teacher_id_c?.Id || courseData.assigned_teacher_id_c)
        }]
      };

      const response = await apperClient.updateRecord("course_c", payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to update course");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("course_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to delete course");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async filterByDepartment(departmentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("course_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "credit_hours_c" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "assigned_teacher_id_c" } }
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
      console.error("Error filtering courses by department:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};