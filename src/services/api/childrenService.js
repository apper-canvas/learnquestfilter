import { toast } from 'react-toastify';

class ChildrenService {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "avatar_id_c"}},
          {"field": {"Name": "current_level_c"}},
          {"field": {"Name": "total_stars_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('child_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching children:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "avatar_id_c"}},
          {"field": {"Name": "current_level_c"}},
          {"field": {"Name": "total_stars_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('child_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching child ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(childData) {
    try {
      const params = {
        records: [{
          Name: childData.name || childData.name_c,
          name_c: childData.name || childData.name_c,
          age_c: childData.age || childData.age_c,
          avatar_id_c: childData.avatarId || childData.avatar_id_c,
          current_level_c: childData.currentLevel || childData.current_level_c || 1,
          total_stars_c: childData.totalStars || childData.total_stars_c || 0
        }]
      };
      
      const response = await this.apperClient.createRecord('child_c', params);
      
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
      console.error("Error creating child:", error?.response?.data?.message || error);
      toast.error("Failed to create child");
      return null;
    }
  }

  async update(id, childData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: childData.name || childData.name_c,
          age_c: childData.age || childData.age_c,
          avatar_id_c: childData.avatarId || childData.avatar_id_c,
          current_level_c: childData.currentLevel || childData.current_level_c,
          total_stars_c: childData.totalStars || childData.total_stars_c
        }]
      };
      
      const response = await this.apperClient.updateRecord('child_c', params);
      
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
      console.error("Error updating child:", error?.response?.data?.message || error);
      toast.error("Failed to update child");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('child_c', params);
      
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
      console.error("Error deleting child:", error?.response?.data?.message || error);
      toast.error("Failed to delete child");
      return false;
    }
  }
}

export default new ChildrenService();