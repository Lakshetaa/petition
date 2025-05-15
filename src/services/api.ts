import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Petition API calls
export const petitionAPI = {
  // Get all petitions
  getAll: async (category?: string) => {
    try {
      const query = category ? `?category=${category}` : '';
      const { data } = await api.get(`/petitions${query}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get petition by ID
  getById: async (id: string) => {
    try {
      const { data } = await api.get(`/petitions/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create petition
  create: async (petitionData: any) => {
    try {
      const { data } = await api.post('/petitions', petitionData);
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update petition
  update: async (id: string, petitionData: any) => {
    try {
      const { data } = await api.put(`/petitions/${id}`, petitionData);
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete petition
  delete: async (id: string) => {
    try {
      const { data } = await api.delete(`/petitions/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  // Vote on petition
  vote: async (id: string) => {
    try {
      const { data } = await api.post(`/petitions/${id}/vote`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user's petitions
  getUserPetitions: async () => {
    try {
      const { data } = await api.get('/petitions/user');
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user's voted petitions
  getUserVotedPetitions: async () => {
    try {
      const { data } = await api.get('/petitions/voted');
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;