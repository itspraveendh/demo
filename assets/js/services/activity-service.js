/**
 * FAB STEEL CONSULTANCY ERP - ACTIVITY SERVICE
 * Audit trail recording, activity queries, and security logging
 */

(function () {
  'use strict';

  class ActivityService {
    constructor() {
      this.client = window.FabApiClient;
      this.eventBus = window.FabEventBus;
    }

    async getLogs(filters = null) {
      const res = await this.client.get('/logs', filters);
      return res.data || [];
    }

    async log(action, module, details) {
      const currentUser = (window.FabAuth && window.FabAuth.getCurrentUser()) || { name: 'System User' };
      const payload = {
        action,
        module,
        details,
        user: currentUser.name
      };
      return this.client.post('/logs', payload);
    }
  }

  window.FabActivityService = new ActivityService();
})();

