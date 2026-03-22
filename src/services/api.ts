import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
});

export const authService = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { username: string; email: string; phoneNo: string; password: string }) =>
    api.post('/auth/register', data),
};

export interface SensorData {
  id?: number;
  heartRate: number;
  gsrValue: number;
  stressLevel: string;
}

export const sensorService = {
  start: () => api.get<string>('/sensor/start'),
  postData: (data: Omit<SensorData, 'id'>) =>
    api.post<SensorData>('/sensor/data', data),
  getHistory: () =>
    api.get<SensorData[]>('/sensor/get'),
};

export default api;
