const API_BASE_URL = 'http://localhost:3001/api';

export class ApiService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async searchPatents(query, filters = {}) {
    return this.request('/search-patents', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  async getDatabasePatents(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/database/patents?${params.toString()}`);
  }

  async getStatistics() {
    return this.request('/statistics');
  }

  async generateCommercializationStrategy(patent) {
    return this.request('/llm/commercialization-strategy', {
      method: 'POST',
      body: JSON.stringify({ patent }),
    });
  }

  async checkHealth() {
    return this.request('/health');
  }
}