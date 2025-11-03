import activitiesData from "@/services/mockData/activities.json";

class ActivitiesService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.activities];
  }

  async getById(id) {
    await this.delay(200);
    const activity = this.activities.find(a => a.Id === parseInt(id));
    return activity ? { ...activity } : null;
  }

  async getByChildId(childId) {
    await this.delay(250);
    return this.activities.filter(a => a.childId === childId.toString()).map(a => ({ ...a }));
  }

  async getByLevelId(levelId) {
    await this.delay(250);
    return this.activities.filter(a => a.levelId === levelId.toString()).map(a => ({ ...a }));
  }

  async create(activityData) {
    await this.delay(400);
    const newId = Math.max(...this.activities.map(a => a.Id)) + 1;
    const newActivity = {
      Id: newId,
      ...activityData,
      completedAt: new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay(300);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.activities[index] = { ...this.activities[index], ...activityData };
      return { ...this.activities[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(200);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.activities.splice(index, 1);
      return true;
    }
    return false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ActivitiesService();