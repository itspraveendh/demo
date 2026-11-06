/**
 * FAB STEEL CONSULTANCY ERP - SALARY SERVICE
 * Compensation structures, allowance breakdown, tax withholdings, and net calculations
 */

(function () {
  'use strict';

  class SalaryService {
    constructor() {
      this.repo = new window.FabBaseRepository('salary');
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

    async getByEmployeeId(empId) {
      const all = await this.getAll();
      return all.find(s => s.employeeId === empId) || null;
    }

    calculateNet(basicSalary = 0, allowances = {}, deductions = {}) {
      const basic = Number(basicSalary) || 0;
      const totalAllowances = Object.values(allowances).reduce((sum, v) => sum + (Number(v) || 0), 0);
      const totalDeductions = Object.values(deductions).reduce((sum, v) => sum + (Number(v) || 0), 0);
      const net = Math.max(0, basic + totalAllowances - totalDeductions);

      return {
        basicSalary: basic,
        totalAllowances,
        totalDeductions,
        netSalary: parseFloat(net.toFixed(2))
      };
    }

    async create(data) {
      const net = this.calculateNet(data.basicSalary, data.allowances, data.deductions);
      const payload = {
        ...data,
        netSalary: net.netSalary
      };
      const res = await this.repo.create(payload);
      if (res.success && this.eventBus) {
        this.eventBus.emit('salary:created', res.data);
      }
      return res;
    }

    async update(id, data) {
      const net = this.calculateNet(data.basicSalary, data.allowances, data.deductions);
      const payload = {
        ...data,
        netSalary: net.netSalary
      };
      const res = await this.repo.update(id, payload);
      if (res.success && this.eventBus) {
        this.eventBus.emit('salary:updated', res.data);
      }
      return res;
    }

    async getStats() {
      const all = await this.getAll();
      const totalCommitment = all.reduce((sum, s) => sum + (Number(s.netSalary) || 0), 0);
      const avgSalary = all.length > 0 ? Math.round(totalCommitment / all.length) : 0;

      return {
        totalEmployeesConfigured: all.length,
        totalMonthlyCommitment: Math.round(totalCommitment),
        averageNetSalary: avgSalary
      };
    }
  }

  window.FabSalaryService = new SalaryService();
})();

