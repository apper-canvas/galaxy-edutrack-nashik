import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    return students.find(student => student.Id === parseInt(id));
  },

  async create(studentData) {
    await delay(400);
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    students.push(newStudent);
    return newStudent;
  },

  async update(id, studentData) {
    await delay(400);
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      students[index] = {
        ...students[index],
        ...studentData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return students[index];
    }
    throw new Error("Student not found");
  },

  async delete(id) {
    await delay(300);
    const index = students.findIndex(student => student.Id === parseInt(id));
    if (index !== -1) {
      const deleted = students.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Student not found");
  },

  async search(query) {
    await delay(200);
    return students.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.studentId.toLowerCase().includes(query.toLowerCase())
    );
  },

  async filterByClass(className) {
    await delay(200);
    return students.filter(student => student.class === className);
  },

  async filterByDepartment(departmentId) {
    await delay(200);
    return students.filter(student => student.departmentId === departmentId);
  }
};