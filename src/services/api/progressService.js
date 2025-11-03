import { toast } from 'react-toastify';

class ProgressService {
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "skill_area_c"}},
          {"field": {"Name": "mastery_level_c"}},
          {"field": {"Name": "practice_count_c"}},
          {"field": {"Name": "last_practiced_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('progress_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching progress:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByChildId(childId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "skill_area_c"}},
          {"field": {"Name": "mastery_level_c"}},
          {"field": {"Name": "practice_count_c"}},
          {"field": {"Name": "last_practiced_c"}}
        ],
        where: [{"FieldName": "child_id_c", "Operator": "EqualTo", "Values": [childId.toString()]}]
      };
      
      const response = await this.apperClient.fetchRecords('progress_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching progress by child:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getBySubject(childId, subject) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "child_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "skill_area_c"}},
          {"field": {"Name": "mastery_level_c"}},
          {"field": {"Name": "practice_count_c"}},
          {"field": {"Name": "last_practiced_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "child_id_c", "operator": "EqualTo", "values": [childId.toString()]},
                {"fieldName": "subject_c", "operator": "EqualTo", "values": [subject]}
              ],
              "operator": "AND"
            }
          ]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('progress_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching progress by subject:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateProgress(childId, subject, skillArea, masteryLevel) {
    try {
      // First, try to find existing record
      const existingProgress = await this.getBySubject(childId, subject);
      const existingRecord = existingProgress.find(p => 
        p.child_id_c === childId.toString() && 
        p.subject_c === subject && 
        p.skill_area_c === skillArea
      );

      if (existingRecord) {
        // Update existing record
        const params = {
          records: [{
            Id: existingRecord.Id,
            mastery_level_c: masteryLevel,
            practice_count_c: (existingRecord.practice_count_c || 0) + 1,
            last_practiced_c: new Date().toISOString()
          }]
        };
        
        const response = await this.apperClient.updateRecord('progress_c', params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return null;
        }
        
        if (response.results) {
          const successful = response.results.filter(r => r.success);
          return successful.length > 0 ? successful[0].data : null;
        }
      } else {
        // Create new record
        const params = {
          records: [{
            Name: `${skillArea} progress for child ${childId}`,
            child_id_c: childId.toString(),
            subject_c: subject,
            skill_area_c: skillArea,
            mastery_level_c: masteryLevel,
            practice_count_c: 1,
            last_practiced_c: new Date().toISOString()
          }]
        };
        
        const response = await this.apperClient.createRecord('progress_c', params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return null;
        }
        
        if (response.results) {
          const successful = response.results.filter(r => r.success);
          return successful.length > 0 ? successful[0].data : null;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating progress:", error?.response?.data?.message || error);
      toast.error("Failed to update progress");
      return null;
    }
  }
}

export default new ProgressService();