/**
 * FAB STEEL CONSULTANCY ERP - NOTIFICATION SERVICE
 * Real-time event notifications, alerts, and unread badge dispatch
 */

(function () {
  'use strict';

  class NotificationService {
    constructor() {
      this.client = window.FabApiClient;
      this.eventBus = window.FabEventBus;
    }

    async getAll() {
      const res = await this.client.get('/notifications');
      return res.data || [];
    }

    async markAsRead(id) {
      const res = await this.client.put(`/notifications/${id}`);
      if (res.success && this.eventBus) {
        this.eventBus.emit('notification:read', { id });
      }
      return res;
    }

    async markAllAsRead() {
      const res = await this.client.post('/notifications/mark-all-read');
      if (res.success && this.eventBus) {
        this.eventBus.emit('notification:allRead');
      }
      return res;
    }

    async getUnreadCount() {
      const list = await this.getAll();
      return list.filter(n => !n.read).length;
    }
  }

  window.FabNotificationService = new NotificationService();
})();

