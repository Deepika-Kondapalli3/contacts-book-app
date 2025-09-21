 import axios from 'axios';

const api = axios.create({
  baseURL: '/', // proxy in package.json routes to backend
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export default api;

