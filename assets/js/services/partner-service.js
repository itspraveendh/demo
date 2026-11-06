/**
 * FAB STEEL CONSULTANCY ERP - PARTNER SERVICE
 * Client, contractor, supplier, and B2B vendor management
 */

(function () {
  'use strict';

  class PartnerService {
    constructor() {
      this.repo = new window.FabBaseRepository('partners');
      this.eventBus = window.FabEventBus;
    }

    async getAll(filters = null) {
      const res = await this.repo.getAll(filters);
      return res.data || [];
    }

    async getById(id) {
      const res = await this.repo.getById(id);
      return res.data || null;
    }

    async create(data) {
      if (!data.companyName || !data.email) {
        throw new Error('Company Name and Primary Email are required');
      }
      const payload = {
        ...data,
        tier: data.tier || 'Standard',
        status: data.status || 'Active',
        totalProjects: data.totalProjects || 1,
        totalBilling: data.totalBilling || 0
      };
      const res = await this.repo.create(payload);
      if (res.success && this.eventBus) {
        this.eventBus.emit('partner:created', res.data);
      }
      return res;
    }

    async update(id, data) {
      const res = await this.repo.update(id, data);
      if (res.success && this.eventBus) {
        this.eventBus.emit('partner:updated', res.data);
      }
      return res;
    }

    async delete(id) {
      const res = await this.repo.delete(id);
      if (res.success && this.eventBus) {
        this.eventBus.emit('partner:deleted', { id });
      }
      return res;
    }

    async getStats() {
      const all = await this.getAll();
      const active = all.filter(p => p.status === 'Active').length;
      const tiers = { Platinum: 0, Gold: 0, Silver: 0, Standard: 0 };

      all.forEach(p => {
        const t = p.tier || 'Standard';
        tiers[t] = (tiers[t] || 0) + 1;
      });

      return {
        total: all.length,
        active,
        tiers
      };
    }
  }

  window.FabPartnerService = new PartnerService();
})();

