/**
 * FAB STEEL CONSULTANCY ERP - MAIL SERVICE
 * Outbound SMTP dispatcher, email templating, and dispatch logs
 */

(function () {
  'use strict';

  class MailService {
    constructor() {
      this.client = window.FabApiClient;
      this.eventBus = window.FabEventBus;
    }

    async sendEmail(to, subject, body, template = 'Standard') {
      const res = await this.client.post('/mailer/send', {
        to,
        subject,
        body,
        template
      });
      if (res.success && this.eventBus) {
        this.eventBus.emit('mail:sent', res.data);
      }
      return res;
    }

    async getHistory() {
      const res = await this.client.get('/mailer/history');
      return res.data || [];
    }

    async testSmtpConnection() {
      return this.client.post('/mailer/test-smtp');
    }
  }

  window.FabMailService = new MailService();
})();

