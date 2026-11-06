/**
 * FAB STEEL CONSULTANCY ERP - UNIFIED API CLIENT
 * Gatekeeper HTTP client that switches transparently between Phase 1 Mock Adapter and Phase 2 PHP/REST API
 */

(function () {
  'use strict';

  class ApiClient {
    constructor() {
      this.mockAdapter = window.FabMockApiAdapter;
    }

    /**
     * Retrieve the active authentication token
     */
    getAuthToken() {
      try {
        const session = window.sessionStorage.getItem('fab_erp_session') ||
                        window.localStorage.getItem('fab_erp_session');
        if (session) {
          const parsed = JSON.parse(session);
          return parsed.token || 'mock-bearer-token';
        }
      } catch (e) {
        // ignore
      }
      return 'mock-bearer-token';
    }

    /**
     * Common request handler
     */
    async request(method, endpoint, payload = null, customHeaders = {}) {
      const mode = (window.FabConfig && window.FabConfig.API_MODE) || 'mock';

      if (mode === 'mock') {
        // Phase 1: Internal Mock API Adapter
        return this.mockAdapter.request(method, endpoint, payload, customHeaders);
      }

      // Phase 2: Live PHP / Node REST API via Fetch
      const baseUrl = (window.FabConfig && window.FabConfig.API_BASE_URL) || '/api/v1';
      const cleanUrl = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      let fullUrl = `${baseUrl}${cleanUrl}`;

      const options = {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          ...customHeaders
        }
      };

      if (payload && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
        options.body = JSON.stringify(payload);
      } else if (payload && options.method === 'GET') {
        const query = new URLSearchParams(payload).toString();
        if (query) fullUrl += (fullUrl.includes('?') ? '&' : '?') + query;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), (window.FabConfig && window.FabConfig.API_TIMEOUT_MS) || 5000);
        options.signal = controller.signal;

        const response = await fetch(fullUrl, options);
        clearTimeout(timeout);

        const data = await response.json();
        if (!response.ok) {
          return {
            success: false,
            status: response.status,
            data: null,
            message: data.message || `HTTP Error ${response.status}`,
            errors: data.errors || {}
          };
        }
        return data;
      } catch (err) {
        console.error(`[ApiClient] Network/Fetch Error (${method} ${endpoint}):`, err);
        return {
          success: false,
          status: 0,
          data: null,
          message: err.name === 'AbortError' ? 'Request timed out' : 'Network connection failure',
          errors: { network: err.message }
        };
      }
    }

    // Convenience HTTP verbs
    async get(endpoint, params = null, headers = {}) {
      return this.request('GET', endpoint, params, headers);
    }

    async post(endpoint, body = {}, headers = {}) {
      return this.request('POST', endpoint, body, headers);
    }

    async put(endpoint, body = {}, headers = {}) {
      return this.request('PUT', endpoint, body, headers);
    }

    async patch(endpoint, body = {}, headers = {}) {
      return this.request('PATCH', endpoint, body, headers);
    }

    async delete(endpoint, headers = {}) {
      return this.request('DELETE', endpoint, null, headers);
    }
  }

  window.FabApiClient = new ApiClient();
})();

