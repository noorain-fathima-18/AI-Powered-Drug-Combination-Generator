import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = {
  generateCombinations: async (patientData) => {
    try {
      const response = await axios.post(`${API_URL}/api/generate`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error generating combinations:', error);
      throw error;
    }
  },
  
  checkInteractions: async (drugList) => {
    try {
      const response = await axios.post(`${API_URL}/api/interactions`, drugList);
      return response.data;
    } catch (error) {
      console.error('Error checking interactions:', error);
      throw error;
    }
  },
  
  getInteractionMatrix: async (drugList) => {
    try {
      const response = await axios.post(`${API_URL}/api/interaction-matrix`, drugList);
      return response.data;
    } catch (error) {
      console.error('Error getting interaction matrix:', error);
      throw error;
    }
  },
  
  exportCSV: async (combinations) => {
    try {
      const response = await axios.post(`${API_URL}/api/export-csv`, combinations);
      return response.data;
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  },
  
  exportPDF: async (combinations) => {
    try {
      const response = await axios.post(`${API_URL}/api/export-pdf`, combinations);
      return response.data;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  }
};

export default api;
