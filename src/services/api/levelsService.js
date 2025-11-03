import { toast } from 'react-toastify';

class LevelsService {
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "order_index_c"}},
          {"field": {"Name": "is_locked_c"}},
          {"field": {"Name": "required_stars_c"}}
        ],
        orderBy: [{"fieldName": "order_index_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords('level_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching levels:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "order_index_c"}},
          {"field": {"Name": "is_locked_c"}},
          {"field": {"Name": "required_stars_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('level_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching level ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getBySubject(subject) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "difficulty_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "order_index_c"}},
          {"field": {"Name": "is_locked_c"}},
          {"field": {"Name": "required_stars_c"}}
        ],
        where: [{"FieldName": "subject_c", "Operator": "EqualTo", "Values": [subject]}],
        orderBy: [{"fieldName": "order_index_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords('level_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching levels by subject:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateLockStatus(id, isLocked) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          is_locked_c: isLocked
        }]
      };
      
      const response = await this.apperClient.updateRecord('level_c', params);
      
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
      console.error("Error updating level lock status:", error?.response?.data?.message || error);
      toast.error("Failed to update level lock status");
      return null;
    }
  }
}

export default new LevelsService();
export default new LevelsService();