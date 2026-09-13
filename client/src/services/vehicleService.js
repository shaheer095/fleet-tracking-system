import api from './api.js';

export const getVehicles = async (params = {}) => {
  const { data } = await api.get('/vehicles', { params });
  return data.data;
};

export const getVehicle = async (id) => {
  const { data } = await api.get(`/vehicles/${id}`);
  return data.data;
};

export const createVehicle = async (payload) => {
  const { data } = await api.post('/vehicles', payload);
  return data.data;
};

export const updateVehicleStatus = async (id, status) => {
  const { data } = await api.patch(`/vehicles/${id}/status`, { status });
  return data.data;
};

export const assignDriver = async (id, driverId) => {
  const { data } = await api.patch(`/vehicles/${id}/assign-driver`, { driverId });
  return data.data;
};
