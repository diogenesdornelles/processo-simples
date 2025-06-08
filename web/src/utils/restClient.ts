import axios from 'axios';
import { manageToken } from './auth/manageToken';
import { handleUnauthorizedAccess } from './auth/handleUnauthorizedAccess';

const restClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: function (status) {
    return status < 500;
  },
});

restClient.interceptors.request.use(
  config => {
    const token = manageToken.ls.get() || manageToken.cookies.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

restClient.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${response.status} ${response.config.url}`, response.data);
    }

    return response;
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('Unauthorized - redirecting to login');
          handleUnauthorizedAccess();
          break;

        case 403:
          console.error('Forbidden - insufficient permissions');
          break;

        case 404:
          console.error('Resource not found');
          break;

        case 422:
          console.error('Validation error:', data.errors || data.message);
          break;

        case 500:
          console.error('Server error');
          break;

        default:
          console.error(
            `Error ${status}:`,
            data.message || 'Erro desconhecido'
          );
      }

      return Promise.reject(data);
    } else if (error.request) {
      console.error('Network error:', error.message);
      return Promise.reject({ message: 'Erro de conexão com o servidor' });
    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

export { restClient };
