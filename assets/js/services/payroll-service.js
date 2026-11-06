/**
 * FAB STEEL CONSULTANCY ERP - PAYROLL SERVICE
 * Batch payroll execution, payslip generation, and disbursement tracking
 */

(function () {
  'use strict';

  class PayrollService {
    constructor() {
      this.repo = new window.FabBaseRepository('payroll');
      this.client = window.FabApiClient;
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

    async generateMonth(month, year) {
      const res = await this.client.post('/payroll/generate-month', { month, year });
      if (res.success && this.eventBus) {
        this.eventBus.emit('payroll:generated', { month, year });
      }
      return res;
    }

    async update(id, data) {
      const res = await this.repo.update(id, data);
      if (res.success && this.eventBus) {
        this.eventBus.emit('payroll:updated', res.data);
      }
      return res;
    }

    async markPaid(id, paymentMethod = 'Bank Wire') {
      const payload = {
        status: 'Paid',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod
      };
      return this.update(id, payload);
    }

    async getStats() {
      const all = await this.getAll();
      const paid = all.filter(p => p.status === 'Paid');
      const pending = all.filter(p => p.status !== 'Paid');

      const totalPaidAmount = paid.reduce((s, p) => s + (Number(p.netSalary) || 0), 0);
      const totalPendingAmount = pending.reduce((s, p) => s + (Number(p.netSalary) || 0), 0);

      return {
        totalRecords: all.length,
        paidCount: paid.length,
        pendingCount: pending.length,
        totalPaidAmount: Math.round(totalPaidAmount),
        totalPendingAmount: Math.round(totalPendingAmount)
      };
    }
  }

  window.FabPayrollService = new PayrollService();
})();

