/**
 * FAB STEEL CONSULTANCY ERP - AUTH SERVICE
 * Handles login, logout, session restoration, role-switching, and password reset flows
 */

(function () {
  'use strict';

  class AuthService {
    constructor() {
      this.client = window.FabApiClient;
      this.eventBus = window.FabEventBus;
      this.sessionKey = 'fab_erp_session';
    }

    /**
     * Authenticate user with credentials
     */
    async login(email, password, remember = false) {
      const response = await this.client.post('/auth/login', { email, password });
      if (response && response.success && response.data) {
        const sessionData = response.data;
        const serialized = JSON.stringify(sessionData);

        if (remember) {
          localStorage.setItem(this.sessionKey, serialized);
        } else {
          sessionStorage.setItem(this.sessionKey, serialized);
        }

        if (this.eventBus) {
          this.eventBus.emit('auth:login', sessionData.user);
        }
      }
      return response;
    }

    /**
     * Terminate current session
     */
    async logout() {
      try {
        await this.client.post('/auth/logout');
      } catch (e) {
        // ignore
      }
      sessionStorage.removeItem(this.sessionKey);
      localStorage.removeItem(this.sessionKey);

      if (this.eventBus) {
        this.eventBus.emit('auth:logout');
      }
      return { success: true };
    }

    /**
     * Check if a valid session exists
     */
    isAuthenticated() {
      return !!this.getCurrentUser();
    }

    /**
     * Get active logged-in user profile
     */
    getCurrentUser() {
      try {
        const raw = sessionStorage.getItem(this.sessionKey) || localStorage.getItem(this.sessionKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed.user || null;
      } catch (e) {
        return null;
      }
    }

    /**
     * Request simulated OTP for password recovery
     */
    async forgotPassword(email) {
      return this.client.post('/auth/forgot-password', { email });
    }

    /**
     * Verify OTP and reset password
     */
    async resetPassword(email, newPassword, otp) {
      return this.client.post('/auth/reset-password', { email, newPassword, otp });
    }

    /**
     * Quick persona switch for ERP demo purposes
     */
    switchPersona(roleName) {
      const users = (window.FabStorage && window.FabStorage.get(window.FabStorage.KEYS.USERS, [])) ||
                    (window.FabStorageAdapter && window.FabStorageAdapter.get('users', [])) || [];
      const user = users.find(u => u.role.toLowerCase() === roleName.toLowerCase());
      if (user) {
        const session = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            department: user.department || 'Operations'
          },
          token: 'mock-jwt-switch-' + user.id
        };
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        if (this.eventBus) {
          this.eventBus.emit('auth:roleSwitched', user);
        }
        return true;
      }
      return false;
    }
  }

  window.FabAuthService = new AuthService();
})();

