/**
 * FAB STEEL CONSULTANCY ERP - INVOICE SERVICE
 * Billing engine, payment tracking, financial ledger, and tax calculations
 */

(function () {
  'use strict';

  class InvoiceService {
    constructor() {
      this.repo = new window.FabBaseRepository('invoices');
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

    calculateTotals(items = [], taxRate = 0.10, discount = 0) {
      const subtotal = items.reduce((acc, item) => {
        const qty = Number(item.quantity) || 0;
        const rate = Number(item.unitPrice) || 0;
        return acc + (qty * rate);
      }, 0);

      const discountAmount = Number(discount) || 0;
      const taxableAmount = Math.max(0, subtotal - discountAmount);
      const taxAmount = taxableAmount * (Number(taxRate) || 0);
      const grandTotal = taxableAmount + taxAmount;

      return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat(discountAmount.toFixed(2)),
        taxRate: Number(taxRate),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        total: parseFloat(grandTotal.toFixed(2))
      };
    }

    async create(data) {
      const totals = this.calculateTotals(data.items, data.taxRate || 0.10, data.discount || 0);

      const payload = {
        id: data.id || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceNumber: data.invoiceNumber || data.id,
        partnerName: data.partnerName,
        partnerEmail: data.partnerEmail || '',
        date: data.date || new Date().toISOString().split('T')[0],
        dueDate: data.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        items: data.items || [],
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.taxAmount,
        total: totals.total,
        status: data.status || 'Draft',
        currency: data.currency || 'USD',
        notes: data.notes || '',
        terms: data.terms || 'Net 30 days. Wire transfer to Fab Steel Corporate Account.'
      };

      const res = await this.repo.create(payload);
      if (res.success && this.eventBus) {
        this.eventBus.emit('invoice:created', res.data);
      }
      return res;
    }

    async update(id, data) {
      if (data.items) {
        const totals = this.calculateTotals(data.items, data.taxRate, data.discount);
        data.subtotal = totals.subtotal;
        data.discount = totals.discount;
        data.tax = totals.taxAmount;
        data.total = totals.total;
      }

      const res = await this.repo.update(id, data);
      if (res.success && this.eventBus) {
        this.eventBus.emit('invoice:updated', res.data);
      }
      return res;
    }

    async recordPayment(id, paymentData) {
      const res = await this.client.post(`/invoices/${id}/payment`, paymentData);
      if (res.success && this.eventBus) {
        this.eventBus.emit('invoice:paymentRecorded', res.data);
      }
      return res;
    }

    async delete(id) {
      const res = await this.repo.delete(id);
      if (res.success && this.eventBus) {
        this.eventBus.emit('invoice:deleted', { id });
      }
      return res;
    }

    async getStats() {
      const all = await this.getAll();
      const paid = all.filter(i => i.status === 'Paid');
      const sent = all.filter(i => i.status === 'Sent');
      const overdue = all.filter(i => i.status === 'Overdue');
      const draft = all.filter(i => i.status === 'Draft');

      const totalRevenue = paid.reduce((s, i) => s + (Number(i.total) || 0), 0);
      const totalOutstanding = sent.concat(overdue).reduce((s, i) => s + (Number(i.total) || 0), 0);
      const totalOverdue = overdue.reduce((s, i) => s + (Number(i.total) || 0), 0);

      return {
        totalCount: all.length,
        paidCount: paid.length,
        sentCount: sent.length,
        overdueCount: overdue.length,
        draftCount: draft.length,
        totalRevenue: Math.round(totalRevenue),
        totalOutstanding: Math.round(totalOutstanding),
        totalOverdue: Math.round(totalOverdue)
      };
    }
  }

  window.FabInvoiceService = new InvoiceService();
})();

