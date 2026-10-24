import apiClient from './apiClient';

export const weatherService = {
  async getCurrent(farmId) {
    return apiClient.get(`/farms/${farmId}/weather/current`);
  },

  async getForecast(farmId, hours = 72) {
    return apiClient.get(`/farms/${farmId}/weather/forecast?hours=${hours}`);
  },
};

export default weatherService;