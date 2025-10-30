import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(id) {
    await delay(200);
    return courses.find(course => course.Id === parseInt(id));
  },

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      Id: Math.max(...courses.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    courses.push(newCourse);
    return newCourse;
  },

  async update(id, courseData) {
    await delay(400);
    const index = courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      courses[index] = {
        ...courses[index],
        ...courseData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return courses[index];
    }
    throw new Error("Course not found");
  },

  async delete(id) {
    await delay(300);
    const index = courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      const deleted = courses.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Course not found");
  },

  async filterByDepartment(departmentId) {
    await delay(200);
    return courses.filter(course => course.departmentId === departmentId);
  }
};