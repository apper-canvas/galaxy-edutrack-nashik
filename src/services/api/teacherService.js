import teachersData from "@/services/mockData/teachers.json";

let teachers = [...teachersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const teacherService = {
  async getAll() {
    await delay(300);
    return [...teachers];
  },

  async getById(id) {
    await delay(200);
    return teachers.find(teacher => teacher.Id === parseInt(id));
  },

  async create(teacherData) {
    await delay(400);
    const newTeacher = {
      ...teacherData,
      Id: Math.max(...teachers.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    teachers.push(newTeacher);
    return newTeacher;
  },

  async update(id, teacherData) {
    await delay(400);
    const index = teachers.findIndex(teacher => teacher.Id === parseInt(id));
    if (index !== -1) {
      teachers[index] = {
        ...teachers[index],
        ...teacherData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return teachers[index];
    }
    throw new Error("Teacher not found");
  },

  async delete(id) {
    await delay(300);
    const index = teachers.findIndex(teacher => teacher.Id === parseInt(id));
    if (index !== -1) {
      const deleted = teachers.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Teacher not found");
  },

  async filterByDepartment(departmentId) {
    await delay(200);
    return teachers.filter(teacher => teacher.departmentId === departmentId);
  }
};