import childrenData from "@/services/mockData/children.json";

class ChildrenService {
  constructor() {
    this.children = [...childrenData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.children];
  }

  async getById(id) {
    await this.delay(200);
    const child = this.children.find(c => c.Id === parseInt(id));
    return child ? { ...child } : null;
  }

  async create(childData) {
    await this.delay(400);
    const newId = Math.max(...this.children.map(c => c.Id)) + 1;
    const newChild = {
      Id: newId,
      ...childData,
      currentLevel: 1,
      totalStars: 0,
      createdAt: new Date().toISOString()
    };
    this.children.push(newChild);
    return { ...newChild };
  }

  async update(id, childData) {
    await this.delay(300);
    const index = this.children.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      this.children[index] = { ...this.children[index], ...childData };
      return { ...this.children[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay(200);
    const index = this.children.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      this.children.splice(index, 1);
      return true;
    }
    return false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ChildrenService();