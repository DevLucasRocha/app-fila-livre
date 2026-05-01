import axios from 'axios';

// Inicializa a instância do Axios com a URL base para comunicação com a API do backend.
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

export default api;