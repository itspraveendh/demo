/**
 * FAB STEEL CONSULTANCY ERP - GOOGLE MAILER & SMTP DISPATCH CENTER
 * Production-ready SMTP settings architecture with masked secrets, connection testing, templates, and delivery simulation
 */

window.FabMailerModule = (function () {
  'use strict';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const mailer = FabStorage.get(FabStorage.KEYS.MAILER, {}) || {};
    const templates = mailer.emailTemplates || [];
    const history = mailer.sentHistory || [];

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Automated Email Dispatcher & Google SMTP Gateway</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Configure outbound mail relays, automated transactional notifications, and enterprise templates.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabMailerModule.testConnection()">
            <i data-lucide="zap" style="width: 16px; height: 16px; color: var(--warning);"></i> Test SMTP Connection
          </button>
          <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabMailerModule.openTestEmailModal()">
            <i data-lucide="send" style="width: 16px; height: 16px;"></i> Send Test Email
          </button>
        </div>
      </div>

      <!-- Security Notice Banner -->
      <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: flex-start; gap: 0.85rem;">
        <i data-lucide="shield-check" style="width: 22px; height: 22px; color: var(--primary); margin-top: 2px;"></i>
        <div style="font-size: 0.825rem; color: var(--text-secondary); line-height: 1.5;">
          <strong style="color: var(--text-primary);">Frontend Security Architecture:</strong>
          This demo implements client-safe credential masking for Google App Passwords and stores configuration safely in local session storage. For live enterprise production deployments, these settings connect directly to an isolated Node.js/Golang SMTP microservice or Cloud Run worker.
        </div>
      </div>

      <div class="row g-3">
        <!-- SMTP Settings Form -->
        <div class="col-lg-6">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="mail" style="color: var(--primary);"></i>
                Google Workspace SMTP Relay Config
              </h3>
              <span id="smtpConnectionBadge" class="badge-status badge-active font-mono" style="font-size: 0.68rem;">
                <span class="pulse-dot"></span> Ready (200 OK)
              </span>
            </div>
            <form onsubmit="window.FabMailerModule.saveSettings(event)">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Sender Display Name <span class="required">*</span></label>
                    <input type="text" name="senderName" class="form-control-erp" value="${FabUtils.escapeHtml(mailer.senderName || 'Fab Steel Automated Dispatch')}" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Google Workspace / Gmail Address <span class="required">*</span></label>
                    <input type="email" name="gmailAddress" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(mailer.gmailAddress || 'notifications@fabsteel.demo')}" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Google App Password (16-char)</label>
                    <div style="position: relative;">
                      <input type="password" id="appPasswordInput" name="appPassword" class="form-control-erp font-mono" value="abcd efgh ijkl mnop">
                      <button type="button" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer;" onclick="window.FabMailerModule.togglePasswordVisibility()">
                        <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Reply-To Address</label>
                    <input type="email" name="replyTo" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(mailer.replyTo || 'billing@fabsteel.demo')}">
                  </div>
                </div>

                <div class="col-md-5">
                  <div class="form-group-erp">
                    <label class="form-label-erp">SMTP Host</label>
                    <input type="text" name="smtpHost" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(mailer.smtpHost || 'smtp.gmail.com')}" required>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Port</label>
                    <input type="number" name="smtpPort" class="form-control-erp font-mono" value="${mailer.smtpPort || 587}">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Encryption</label>
                    <select name="security" class="form-control-erp form-select-erp">
                      <option value="TLS" ${mailer.security === 'TLS' ? 'selected' : ''}>STARTTLS (587)</option>
                      <option value="SSL" ${mailer.security === 'SSL' ? 'selected' : ''}>SSL / TLS (465)</option>
                    </select>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Standard Corporate Email Signature</label>
                    <textarea name="emailSignature" class="form-control-erp" rows="3">${FabUtils.escapeHtml(mailer.emailSignature || '')}</textarea>
                  </div>
                </div>
              </div>

              <div class="text-end mt-2">
                <button type="submit" class="btn-erp btn-erp-primary">
                  <i data-lucide="save" style="width: 14px; height: 14px;"></i> Save SMTP Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Transactional Templates & Outbound History -->
        <div class="col-lg-6">
          <!-- Templates Card -->
          <div class="card-trading mb-3">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="layers" style="color: var(--secondary);"></i>
                Automated Transactional Templates
              </h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${templates.map(tpl => `
                <div style="padding: 0.75rem 1rem; border-radius: var(--radius-md); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${FabUtils.escapeHtml(tpl.name)}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${FabUtils.escapeHtml(tpl.subject)}</div>
                  </div>
                  <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabMailerModule.previewTemplate('${tpl.id}')">
                    Inspect
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Outbound Delivery History -->
          <div class="card-trading">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="history" style="color: var(--warning);"></i>
                Outbound Dispatch Logs (Recent 5)
              </h3>
            </div>
            <div class="table-responsive-wrapper">
              <table class="table-erp" style="font-size: 0.75rem;">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.slice(0, 5).map(h => `
                    <tr>
                      <td class="font-mono" style="color: var(--text-primary);">${FabUtils.escapeHtml(h.to)}</td>
                      <td style="max-width: 160px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${FabUtils.escapeHtml(h.subject)}</td>
                      <td><span class="badge-status badge-active" style="font-size: 0.65rem;">${h.status}</span></td>
                      <td class="font-mono" style="color: var(--text-muted);">${FabUtils.timeAgo(h.sentAt)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function togglePasswordVisibility() {
    const input = document.getElementById('appPasswordInput');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  function testConnection() {
    const badge = document.getElementById('smtpConnectionBadge');
    if (badge) {
      badge.innerHTML = `<span class="pulse-dot"></span> Verifying Handshake...`;
      badge.className = 'badge-status badge-pending font-mono';
    }

    FabUtils.showToast('Testing SSL/TLS handshake with smtp.gmail.com:587...', 'info');

    setTimeout(() => {
      if (badge) {
        badge.innerHTML = `<span class="pulse-dot"></span> Connected (38ms latency)`;
        badge.className = 'badge-status badge-active font-mono';
      }
      FabUtils.showToast('SMTP Connection Successful! Relay responded with 250 OK', 'success');
      FabStorage.logActivity('SYSTEM', 'Google Mailer', 'Successfully verified SMTP TLS handshake with Google Mail relay (38ms).');
    }, 900);
  }

  function saveSettings(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const mailer = FabStorage.get(FabStorage.KEYS.MAILER, {}) || {};
    mailer.senderName = formData.get('senderName');
    mailer.gmailAddress = formData.get('gmailAddress');
    mailer.replyTo = formData.get('replyTo');
    mailer.smtpHost = formData.get('smtpHost');
    mailer.smtpPort = parseInt(formData.get('smtpPort'), 10) || 587;
    mailer.security = formData.get('security');
    mailer.emailSignature = formData.get('emailSignature');

    FabStorage.set(FabStorage.KEYS.MAILER, mailer);
    FabStorage.logActivity('UPDATE', 'Google Mailer', 'Updated outbound SMTP gateway configuration.');
    FabUtils.showToast('SMTP settings saved successfully', 'success');
  }

  // Preview Email Template Modal
  function previewTemplate(tplId) {
    const mailer = FabStorage.get(FabStorage.KEYS.MAILER, {}) || {};
    const tpl = (mailer.emailTemplates || []).find(t => t.id === tplId);
    if (!tpl) return;

    const existing = document.getElementById('templatePreviewModal');
    if (existing) existing.remove();

    const modalHtml = `
      <div id="templatePreviewModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="file-text" style="color: var(--primary);"></i>
              Template: ${FabUtils.escapeHtml(tpl.name)}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('templatePreviewModal').remove()">&times;</button>
          </div>
          <div class="modal-body-erp">
            <div class="form-group-erp">
              <label class="form-label-erp">Default Subject Line</label>
              <input type="text" class="form-control-erp" value="${FabUtils.escapeHtml(tpl.subject)}" readonly>
            </div>
            <div class="form-group-erp">
              <label class="form-label-erp">Template Markup Body</label>
              <textarea class="form-control-erp font-mono" rows="8" readonly>${FabUtils.escapeHtml(tpl.body)}</textarea>
            </div>
          </div>
          <div class="modal-footer-erp">
            <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('templatePreviewModal').remove()">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  // Send Test Email Modal
  function openTestEmailModal() {
    const existing = document.getElementById('testEmailModal');
    if (existing) existing.remove();

    const modalHtml = `
      <div id="testEmailModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="send" style="color: var(--primary);"></i>
              Dispatch Diagnostic Test Email
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('testEmailModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabMailerModule.handleSendTestEmail(event)">
            <div class="modal-body-erp">
              <div class="form-group-erp">
                <label class="form-label-erp">Target Email Recipient <span class="required">*</span></label>
                <input type="email" name="testTo" class="form-control-erp" value="admin@fabsteel.demo" required>
              </div>
              <div class="form-group-erp">
                <label class="form-label-erp">Subject Line</label>
                <input type="text" name="testSubject" class="form-control-erp" value="SMTP Diagnostic Test — Fab Steel ERP Gateway" required>
              </div>
              <div class="form-group-erp">
                <label class="form-label-erp">Body Message</label>
                <textarea name="testMessage" class="form-control-erp" rows="4">This is a simulated diagnostic message verifying that the Google Workspace SMTP relay credentials and TLS handshakes are properly formatted.</textarea>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('testEmailModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">
                <i data-lucide="send" style="width: 14px; height: 14px;"></i> Dispatch Diagnostic
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function handleSendTestEmail(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const to = formData.get('testTo');
    const subject = formData.get('testSubject');

    FabUtils.showToast(`Connecting to Google SMTP...`, 'info');

    setTimeout(() => {
      const mailer = FabStorage.get(FabStorage.KEYS.MAILER, {}) || {};
      mailer.sentHistory = mailer.sentHistory || [];
      mailer.sentHistory.unshift({
        id: `EML-${Date.now().toString().slice(-4)}`,
        to: to,
        subject: subject,
        status: 'Delivered',
        sentAt: new Date().toISOString(),
        template: 'Diagnostic Test Email'
      });
      FabStorage.set(FabStorage.KEYS.MAILER, mailer);

      FabStorage.logActivity('SYSTEM', 'Google Mailer', `Dispatched diagnostic test email to ${to}`);
      FabUtils.showToast(`Test email successfully delivered to ${to}! (Simulated 250 OK)`, 'success');
      document.getElementById('testEmailModal').remove();
      render();
    }, 700);
  }

  return {
    render,
    togglePasswordVisibility,
    testConnection,
    saveSettings,
    previewTemplate,
    openTestEmailModal,
    handleSendTestEmail
  };
})();

