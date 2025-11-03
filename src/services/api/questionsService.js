import questionsData from "@/services/mockData/questions.json";

class QuestionsService {
  constructor() {
    this.questions = [...questionsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.questions];
  }

  async getById(id) {
    await this.delay(200);
    const question = this.questions.find(q => q.Id === parseInt(id));
    return question ? { ...question } : null;
  }

  async getByLevelId(levelId) {
    await this.delay(250);
    const levelQuestions = this.questions.filter(q => q.levelId === levelId.toString());
    // Return randomized subset of questions for the level
    const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length)).map(q => ({ ...q }));
  }

  async getBySubject(subject) {
    await this.delay(300);
    return this.questions.filter(q => q.subject === subject).map(q => ({ ...q }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new QuestionsService();