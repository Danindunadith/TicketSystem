import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // You can add common headers or interceptors here if needed
});

export default axiosInstance; 