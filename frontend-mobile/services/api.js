import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Expo automatically injects variables starting with EXPO_PUBLIC_
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach the JWT token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from storage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;