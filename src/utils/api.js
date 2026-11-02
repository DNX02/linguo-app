// API client for Linguo Server

const TOKEN_KEY = 'linguo_auth_token';

export const api = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  async request(path, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const res = await fetch(path, { ...options, headers });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка запроса к серверу');
      }
      return data;
    } catch (err) {
      console.warn('API error:', err.message);
      throw err;
    }
  },

  async register(username, password, name) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, name })
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async login(username, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async getMe() {
    if (!this.getToken()) return null;
    try {
      const data = await this.request('/api/auth/me');
      return data.user;
    } catch (e) {
      this.setToken(null);
      return null;
    }
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    this.setToken(null);
  },

  async getCustomWords() {
    try {
      return await this.request('/api/words/custom');
    } catch (e) {
      return [];
    }
  },

  async addCustomWord(wordData) {
    return await this.request('/api/words/custom', {
      method: 'POST',
      body: JSON.stringify(wordData)
    });
  },

  async deleteCustomWord(id) {
    return await this.request(`/api/words/custom/${id}`, {
      method: 'DELETE'
    });
  },

  async syncProgress(progressData) {
    if (!this.getToken()) return null;
    try {
      return await this.request('/api/progress/sync', {
        method: 'POST',
        body: JSON.stringify(progressData)
      });
    } catch (e) {
      return null;
    }
  },

  async getProgress() {
    if (!this.getToken()) return null;
    try {
      return await this.request('/api/progress');
    } catch (e) {
      return null;
    }
  }
};
