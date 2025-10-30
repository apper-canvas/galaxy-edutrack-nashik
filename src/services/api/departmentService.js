import departmentsData from "@/services/mockData/departments.json";

let departments = [...departmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  async getAll() {
    await delay(300);
    return [...departments];
  },

  async getById(id) {
    await delay(200);
    return departments.find(dept => dept.Id === parseInt(id));
  },

  async create(deptData) {
    await delay(400);
    const newDept = {
      ...deptData,
      Id: Math.max(...departments.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    departments.push(newDept);
    return newDept;
  },

  async update(id, deptData) {
    await delay(400);
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index !== -1) {
      departments[index] = {
        ...departments[index],
        ...deptData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return departments[index];
    }
    throw new Error("Department not found");
  },

  async delete(id) {
    await delay(300);
    const index = departments.findIndex(dept => dept.Id === parseInt(id));
    if (index !== -1) {
      const deleted = departments.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Department not found");
  }
};