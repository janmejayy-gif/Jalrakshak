import apiClient from './apiClient';

export const recommendationService = {
  async getLatest(farmId) {
    return apiClient.get(`/farms/${farmId}/recommendations/latest`);
  },

  async list(farmId, params = {}) {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);
    if (params.sort) query.append('sort', params.sort);
    const queryString = query.toString();
    return apiClient.get(`/farms/${farmId}/recommendations${queryString ? `?${queryString}` : ''}`);
  },

  async get(recommendationId) {
    return apiClient.get(`/recommendations/${recommendationId}`);
  },

  async submitFeedback(recommendationId, data) {
    return apiClient.post(`/recommendations/${recommendationId}/feedback`, data);
  },

  async listActions(farmId, params = {}) {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);
    if (params.sort) query.append('sort', params.sort);
    const queryString = query.toString();
    return apiClient.get(`/farms/${farmId}/actions${queryString ? `?${queryString}` : ''}`);
  },
};

export default recommendationService;