// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://https://task-management-app-kejo.vercel.app/';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Todo endpoints
  RETRIEVE_USER_DATA: `${API_BASE_URL}/api/todos/retrieveUserData`,
  RETRIEVE_TODO: (id: string) => `${API_BASE_URL}/api/todos/retrieve/${id}`,
  CREATE_TODO: `${API_BASE_URL}/api/todos/create`,
  UPDATE_TODO: (id: string) => `${API_BASE_URL}/api/todos/update/${id}`,
  DELETE_TODO: (id: string) => `${API_BASE_URL}/api/todos/delete/${id}`,
};

export default API_ENDPOINTS; 