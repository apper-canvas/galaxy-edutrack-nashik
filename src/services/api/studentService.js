import { getApperClient } from "@/services/apperClient";

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("student_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "dob_c" } },
          { field: { Name: "class_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardian_name_c" } },
          { field: { Name: "guardian_contact_c" } },
          { field: { Name: "guardian_relation_c" } },
          { field: { Name: "admission_date_c" } },
          { field: { Name: "profile_photo_c" } },
          { field: { Name: "department_id_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("student_c", id, {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "dob_c" } },
          { field: { Name: "class_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardian_name_c" } },
          { field: { Name: "guardian_contact_c" } },
          { field: { Name: "guardian_relation_c" } },
          { field: { Name: "admission_date_c" } },
          { field: { Name: "profile_photo_c" } },
          { field: { Name: "department_id_c" } }
        ]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Name: studentData.name_c,
          student_id_c: studentData.student_id_c,
          name_c: studentData.name_c,
          gender_c: studentData.gender_c,
          dob_c: studentData.dob_c,
          class_c: studentData.class_c,
          contact_c: studentData.contact_c,
          address_c: studentData.address_c,
          guardian_name_c: studentData.guardian_name_c,
          guardian_contact_c: studentData.guardian_contact_c,
          guardian_relation_c: studentData.guardian_relation_c,
          admission_date_c: studentData.admission_date_c,
          profile_photo_c: studentData.profile_photo_c,
          department_id_c: parseInt(studentData.department_id_c?.Id || studentData.department_id_c)
        }]
      };

      const response = await apperClient.createRecord("student_c", payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to create student");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: studentData.name_c,
          student_id_c: studentData.student_id_c,
          name_c: studentData.name_c,
          gender_c: studentData.gender_c,
          dob_c: studentData.dob_c,
          class_c: studentData.class_c,
          contact_c: studentData.contact_c,
          address_c: studentData.address_c,
          guardian_name_c: studentData.guardian_name_c,
          guardian_contact_c: studentData.guardian_contact_c,
          guardian_relation_c: studentData.guardian_relation_c,
          admission_date_c: studentData.admission_date_c,
          profile_photo_c: studentData.profile_photo_c,
          department_id_c: parseInt(studentData.department_id_c?.Id || studentData.department_id_c)
        }]
      };

      const response = await apperClient.updateRecord("student_c", payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to update student");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("student_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          throw new Error(failed[0].message || "Failed to delete student");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("student_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "dob_c" } },
          { field: { Name: "class_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardian_name_c" } },
          { field: { Name: "guardian_contact_c" } },
          { field: { Name: "guardian_relation_c" } },
          { field: { Name: "admission_date_c" } },
          { field: { Name: "profile_photo_c" } },
          { field: { Name: "department_id_c" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "name_c",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "student_id_c",
                operator: "Contains",
                values: [query]
              }],
              operator: "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching students:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async filterByClass(className) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("student_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "dob_c" } },
          { field: { Name: "class_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardian_name_c" } },
          { field: { Name: "guardian_contact_c" } },
          { field: { Name: "guardian_relation_c" } },
          { field: { Name: "admission_date_c" } },
          { field: { Name: "profile_photo_c" } },
          { field: { Name: "department_id_c" } }
        ],
        where: [{
          FieldName: "class_c",
          Operator: "EqualTo",
          Values: [className]
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error filtering students by class:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async filterByDepartment(departmentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("student_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "name_c" } },
          { field: { Name: "gender_c" } },
          { field: { Name: "dob_c" } },
          { field: { Name: "class_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "guardian_name_c" } },
          { field: { Name: "guardian_contact_c" } },
          { field: { Name: "guardian_relation_c" } },
          { field: { Name: "admission_date_c" } },
          { field: { Name: "profile_photo_c" } },
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
      console.error("Error filtering students by department:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};