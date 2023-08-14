import axios from 'axios';

// Create a custom Axios instance with the base URL
const api = axios.create({
  baseURL: 'http://localhost:3001', // Replace with the correct URL of your Node.js API
});

export default api;
