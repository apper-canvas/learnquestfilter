import progressData from "@/services/mockData/progress.json";

class ProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.progress];
  }

  async getByChildId(childId) {
    await this.delay(250);
    return this.progress.filter(p => p.childId === childId.toString()).map(p => ({ ...p }));
  }

  async getBySubject(childId, subject) {
    await this.delay(200);
    return this.progress.filter(p => p.childId === childId.toString() && p.subject === subject).map(p => ({ ...p }));
  }

  async updateProgress(childId, subject, skillArea, masteryLevel) {
    await this.delay(300);
    const index = this.progress.findIndex(p => 
      p.childId === childId.toString() && 
      p.subject === subject && 
      p.skillArea === skillArea
    );
    
    if (index !== -1) {
      this.progress[index] = {
        ...this.progress[index],
        masteryLevel,
        practiceCount: this.progress[index].practiceCount + 1,
        lastPracticed: new Date().toISOString()
      };
      return { ...this.progress[index] };
    } else {
      const newProgress = {
        childId: childId.toString(),
        subject,
        skillArea,
        masteryLevel,
        practiceCount: 1,
        lastPracticed: new Date().toISOString()
      };
      this.progress.push(newProgress);
      return { ...newProgress };
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ProgressService();