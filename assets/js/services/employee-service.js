/**
 * FAB STEEL CONSULTANCY ERP - EMPLOYEE SERVICE
 * Business logic and data management for workforce entities
 */

(function () {
  'use strict';

  class EmployeeService {
    constructor() {
      this.repo = new window.FabBaseRepository('employees');
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
      // Validate core fields
      if (!data.name || !data.email || !data.department) {
        throw new Error('Name, Email, and Department are mandatory fields');
      }
      const payload = {
        ...data,
        status: data.status || 'Active',
        joinDate: data.joinDate || new Date().toISOString().split('T')[0],
        avatar: data.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=200&q=80`
      };

      const res = await this.repo.create(payload);
      if (res.success && this.eventBus) {
        this.eventBus.emit('employee:created', res.data);
      }
      return res;
    }

    async update(id, data) {
      const res = await this.repo.update(id, data);
      if (res.success && this.eventBus) {
        this.eventBus.emit('employee:updated', res.data);
      }
      return res;
    }

    async delete(id) {
      const res = await this.repo.delete(id);
      if (res.success && this.eventBus) {
        this.eventBus.emit('employee:deleted', { id });
      }
      return res;
    }

    async toggleStatus(id) {
      const emp = await this.getById(id);
      if (!emp) throw new Error('Employee not found');
      const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
      return this.update(id, { status: newStatus });
    }

    async getStats() {
      const all = await this.getAll();
      const active = all.filter(e => e.status === 'Active').length;
      const inactive = all.filter(e => e.status !== 'Active').length;
      const departments = {};

      all.forEach(e => {
        const d = e.department || 'Unassigned';
        departments[d] = (departments[d] || 0) + 1;
      });

      return {
        total: all.length,
        active,
        inactive,
        departments
      };
    }
  }

  window.FabEmployeeService = new EmployeeService();
})();

