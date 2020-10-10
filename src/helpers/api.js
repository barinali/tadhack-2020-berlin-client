import axios from 'axios';

const API_URL = 'https://tadhack-berlin-2020.herokuapp.com/';

const createAxiosInstance = () => {
  const validateStatus = status => status < 500;

  return axios.create({
    baseURL: API_URL,
    validateStatus,
  });
};

const api = {
  instance: createAxiosInstance(),
  addStudent: (payload) => {
    return api.instance.post('/students', payload);
  },
  fetchStudents: () => {
    return api.instance.get('/students');
  },
  deleteStudent: (id) => {
    return api.instance.delete(`/students/${id}`);
  },
  deleteStudents: (ids) => {
    return Promise.all(ids.map(api.deleteStudent));
  },
  sendMessage: (payload) => {
    return api.instance.post('/messages', payload);
  },
  fetchMessages: () => {
    return api.instance.get('/messages');
  },
};

export default api;