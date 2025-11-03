import { toast } from 'react-toastify';

class ActivitiesService {
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
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "correct_answers_c"}},
          {"field": {"Name": "level_id_c"}},
          {"field": {"Name": "stars_earned_c"}},
          {"field": {"Name": "time_spent_c"}},
          {"field": {"Name": "total_questions_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "correct_answers_c"}},
          {"field": {"Name": "level_id_c"}},
          {"field": {"Name": "stars_earned_c"}},
          {"field": {"Name": "time_spent_c"}},
          {"field": {"Name": "total_questions_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('activity_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByChildId(childId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "correct_answers_c"}},
          {"field": {"Name": "level_id_c"}},
          {"field": {"Name": "stars_earned_c"}},
          {"field": {"Name": "time_spent_c"}},
          {"field": {"Name": "total_questions_c"}}
        ],
        where: [{"FieldName": "child_id_c", "Operator": "EqualTo", "Values": [childId.toString()]}],
        orderBy: [{"fieldName": "completed_at_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by child:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByLevelId(levelId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "correct_answers_c"}},
          {"field": {"Name": "level_id_c"}},
          {"field": {"Name": "stars_earned_c"}},
          {"field": {"Name": "time_spent_c"}},
          {"field": {"Name": "total_questions_c"}}
        ],
        where: [{"FieldName": "level_id_c", "Operator": "EqualTo", "Values": [levelId.toString()]}]
      };
      
      const response = await this.apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by level:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(activityData) {
    try {
      const params = {
        records: [{
          Name: `Activity ${Date.now()}`,
          child_id_c: activityData.childId?.toString() || activityData.child_id_c?.toString(),
          level_id_c: activityData.levelId?.toString() || activityData.level_id_c?.toString(),
          stars_earned_c: activityData.starsEarned || activityData.stars_earned_c,
          correct_answers_c: activityData.correctAnswers || activityData.correct_answers_c,
          total_questions_c: activityData.totalQuestions || activityData.total_questions_c,
          time_spent_c: activityData.timeSpent || activityData.time_spent_c,
          completed_at_c: activityData.completedAt || activityData.completed_at_c || new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      toast.error("Failed to create activity");
      return null;
    }
  }

  async update(id, activityData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          child_id_c: activityData.childId?.toString() || activityData.child_id_c?.toString(),
          level_id_c: activityData.levelId?.toString() || activityData.level_id_c?.toString(),
          stars_earned_c: activityData.starsEarned || activityData.stars_earned_c,
          correct_answers_c: activityData.correctAnswers || activityData.correct_answers_c,
          total_questions_c: activityData.totalQuestions || activityData.total_questions_c,
          time_spent_c: activityData.timeSpent || activityData.time_spent_c,
          completed_at_c: activityData.completedAt || activityData.completed_at_c
        }]
      };
      
      const response = await this.apperClient.updateRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
      toast.error("Failed to update activity");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      toast.error("Failed to delete activity");
      return false;
    }
  }
}

export default new ActivitiesService();