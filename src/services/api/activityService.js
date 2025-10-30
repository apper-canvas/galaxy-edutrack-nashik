import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    return activities.find(activity => activity.Id === parseInt(id));
  },

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    activities.push(newActivity);
    return newActivity;
  },

  async update(id, activityData) {
    await delay(400);
    const index = activities.findIndex(activity => activity.Id === parseInt(id));
    if (index !== -1) {
      activities[index] = {
        ...activities[index],
        ...activityData,
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };
      return activities[index];
    }
    throw new Error("Activity not found");
  },

  async delete(id) {
    await delay(300);
    const index = activities.findIndex(activity => activity.Id === parseInt(id));
    if (index !== -1) {
      const deleted = activities.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Activity not found");
  },

  async filterByDepartment(departmentId) {
    await delay(200);
    return activities.filter(activity => activity.departmentId === departmentId);
  },

  async filterByStatus(status) {
    await delay(200);
    return activities.filter(activity => activity.status === status);
  }
};