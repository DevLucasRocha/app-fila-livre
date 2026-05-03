import axios from 'axios';

// Criar instância Axios com baseURL do backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

export default api;