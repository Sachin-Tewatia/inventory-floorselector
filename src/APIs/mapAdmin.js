import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.floorselector.convrse.ai/api/salarpuria';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================
// NO AUTHENTICATION REQUIRED!
// All Map Admin endpoints are public
// ============================================

// ============================================
// LANDMARKS APIs (Admin)
// ============================================

export const getAllLandmarks = async () => {
  // NO AUTHENTICATION REQUIRED - All endpoints are public!
  const response = await apiClient.get('/admin/landmarks');
  return response.data.data.items;
};

export const getLandmarkById = async (id) => {
  const response = await apiClient.get(`/admin/landmarks/${id}`);
  return response.data.data;
};

export const updateLandmark = async (id, data) => {
  // NO AUTHENTICATION REQUIRED - All endpoints are public!
  const response = await apiClient.put(`/admin/landmarks/${id}`, data);
  return response.data;
};

// ============================================
// NEARBY PLACES APIs (Admin)
// ============================================

export const getAllNearbyPlaces = async () => {
  const response = await apiClient.get('/admin/nearby-places');
  return response.data.data.items;
};

export const getNearbyPlacesByCategory = async (category) => {
  // NO AUTHENTICATION REQUIRED - All endpoints are public!
  const response = await apiClient.get(`/admin/nearby-places/category/${category}`);
  return response.data.data.items;
};

export const getNearbyPlaceById = async (id) => {
  const response = await apiClient.get(`/admin/nearby-places/${id}`);
  return response.data.data;
};

export const updateNearbyPlace = async (id, data) => {
  // NO AUTHENTICATION REQUIRED - All endpoints are public!
  const response = await apiClient.put(`/admin/nearby-places/${id}`, data);
  return response.data;
};

// ============================================
// PUBLIC MAP APIs (No Auth)
// ============================================

export const getPublicLandmarks = async () => {
  const response = await axios.get(`${API_BASE_URL}/map/landmarks`);
  return response.data.data.items;
};

export const getPublicNearbyPlacesByCategory = async (category) => {
  // category should be plural for public API: hotels, schools, hospitals, malls, metros
  const response = await axios.get(`${API_BASE_URL}/map/nearby-places/${category}`);
  return response.data.data.items;
};

export const getAllPublicMapData = async () => {
  const response = await axios.get(`${API_BASE_URL}/map/all`);
  return response.data.data;
};

export default apiClient;

