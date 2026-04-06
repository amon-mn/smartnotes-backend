import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3333/v1',
  withCredentials: true, 
});

export default api;