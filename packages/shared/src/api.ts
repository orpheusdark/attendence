import axios, { type AxiosInstance } from 'axios';

export function createApiClient(baseURL: string, tokenGetter?: () => string | null): AxiosInstance {
  const client = axios.create({ baseURL, timeout: 15000 });

  client.interceptors.request.use(config => {
    const token = tokenGetter?.();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}