/**
 * FAB STEEL CONSULTANCY ERP - CONTACT FORM MESSAGE MANAGEMENT MODULE
 * Public inquiry inbox, email composer modal, internal engineering notes, status pipeline, and CSV export
 */

window.FabContactsModule = (function () {
  'use strict';

  let statusFilter = 'all';
  let searchQuery = '';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const messages = FabStorage.get(FabStorage.KEYS.CONTACTS, []) || [];
    const unreadCount = messages.filter(m => m.status === 'New' || m.status === 'Unread').length;

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Client Engineering Messages & Inquiries</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Incoming tenders, Tekla detailing inquiries, and consultations received via the public portal.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabContactsModule.exportContactsCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-6">
            <div style="position: relative;">
              <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
              <input type="text" class="form-control-erp" placeholder="Search by sender, email, subject, or message body..." style="padding-left: 36px;" value="${FabUtils.escapeHtml(searchQuery)}" oninput="window.FabContactsModule.handleSearch(this.value)">
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-control-erp form-select-erp" onchange="window.FabContactsModule.handleStatusFilter(this.value)">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All Messages (${messages.length})</option>
              <option value="New" ${statusFilter === 'New' ? 'selected' : ''}>New / Unread (${unreadCount})</option>
              <option value="Read" ${statusFilter === 'Read' ? 'selected' : ''}>Read</option>
              <option value="Replied" ${statusFilter === 'Replied' ? 'selected' : ''}>Replied</option>
              <option value="Archived" ${statusFilter === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabContactsModule.resetFilters()">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="card-trading">
        <div id="contactsTableWrapper">
          ${renderTableContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredMessages() {
    let list = FabStorage.get(FabStorage.KEYS.CONTACTS, []) || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(m =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        (m.message && m.message.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'New') {
        list = list.filter(m => m.status === 'New' || m.status === 'Unread');
      } else {
        list = list.filter(m => m.status === statusFilter);
      }
    }

    return list;
  }

  function renderTableContent() {
    const list = getFilteredMessages();

    if (list.length === 0) {
      return `
        <div style="padding: 3.5rem 1rem; text-align: center; color: var(--text-muted);">
          No contact messages found.
        </div>
      `;
    }

    return `
      <div class="table-responsive-wrapper">
        <table class="table-erp">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Sender</th>
              <th>Subject</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(m => {
              const isUnread = m.status === 'New' || m.status === 'Unread';
              return `
                <tr style="background-color: ${isUnread ? 'rgba(59, 130, 246, 0.05)' : 'transparent'};">
                  <td class="font-mono" style="font-weight: 700; color: var(--primary);">
                    ${m.id}
                  </td>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">
                    ${FabUtils.timeAgo(m.date)}
                  </td>
                  <td>
                    <div style="font-weight: ${isUnread ? '800' : '600'}; color: var(--text-primary);">${FabUtils.escapeHtml(m.name)}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${FabUtils.escapeHtml(m.email)}</div>
                  </td>
                  <td>
                    <div style="font-weight: ${isUnread ? '700' : 'normal'}; color: var(--text-primary); max-width: 320px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                      ${FabUtils.escapeHtml(m.subject)}
                    </div>
                  </td>
                  <td>
                    <span class="badge-status ${isUnread ? 'badge-pending' : (m.status === 'Replied' ? 'badge-active' : 'badge-draft')}">
                      <span class="badge-status-dot"></span> ${m.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; align-items: center; gap: 0.35rem;">
                      <button type="button" class="btn-erp btn-erp-primary btn-erp-sm" onclick="window.FabContactsModule.viewMessage('${m.id}')">
                        <i data-lucide="eye" style="width: 13px; height: 13px;"></i> View
                      </button>
                      <button type="button" class="btn-erp btn-erp-secondary btn-erp-sm" onclick="window.FabContactsModule.openReplyModal('${m.id}')" title="Compose Reply">
                        <i data-lucide="reply" style="width: 13px; height: 13px;"></i>
                      </button>
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm text-danger" onclick="window.FabContactsModule.deleteMessage('${m.id}')" title="Delete">
                        <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function handleSearch(val) {
    searchQuery = val;
    const w = document.getElementById('contactsTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function handleStatusFilter(val) {
    statusFilter = val;
    const w = document.getElementById('contactsTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function resetFilters() {
    searchQuery = '';
    statusFilter = 'all';
    render();
  }

  // View Message Modal
  function viewMessage(id) {
    const m = FabStorage.findById(FabStorage.KEYS.CONTACTS, id);
    if (!m) return;

    if (m.status === 'New' || m.status === 'Unread') {
      m.status = 'Read';
      FabStorage.update(FabStorage.KEYS.CONTACTS, id, { status: 'Read' });
      FabNotifications.updateBadge();
    }

    const existing = document.getElementById('contactDetailModal');
    if (existing) existing.remove();

    const modalHtml = `
      <div id="contactDetailModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="mail" style="color: var(--primary);"></i>
              Message Detail &middot; ${m.id}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('contactDetailModal').remove(); window.FabContactsModule.render();">&times;</button>
          </div>
          <div class="modal-body-erp">
            <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <h4 style="font-size: 1.1rem; font-weight: 800; margin: 0;">${FabUtils.escapeHtml(m.subject)}</h4>
                <span class="badge-status badge-active">${m.status}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">
                From: <strong style="color: var(--text-primary);">${FabUtils.escapeHtml(m.name)}</strong> &lt;${FabUtils.escapeHtml(m.email)}&gt;<br>
                Phone: <strong>${FabUtils.escapeHtml(m.phone || 'Not provided')}</strong> &middot; Received: ${FabUtils.formatDate(m.date)} at ${FabUtils.formatTime(m.date)}
              </div>
            </div>

            <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-size: 0.9rem; line-height: 1.7; color: var(--text-primary); margin-bottom: 1.5rem;">
              ${FabUtils.escapeHtml(m.message)}
            </div>

            <div class="form-group-erp">
              <label class="form-label-erp">Internal Engineering Notes</label>
              <textarea id="contactNotesInput" class="form-control-erp" placeholder="Add confidential notes or assign engineer...">${FabUtils.escapeHtml(m.notes || '')}</textarea>
            </div>
          </div>
          <div class="modal-footer-erp">
            <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabContactsModule.saveNotes('${m.id}')">Save Notes</button>
            <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabContactsModule.openReplyModal('${m.id}')">
              <i data-lucide="reply" style="width: 14px; height: 14px;"></i> Reply to Sender
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function saveNotes(id) {
    const input = document.getElementById('contactNotesInput');
    if (!input) return;
    FabStorage.update(FabStorage.KEYS.CONTACTS, id, { notes: input.value }, 'Contact Messages', `Updated internal notes on message ${id}`);
    FabUtils.showToast('Internal notes saved', 'success');
  }

  // Reply Composer Modal
  function openReplyModal(id) {
    const m = FabStorage.findById(FabStorage.KEYS.CONTACTS, id);
    if (!m) return;

    const existing = document.getElementById('emailReplyModal');
    if (existing) existing.remove();

    const modalHtml = `
      <div id="emailReplyModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="send" style="color: var(--primary);"></i>
              Dispatch Engineering Response
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('emailReplyModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabContactsModule.sendReply(event, '${m.id}')">
            <div class="modal-body-erp">
              <div class="form-group-erp">
                <label class="form-label-erp">Recipient</label>
                <input type="text" class="form-control-erp" value="${FabUtils.escapeHtml(m.name)} &lt;${m.email}&gt;" readonly style="background-color: var(--bg-surface-hover);">
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Subject</label>
                <input type="text" name="subject" class="form-control-erp" value="Re: ${FabUtils.escapeHtml(m.subject)}" required>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Email Body Message</label>
                <textarea name="body" class="form-control-erp" rows="7" required>Dear ${m.name},

Thank you for contacting Fab Steel Consultancy regarding your structural engineering inquiry.

We have reviewed your request and our project engineering estimation desk would be delighted to assist. Attached you will find our preliminary credentials and rate schedule.

Best regards,
Engineering Estimation Desk
Fab Steel Consultancy Global</textarea>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('emailReplyModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">
                <i data-lucide="send" style="width: 14px; height: 14px;"></i> Dispatch Email (Simulated)
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function sendReply(event, id) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const m = FabStorage.findById(FabStorage.KEYS.CONTACTS, id);
    if (!m) return;

    FabStorage.update(FabStorage.KEYS.CONTACTS, id, { status: 'Replied' }, 'Contact Messages', `Dispatched reply to ${m.email} regarding "${formData.get('subject')}"`);

    // Add to simulated mailer logs
    const mailer = FabStorage.get(FabStorage.KEYS.MAILER, {}) || {};
    mailer.sentHistory = mailer.sentHistory || [];
    mailer.sentHistory.unshift({
      id: `EML-${Date.now().toString().slice(-4)}`,
      to: m.email,
      subject: formData.get('subject'),
      status: 'Delivered',
      sentAt: new Date().toISOString(),
      template: 'Contact Form Reply'
    });
    FabStorage.set(FabStorage.KEYS.MAILER, mailer);

    FabUtils.showToast(`Reply dispatched to ${m.email}`, 'success');
    document.getElementById('emailReplyModal').remove();
    const detModal = document.getElementById('contactDetailModal');
    if (detModal) detModal.remove();
    render();
  }

  function deleteMessage(id) {
    if (confirm(`Delete message ${id}?`)) {
      FabStorage.delete(FabStorage.KEYS.CONTACTS, id, 'Contact Messages', `Deleted contact message ${id}`);
      FabUtils.showToast('Message deleted', 'danger');
      render();
    }
  }

  function exportContactsCSV() {
    const list = getFilteredMessages();
    const headers = {
      id: 'Message ID',
      name: 'Sender Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message Body',
      date: 'Date Received',
      status: 'Status'
    };
    FabUtils.exportToCSV(`fab-steel-contact-messages-${new Date().toISOString().split('T')[0]}`, list, headers);
  }

  return {
    render,
    handleSearch,
    handleStatusFilter,
    resetFilters,
    viewMessage,
    saveNotes,
    openReplyModal,
    sendReply,
    deleteMessage,
    exportContactsCSV
  };
})();

