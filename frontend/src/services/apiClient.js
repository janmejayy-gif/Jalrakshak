const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  async request(config) {
    let finalConfig = { ...config };

    for (const interceptor of this.interceptors.request) {
      finalConfig = await interceptor(finalConfig);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${this.baseURL}${finalConfig.url}`, {
        method: finalConfig.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...finalConfig.headers,
        },
        body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      let finalResponse = { response, data };

      for (const interceptor of this.interceptors.response) {
        finalResponse = await interceptor(finalResponse);
      }

      if (!response.ok) {
        const error = new ApiError(
          data?.detail || data?.message || response.statusText,
          response.status,
          data
        );
        throw error;
      }

      return finalResponse.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw new ApiError(error.message || 'Network error', 0);
    }
  }

  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  }

  post(url, data, config = {}) {
    return this.request({ ...config, url, method: 'POST', data });
  }

  put(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PUT', data });
  }

  patch(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PATCH', data });
  }

  delete(url, config = {}) {
    return this.request({ ...config, url, method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = new ApiClient();

apiClient.addRequestInterceptor(async (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

apiClient.addResponseInterceptor(async ({ response, data }) => {
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem('accessToken', refreshData.accessToken);
          if (refreshData.refreshToken) {
            localStorage.setItem('refreshToken', refreshData.refreshToken);
          }
          return { response, data };
        }
      } catch {
        // Refresh failed, will redirect to login
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
  return { response, data };
});

export { ApiError };
export default apiClient;