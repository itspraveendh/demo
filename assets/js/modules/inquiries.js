/**
 * FAB STEEL CONSULTANCY ERP - PARTNER INQUIRY & TENDER MANAGEMENT MODULE
 * Commercial evaluation pipeline, staff assignment, review statuses, email replies, and CSV export
 */

window.FabInquiriesModule = (function () {
  'use strict';

  let statusFilter = 'all';
  let searchQuery = '';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const inquiries = FabStorage.get(FabStorage.KEYS.INQUIRIES, []) || [];
    const newCount = inquiries.filter(i => i.status === 'New' || i.status === 'Under Review').length;

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">EPC & Fabrication Partnership Inquiries</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Review incoming joint ventures, long-term steel detailing master agreements, and global RFP tenders.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabInquiriesModule.exportInquiriesCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabInquiriesModule.openSubmitModal()">
            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> + Log Partner Inquiry
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-6">
            <div style="position: relative;">
              <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
              <input type="text" class="form-control-erp" placeholder="Search by company, contact person, or requirements..." style="padding-left: 36px;" value="${FabUtils.escapeHtml(searchQuery)}" oninput="window.FabInquiriesModule.handleSearch(this.value)">
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-control-erp form-select-erp" onchange="window.FabInquiriesModule.handleStatusFilter(this.value)">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All Inquiries (${inquiries.length})</option>
              <option value="New" ${statusFilter === 'New' ? 'selected' : ''}>New (${inquiries.filter(i => i.status === 'New').length})</option>
              <option value="Under Review" ${statusFilter === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Contacted" ${statusFilter === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Approved" ${statusFilter === 'Approved' ? 'selected' : ''}>Approved Partners</option>
              <option value="Rejected" ${statusFilter === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabInquiriesModule.resetFilters()">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="card-trading">
        <div id="inquiriesTableWrapper">
          ${renderTableContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredInquiries() {
    let list = FabStorage.get(FabStorage.KEYS.INQUIRIES, []) || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(i =>
        (i.companyName && i.companyName.toLowerCase().includes(q)) ||
        (i.contactPerson && i.contactPerson.toLowerCase().includes(q)) ||
        (i.email && i.email.toLowerCase().includes(q)) ||
        (i.partnershipType && i.partnershipType.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter(i => (i.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    return list;
  }

  function renderTableContent() {
    const list = getFilteredInquiries();

    if (list.length === 0) {
      return `
        <div style="padding: 3.5rem 1rem; text-align: center; color: var(--text-muted);">
          No partnership inquiries match your current filters.
        </div>
      `;
    }

    return `
      <div class="table-responsive-wrapper">
        <table class="table-erp">
          <thead>
            <tr>
              <th>Inquiry ID</th>
              <th>Company / Organization</th>
              <th>Contact Representative</th>
              <th>Partnership Type</th>
              <th>Assigned Staff</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(inq => {
              let badgeClass = 'badge-draft';
              if (inq.status === 'New') badgeClass = 'badge-pending';
              if (inq.status === 'Under Review') badgeClass = 'badge-review';
              if (inq.status === 'Contacted') badgeClass = 'badge-late';
              if (inq.status === 'Approved') badgeClass = 'badge-approved';
              if (inq.status === 'Rejected') badgeClass = 'badge-rejected';

              return `
                <tr>
                  <td class="font-mono" style="font-weight: 700; color: var(--primary);">${inq.id}</td>
                  <td style="font-weight: 700;">
                    ${FabUtils.escapeHtml(inq.companyName)}
                  </td>
                  <td>
                    <div style="font-weight: 600;">${FabUtils.escapeHtml(inq.contactPerson)}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${FabUtils.escapeHtml(inq.email)}</div>
                  </td>
                  <td style="color: var(--secondary); font-size: 0.8rem; font-weight: 500;">
                    ${FabUtils.escapeHtml(inq.partnershipType)}
                  </td>
                  <td style="font-size: 0.8rem;">
                    ${inq.assignedStaff ? `<strong>${FabUtils.escapeHtml(inq.assignedStaff)}</strong>` : '<span style="color: var(--text-muted);">Unassigned</span>'}
                  </td>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">
                    ${FabUtils.formatDate(inq.submissionDate)}
                  </td>
                  <td>
                    <span class="badge-status ${badgeClass}">
                      <span class="badge-status-dot"></span>
                      ${inq.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <button type="button" class="btn-erp btn-erp-primary btn-erp-sm" onclick="window.FabInquiriesModule.viewInquiry('${inq.id}')">
                      Inspect
                    </button>
                    <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm text-danger" onclick="window.FabInquiriesModule.deleteInquiry('${inq.id}')">
                      <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
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
    const w = document.getElementById('inquiriesTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function handleStatusFilter(val) {
    statusFilter = val;
    const w = document.getElementById('inquiriesTableWrapper');
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

  // View & Update Inquiry Modal
  function viewInquiry(id) {
    const inq = FabStorage.findById(FabStorage.KEYS.INQUIRIES, id);
    if (!inq) return;

    const existing = document.getElementById('inquiryDetailModal');
    if (existing) existing.remove();

    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];

    const modalHtml = `
      <div id="inquiryDetailModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="help-circle" style="color: var(--primary);"></i>
              Partnership Inquiry &middot; ${inq.id}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('inquiryDetailModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabInquiriesModule.saveInquiryUpdates(event, '${inq.id}')">
            <div class="modal-body-erp">
              <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem; line-height: 1.7; font-size: 0.85rem;">
                <div class="row">
                  <div class="col-md-6">
                    <div><strong>Company:</strong> <span style="font-size: 1rem; font-weight: 800; color: var(--text-primary);">${FabUtils.escapeHtml(inq.companyName)}</span></div>
                    <div><strong>Contact:</strong> ${FabUtils.escapeHtml(inq.contactPerson)}</div>
                    <div><strong>Email:</strong> ${FabUtils.escapeHtml(inq.email)} &middot; <strong>Tel:</strong> ${FabUtils.escapeHtml(inq.phone)}</div>
                  </div>
                  <div class="col-md-6">
                    <div><strong>Classification:</strong> ${FabUtils.escapeHtml(inq.partnershipType)}</div>
                    <div><strong>Submitted:</strong> ${FabUtils.formatDate(inq.submissionDate)}</div>
                    <div><strong>Current Status:</strong> <span class="badge-status badge-active">${inq.status}</span></div>
                  </div>
                </div>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Prospective Partner Message / Scope</label>
                <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-size: 0.875rem; line-height: 1.6;">
                  ${FabUtils.escapeHtml(inq.message)}
                </div>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Update Pipeline Status</label>
                    <select name="status" class="form-control-erp form-select-erp">
                      <option value="New" ${inq.status === 'New' ? 'selected' : ''}>New</option>
                      <option value="Under Review" ${inq.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                      <option value="Contacted" ${inq.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                      <option value="Approved" ${inq.status === 'Approved' ? 'selected' : ''}>Approved as Partner</option>
                      <option value="Rejected" ${inq.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                      <option value="Archived" ${inq.status === 'Archived' ? 'selected' : ''}>Archived</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Assign Lead Evaluator</label>
                    <select name="assignedStaff" class="form-control-erp form-select-erp">
                      <option value="">-- Choose Assigned Engineer --</option>
                      ${employees.map(e => `
                        <option value="${e.name}" ${inq.assignedStaff === e.name ? 'selected' : ''}>${FabUtils.escapeHtml(e.name)} (${FabUtils.escapeHtml(e.designation)})</option>
                      `).join('')}
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Confidential Commercial Notes</label>
                <textarea name="notes" class="form-control-erp" placeholder="Tender specifications, bonding capacity, NDA execution...">${FabUtils.escapeHtml(inq.notes || '')}</textarea>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('inquiryDetailModal').remove()">Close</button>
              <button type="submit" class="btn-erp btn-erp-primary">Save Assessment</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function saveInquiryUpdates(event, id) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const newStatus = formData.get('status');
    const assignedStaff = formData.get('assignedStaff');
    const notes = formData.get('notes');

    FabStorage.update(FabStorage.KEYS.INQUIRIES, id, {
      status: newStatus,
      assignedStaff: assignedStaff,
      notes: notes
    }, 'Partner Inquiries', `Updated status of inquiry ${id} to ${newStatus}`);

    // If status changed to Approved, offer to auto-create Partner record if not existing!
    if (newStatus === 'Approved') {
      const inq = FabStorage.findById(FabStorage.KEYS.INQUIRIES, id);
      const partners = FabStorage.get(FabStorage.KEYS.PARTNERS, []) || [];
      const exists = partners.some(p => p.companyName.toLowerCase() === inq.companyName.toLowerCase());
      if (!exists) {
        const newPartner = {
          id: FabUtils.generateId('PART'),
          companyName: inq.companyName,
          contactPerson: inq.contactPerson,
          email: inq.email,
          phone: inq.phone,
          address: 'International Office',
          gstNumber: 'PENDING-REG',
          partnershipType: inq.partnershipType,
          agreementDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          paymentTerms: 'Net 30 Days',
          logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=120&q=80',
          notes: `Created from approved inquiry ${id}`
        };
        FabStorage.add(FabStorage.KEYS.PARTNERS, newPartner, 'Partners', `Auto-registered approved partner ${inq.companyName}`);
        FabUtils.showToast(`Partner account created for ${inq.companyName}`, 'info');
      }
    }

    FabUtils.showToast('Inquiry assessment updated', 'success');
    document.getElementById('inquiryDetailModal').remove();
    render();
  }

  // Open Submit Inquiry Modal (e.g. for Partner role or internal intake)
  function openSubmitModal() {
    const existing = document.getElementById('newInquiryModal');
    if (existing) existing.remove();

    const user = FabAuth.getCurrentUser();

    const modalHtml = `
      <div id="newInquiryModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="plus-circle" style="color: var(--primary);"></i>
              Submit Engineering RFP / Partnership Inquiry
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('newInquiryModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabInquiriesModule.handleNewInquiry(event)">
            <div class="modal-body-erp">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Company / Contractor Name <span class="required">*</span></label>
                    <input type="text" name="companyName" class="form-control-erp" value="${user && user.role === 'PARTNER' ? FabUtils.escapeHtml(user.name.split('(')[0].trim()) : ''}" placeholder="e.g. Foster Wheeler Heavy Engineering" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Contact Person <span class="required">*</span></label>
                    <input type="text" name="contactPerson" class="form-control-erp" value="${user ? FabUtils.escapeHtml(user.name) : ''}" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Contact Email <span class="required">*</span></label>
                    <input type="email" name="email" class="form-control-erp" value="${user ? FabUtils.escapeHtml(user.email) : ''}" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Phone Number <span class="required">*</span></label>
                    <input type="text" name="phone" class="form-control-erp" placeholder="+1 (555) 000-0000" required>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Partnership Classification</label>
                    <select name="partnershipType" class="form-control-erp form-select-erp">
                      <option value="Preferred Global Steel Detailing Partner">Preferred Global Steel Detailing Partner</option>
                      <option value="EPC Contractor & Fabricator">EPC Contractor & Fabricator</option>
                      <option value="Complex Architectural Framing">Complex Architectural Framing</option>
                      <option value="Offshore & Subsea Steel Structures">Offshore & Subsea Steel Structures</option>
                      <option value="Pre-Engineered Steel Buildings (PEB)">Pre-Engineered Steel Buildings (PEB)</option>
                    </select>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Project Scope & Tonnage Estimate <span class="required">*</span></label>
                    <textarea name="message" class="form-control-erp" rows="4" placeholder="Detail estimated metric tonnage, required BIM Level (e.g. LOD 400), target fabrication schedule..." required></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('newInquiryModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">Submit Inquiry</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function handleNewInquiry(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const record = {
      id: `INQ-${Math.floor(4000 + Math.random() * 900)}`,
      companyName: formData.get('companyName').trim(),
      contactPerson: formData.get('contactPerson').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      partnershipType: formData.get('partnershipType'),
      message: formData.get('message').trim(),
      submissionDate: new Date().toISOString(),
      status: 'New',
      assignedStaff: 'Alexander Wright',
      notes: 'Submitted via ERP Partner Desk'
    };

    FabStorage.add(FabStorage.KEYS.INQUIRIES, record, 'Partner Inquiries', `New partner RFP submitted by ${record.companyName}`);
    FabNotifications.addNotification('partner', `New Inquiry: ${record.companyName}`, `${record.partnershipType} inquiry logged.`, '#inquiries');
    FabUtils.showToast(`Inquiry ${record.id} submitted successfully`, 'success');

    document.getElementById('newInquiryModal').remove();
    render();
  }

  function deleteInquiry(id) {
    if (confirm(`Delete inquiry ${id}?`)) {
      FabStorage.delete(FabStorage.KEYS.INQUIRIES, id, 'Partner Inquiries', `Deleted inquiry ${id}`);
      FabUtils.showToast('Inquiry removed', 'danger');
      render();
    }
  }

  function exportInquiriesCSV() {
    const list = getFilteredInquiries();
    const headers = {
      id: 'Inquiry ID',
      companyName: 'Company Name',
      contactPerson: 'Contact Person',
      email: 'Email',
      phone: 'Phone',
      partnershipType: 'Type',
      submissionDate: 'Submission Date',
      status: 'Status',
      assignedStaff: 'Assigned Staff',
      message: 'Scope Message'
    };
    FabUtils.exportToCSV(`fab-steel-inquiries-${new Date().toISOString().split('T')[0]}`, list, headers);
  }

  return {
    render,
    handleSearch,
    handleStatusFilter,
    resetFilters,
    viewInquiry,
    saveInquiryUpdates,
    openSubmitModal,
    handleNewInquiry,
    deleteInquiry,
    exportInquiriesCSV
  };
})();

