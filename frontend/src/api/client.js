const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  setToken(token) {
    this.token = token;
    if (typeof localStorage === 'undefined') return;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.setToken(null);
        throw new Error('Unauthorized — please login via the top-right Login button');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || error.detail || `HTTP ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - unable to reach server');
      }
      throw error;
    }
  }

  // Auth
  async register(data) {
    const result = await this.request('/auth/register', { method: 'POST', body: data });
    if (result?.accessToken) {
      this.setToken(result.accessToken);
    }
    return result;
  }

  async login(data) {
    const result = await this.request('/auth/login', { method: 'POST', body: data });
    if (result?.accessToken) {
      this.setToken(result.accessToken);
    }
    return result;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', { method: 'POST', body: { email } });
  }

  async logout() {
    try {
      if (this.token) {
        await this.request('/auth/logout', { method: 'POST' });
      }
    } finally {
      this.setToken(null);
    }
  }

  // Health
  async getHealth() {
    return this.request('/health');
  }

  async getLiveness() {
    return this.request('/health/live');
  }

  async getReadiness() {
    return this.request('/health/ready');
  }

  // Farms
  async getFarms(page = 0, size = 20) {
    return this.request(`/farms?page=${page}&size=${size}`);
  }

  async getFarmsList() {
    return this.request('/farms/list');
  }

  async getFarm(id) {
    return this.request(`/farms/${id}`);
  }

  async createFarm(data) {
    return this.request('/farms', { method: 'POST', body: data });
  }

  async updateFarm(id, data) {
    return this.request(`/farms/${id}`, { method: 'PUT', body: data });
  }

  async deleteFarm(id) {
    return this.request(`/farms/${id}`, { method: 'DELETE' });
  }

  // Crop Cycles
  async getCropCycles(farmId, page = 0, size = 20) {
    return this.request(`/crops/farm/${farmId}?page=${page}&size=${size}`);
  }

  async getCropCyclesList(farmId) {
    return this.request(`/crops/farm/${farmId}/list`);
  }

  async getCropCycle(id) {
    return this.request(`/crops/${id}`);
  }

  async createCropCycle(data) {
    return this.request('/crops', { method: 'POST', body: data });
  }

  async updateCropCycle(id, data) {
    return this.request(`/crops/${id}`, { method: 'PUT', body: data });
  }

  async deleteCropCycle(id) {
    return this.request(`/crops/${id}`, { method: 'DELETE' });
  }

  // Recommendations
  async requestRecommendation(data) {
    return this.request('/recommendations', { method: 'POST', body: data });
  }

  async getRecommendations(farmId, page = 0, size = 20) {
    return this.request(`/recommendations?farmId=${farmId}&page=${page}&size=${size}`);
  }

  async getRecommendationsByCropCycle(cropCycleId, page = 0, size = 20) {
    return this.request(`/recommendations/crop-cycle/${cropCycleId}?page=${page}&size=${size}`);
  }

  async getRecommendation(id) {
    return this.request(`/recommendations/${id}`);
  }

  async executeRecommendation(id, executedBy) {
    return this.request(`/recommendations/${id}/execute`, {
      method: 'POST',
      body: { executedBy },
    });
  }

  async getInputSnapshot(recommendationId) {
    return this.request(`/recommendations/${recommendationId}/input-snapshot`);
  }

  // Weather
  async createWeatherObservation(data) {
    return this.request('/weather', { method: 'POST', body: data });
  }

  async getWeatherObservations(farmId, page = 0, size = 20) {
    return this.request(`/weather/farm/${farmId}?page=${page}&size=${size}`);
  }

  async getLatestWeatherObservations(farmId, limit = 10) {
    return this.request(`/weather/farm/${farmId}/latest?limit=${limit}`);
  }

  async getWeatherObservationsByRange(farmId, start, end) {
    return this.request(`/weather/farm/${farmId}/range?start=${start}&end=${end}`);
  }

  // Feedback
  async createFeedback(data) {
    return this.request('/feedback', { method: 'POST', body: data });
  }

  async getFeedbackByRecommendation(recommendationId, page = 0, size = 20) {
    return this.request(`/feedback/recommendation/${recommendationId}?page=${page}&size=${size}`);
  }

  async getMyFeedback(page = 0, size = 20) {
    return this.request(`/feedback/my?page=${page}&size=${size}`);
  }

  // ML Service
  async checkMlHealth() {
    try {
      const response = await fetch(`${ML_SERVICE_URL}/health`);
      return response.ok ? await response.json() : { status: 'DOWN' };
    } catch {
      return { status: 'DOWN' };
    }
  }

  async predictIrrigation(data) {
    try {
      const response = await fetch(`${ML_SERVICE_URL}/predict/irrigation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const detail = result?.detail;
        let message = 'Prediction failed. Please try again.';

        if (typeof detail === 'string') {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail
            .map((item) => `${item.loc?.join('.') ?? 'Field'}: ${item.msg}`)
            .join('; ');
        } else if (typeof result?.message === 'string') {
          message = result.message;
        }

        throw new Error(message);
      }

      if (!result || result.error) {
        throw new Error(result?.error || 'Invalid response from ML service.');
      }

      return result;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Cannot connect to ML service. Check that it is running.');
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
