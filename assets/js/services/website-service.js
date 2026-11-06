/**
 * FAB STEEL CONSULTANCY ERP - WEBSITE SERVICE
 * Public marketing website CMS management and configuration
 */

(function () {
  'use strict';

  class WebsiteService {
    constructor() {
      this.client = window.FabApiClient;
      this.eventBus = window.FabEventBus;
    }

    async getSettings() {
      const res = await this.client.get('/website');
      return res.data || {};
    }

    async updateSettings(settings) {
      const res = await this.client.put('/website', settings);
      if (res.success && this.eventBus) {
        this.eventBus.emit('website:updated', res.data);
      }
      return res;
    }

    async getTeamMembers() {
      const repo = new window.FabBaseRepository('team');
      const res = await repo.getAll();
      return res.data || [];
    }

    async updateTeamMember(id, data) {
      const repo = new window.FabBaseRepository('team');
      return repo.update(id, data);
    }
  }

  window.FabWebsiteService = new WebsiteService();
})();

