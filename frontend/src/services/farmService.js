import apiClient from './apiClient';

export const farmService = {
  async create(data) {
    return apiClient.post('/farms', data);
  },

  async list(params = {}) {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);
    if (params.sort) query.append('sort', params.sort);
    const queryString = query.toString();
    return apiClient.get(`/farms${queryString ? `?${queryString}` : ''}`);
  },

  async get(farmId) {
    return apiClient.get(`/farms/${farmId}`);
  },

  async update(farmId, data) {
    return apiClient.put(`/farms/${farmId}`, data);
  },

  async delete(farmId) {
    return apiClient.delete(`/farms/${farmId}`);
  },

  async createCropCycle(farmId, data) {
    return apiClient.post(`/farms/${farmId}/crop-cycles`, data);
  },

  async listCropCycles(farmId, params = {}) {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);
    if (params.sort) query.append('sort', params.sort);
    const queryString = query.toString();
    return apiClient.get(`/farms/${farmId}/crop-cycles${queryString ? `?${queryString}` : ''}`);
  },

  async getActiveCropCycle(farmId) {
    return apiClient.get(`/farms/${farmId}/crop-cycles/active`);
  },

  async updateCropCycle(cropCycleId, data) {
    return apiClient.put(`/crop-cycles/${cropCycleId}`, data);
  },

  async completeCropCycle(cropCycleId) {
    return apiClient.post(`/crop-cycles/${cropCycleId}/complete`);
  },

  async addSoilReading(farmId, data) {
    return apiClient.post(`/farms/${farmId}/soil-readings`, data);
  },

  async getLatestSoilReading(farmId) {
    return apiClient.get(`/farms/${farmId}/soil-readings/latest`);
  },
};

export default farmService;