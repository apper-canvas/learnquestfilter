class QuestionsService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "question_c"}},
          {"field": {"Name": "correct_answer_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "level_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "type_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('question_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching questions:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "question_c"}},
          {"field": {"Name": "correct_answer_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "level_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "type_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('question_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching question ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByLevelId(levelId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "question_c"}},
          {"field": {"Name": "correct_answer_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "level_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "type_c"}}
        ],
        where: [{"FieldName": "level_id_c", "Operator": "EqualTo", "Values": [levelId.toString()]}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('question_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Return randomized subset of questions for the level
      const questions = response.data || [];
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(10, shuffled.length));
    } catch (error) {
      console.error("Error fetching questions by level:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getBySubject(subject) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "question_c"}},
          {"field": {"Name": "correct_answer_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "level_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "type_c"}}
        ],
        where: [{"FieldName": "subject_c", "Operator": "EqualTo", "Values": [subject]}]
      };
      
      const response = await this.apperClient.fetchRecords('question_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching questions by subject:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new QuestionsService();