import api from './api.js';

export const getDrivers = async (params = {}) => {
  const { data } = await api.get('/drivers', { params });
  return data.data;
};

export const getDriver = async (id) => {
  const { data } = await api.get(`/drivers/${id}`);
  return data.data;
};

export const createDriver = async (payload) => {
  const { data } = await api.post('/drivers', payload);
  return data.data;
};
