import api from './api.js';

export const getShipments = async (params = {}) => {
  const { data } = await api.get('/shipments', { params });
  return data.data;
};

export const getShipment = async (id) => {
  const { data } = await api.get(`/shipments/${id}`);
  return data.data;
};

export const createShipment = async (payload) => {
  const { data } = await api.post('/shipments', payload);
  return data.data;
};

export const updateShipmentStatus = async (id, status) => {
  const { data } = await api.patch(`/shipments/${id}/status`, { status });
  return data.data;
};
