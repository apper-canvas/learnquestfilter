import levelsData from "@/services/mockData/levels.json";

class LevelsService {
  constructor() {
    this.levels = [...levelsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.levels];
  }

  async getById(id) {
    await this.delay(200);
    const level = this.levels.find(l => l.Id === parseInt(id));
    return level ? { ...level } : null;
  }

  async getBySubject(subject) {
    await this.delay(250);
    return this.levels.filter(l => l.subject === subject).map(l => ({ ...l }));
  }

  async updateLockStatus(id, isLocked) {
    await this.delay(200);
    const index = this.levels.findIndex(l => l.Id === parseInt(id));
    if (index !== -1) {
      this.levels[index].isLocked = isLocked;
      return { ...this.levels[index] };
    }
    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new LevelsService();