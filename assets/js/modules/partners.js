/**
 * FAB STEEL CONSULTANCY ERP - PARTNER MANAGEMENT MODULE
 * EPC Contractors, Industrial Fabricators, Project Ledgers, and Partner Profile Dashboards
 */

window.FabPartnersModule = (function () {
  'use strict';

  let searchQuery = '';
  let statusFilter = 'all';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const partners = FabStorage.get(FabStorage.KEYS.PARTNERS, []) || [];
    const activeCount = partners.filter(p => (p.status || '').toLowerCase() === 'active').length;

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Enterprise Partners & EPC Contractors</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Manage global structural fabrication clients, steel mill frameworks, and project supply agreements.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabPartnersModule.exportPartnersCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabPartnersModule.openAddModal()">
            <i data-lucide="building" style="width: 16px; height: 16px;"></i> + Add Partner Account
          </button>
        </div>
      </div>

      <!-- Partner KPI summary -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Total Partners</div>
            <div class="kpi-value">${partners.length}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Global accounts</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Active Retainers</div>
            <div class="kpi-value" style="color: var(--success);">${activeCount}</div>
            <div style="font-size: 0.72rem; color: var(--success);">Current contracts</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Pending Renewal</div>
            <div class="kpi-value" style="color: var(--warning);">${partners.length - activeCount}</div>
            <div style="font-size: 0.72rem; color: var(--warning);">MSA under review</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Avg Payment Terms</div>
            <div class="kpi-value" style="color: var(--primary); font-size: 1.45rem;">Net 30</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Standard SLA</div>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-7">
            <div style="position: relative;">
              <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
              <input type="text" class="form-control-erp" placeholder="Search by company name, contact, GSTIN, or city..." style="padding-left: 36px;" value="${FabUtils.escapeHtml(searchQuery)}" oninput="window.FabPartnersModule.handleSearch(this.value)">
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-control-erp form-select-erp" onchange="window.FabPartnersModule.handleStatusFilter(this.value)">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="Active" ${statusFilter === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Pending Renewal" ${statusFilter === 'Pending Renewal' ? 'selected' : ''}>Pending Renewal</option>
              <option value="Inactive" ${statusFilter === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabPartnersModule.resetFilters()">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Partners Grid / Cards -->
      <div id="partnersContainer">
        ${renderPartnerCards()}
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredPartners() {
    let list = FabStorage.get(FabStorage.KEYS.PARTNERS, []) || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        (p.companyName && p.companyName.toLowerCase().includes(q)) ||
        (p.contactPerson && p.contactPerson.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.gstNumber && p.gstNumber.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter(p => (p.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    return list;
  }

  function renderPartnerCards() {
    const list = getFilteredPartners();
    const allInvoices = FabStorage.get(FabStorage.KEYS.INVOICES, []) || [];

    if (list.length === 0) {
      return `
        <div class="card-trading text-center" style="padding: 3rem 1rem; color: var(--text-muted);">
          No partner records match your search criteria.
        </div>
      `;
    }

    return `
      <div class="row g-3">
        ${list.map(p => {
          const invs = allInvoices.filter(i => i.partnerId === p.id || i.partnerName.includes(p.companyName.split(' ')[0]));
          const billed = invs.reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);

          return `
            <div class="col-lg-6">
              <div class="card-trading h-100" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div style="display: flex; gap: 0.85rem; align-items: center;">
                      <img src="${p.logo || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=120&q=80'}" style="width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid var(--border-medium);" alt="${p.companyName}">
                      <div>
                        <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-primary); margin: 0;">${FabUtils.escapeHtml(p.companyName)}</h3>
                        <div style="font-size: 0.75rem; color: var(--secondary); font-weight: 600;">${FabUtils.escapeHtml(p.partnershipType)}</div>
                      </div>
                    </div>
                    <span class="badge-status badge-${(p.status || '').toLowerCase() === 'active' ? 'active' : 'late'}">
                      <span class="badge-status-dot"></span> ${p.status}
                    </span>
                  </div>

                  <div style="background-color: var(--bg-surface-elevated); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1rem; font-size: 0.8rem; line-height: 1.6;">
                    <div><strong>Key Contact:</strong> ${FabUtils.escapeHtml(p.contactPerson)}</div>
                    <div><strong>Email:</strong> ${FabUtils.escapeHtml(p.email)} &middot; <strong>Tel:</strong> ${FabUtils.escapeHtml(p.phone)}</div>
                    <div><strong>Tax / GSTIN:</strong> <code class="font-mono" style="color: var(--primary);">${FabUtils.escapeHtml(p.gstNumber)}</code></div>
                    <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 4px;">${FabUtils.escapeHtml(p.address)}</div>
                  </div>
                </div>

                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); margin-top: 0.5rem; font-size: 0.8rem;">
                    <div>
                      <span style="color: var(--text-muted);">Billed Volume:</span>
                      <strong class="font-mono" style="color: var(--text-primary); margin-left: 4px;">${FabUtils.formatCurrency(billed)}</strong>
                      <span style="color: var(--text-muted); font-size: 0.7rem;">(${invs.length} inv)</span>
                    </div>
                    <div style="display: flex; gap: 0.35rem;">
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabPartnersModule.viewPartnerProfile('${p.id}')" title="Partner Profile & Invoices">
                        <i data-lucide="eye" style="width: 14px; height: 14px;"></i> View
                      </button>
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabPartnersModule.openEditModal('${p.id}')" title="Edit Partner">
                        <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i> Edit
                      </button>
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm text-danger" onclick="window.FabPartnersModule.deletePartner('${p.id}')" title="Delete">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function handleSearch(val) {
    searchQuery = val;
    const c = document.getElementById('partnersContainer');
    if (c) {
      c.innerHTML = renderPartnerCards();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function handleStatusFilter(val) {
    statusFilter = val;
    const c = document.getElementById('partnersContainer');
    if (c) {
      c.innerHTML = renderPartnerCards();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function resetFilters() {
    searchQuery = '';
    statusFilter = 'all';
    render();
  }

  // View Profile Modal
  function viewPartnerProfile(id) {
    const partner = FabStorage.findById(FabStorage.KEYS.PARTNERS, id);
    if (!partner) return;

    const existing = document.getElementById('partnerProfileModal');
    if (existing) existing.remove();

    const allInvoices = FabStorage.get(FabStorage.KEYS.INVOICES, []) || [];
    const invs = allInvoices.filter(i => i.partnerId === partner.id || i.partnerName.includes(partner.companyName.split(' ')[0]));

    const modalHtml = `
      <div id="partnerProfileModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="building-2" style="color: var(--primary);"></i>
              Partner Account &middot; ${FabUtils.escapeHtml(partner.companyName)}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('partnerProfileModal').remove()">&times;</button>
          </div>
          <div class="modal-body-erp">
            <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem; font-size: 0.85rem; line-height: 1.7;">
              <div class="row">
                <div class="col-md-6">
                  <div><strong>Partner ID:</strong> <code class="font-mono" style="color: var(--primary);">${partner.id}</code></div>
                  <div><strong>Lead Representative:</strong> ${FabUtils.escapeHtml(partner.contactPerson)}</div>
                  <div><strong>Email:</strong> ${FabUtils.escapeHtml(partner.email)}</div>
                  <div><strong>Phone:</strong> ${FabUtils.escapeHtml(partner.phone)}</div>
                </div>
                <div class="col-md-6">
                  <div><strong>Partnership Type:</strong> ${FabUtils.escapeHtml(partner.partnershipType)}</div>
                  <div><strong>Payment Terms:</strong> ${FabUtils.escapeHtml(partner.paymentTerms)}</div>
                  <div><strong>Agreement Date:</strong> ${FabUtils.formatDate(partner.agreementDate)}</div>
                  <div><strong>Tax ID:</strong> ${FabUtils.escapeHtml(partner.gstNumber)}</div>
                </div>
              </div>
            </div>

            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">Assigned Commercial Invoices</h4>
            <div class="table-responsive-wrapper">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${invs.length === 0 ? `
                    <tr><td colspan="5" class="text-center py-3 text-muted">No invoices assigned to this partner yet.</td></tr>
                  ` : invs.map(inv => `
                    <tr>
                      <td class="font-mono" style="font-weight: 700; color: var(--primary);">${inv.id}</td>
                      <td>${FabUtils.formatDate(inv.date)}</td>
                      <td class="font-mono" style="font-weight: 700;">${FabUtils.formatCurrency(inv.totalAmount)}</td>
                      <td><span class="badge-status badge-${(inv.status || '').toLowerCase()}">${inv.status}</span></td>
                      <td>
                        <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabInvoicesModule.viewInvoice('${inv.id}')">
                          View
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer-erp">
            <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('partnerProfileModal').remove()">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function openAddModal() {
    openFormModal();
  }

  function openEditModal(id) {
    const p = FabStorage.findById(FabStorage.KEYS.PARTNERS, id);
    if (p) openFormModal(p);
  }

  function openFormModal(partner = null) {
    const existing = document.getElementById('partnerFormModal');
    if (existing) existing.remove();

    const isEdit = !!partner;
    const autoId = isEdit ? partner.id : FabUtils.generateId('PART');

    const modalHtml = `
      <div id="partnerFormModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="${isEdit ? 'edit-3' : 'plus-circle'}" style="color: var(--primary);"></i>
              ${isEdit ? 'Modify Partner ' + partner.id : 'Register New Enterprise Partner'}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('partnerFormModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabPartnersModule.handleFormSubmit(event, ${isEdit ? `'${partner.id}'` : 'null'})">
            <div class="modal-body-erp">
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Partner ID</label>
                    <input type="text" name="id" class="form-control-erp font-mono" value="${autoId}" readonly style="background-color: var(--bg-surface-hover);">
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Company Name <span class="required">*</span></label>
                    <input type="text" name="companyName" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(partner.companyName) : ''}" placeholder="e.g. Severfield Structural Steel" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Contact Person <span class="required">*</span></label>
                    <input type="text" name="contactPerson" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(partner.contactPerson) : ''}" placeholder="Name (Title)" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Email Address <span class="required">*</span></label>
                    <input type="email" name="email" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(partner.email) : ''}" placeholder="procurement@partner.com" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Phone Number <span class="required">*</span></label>
                    <input type="text" name="phone" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(partner.phone) : ''}" placeholder="+1 (555) 000-0000" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Tax / GST Number</label>
                    <input type="text" name="gstNumber" class="form-control-erp font-mono" value="${isEdit ? FabUtils.escapeHtml(partner.gstNumber) : 'US-TX-99001122'}">
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Partnership Classification</label>
                    <input type="text" name="partnershipType" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(partner.partnershipType) : 'EPC Contractor & Fabricator'}">
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Payment Terms</label>
                    <select name="paymentTerms" class="form-control-erp form-select-erp">
                      <option value="Net 15 Days" ${isEdit && partner.paymentTerms === 'Net 15 Days' ? 'selected' : ''}>Net 15 Days</option>
                      <option value="Net 30 Days" ${!isEdit || (isEdit && partner.paymentTerms === 'Net 30 Days') ? 'selected' : ''}>Net 30 Days</option>
                      <option value="Net 45 Days" ${isEdit && partner.paymentTerms === 'Net 45 Days' ? 'selected' : ''}>Net 45 Days</option>
                      <option value="Net 60 Days" ${isEdit && partner.paymentTerms === 'Net 60 Days' ? 'selected' : ''}>Net 60 Days</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Status</label>
                    <select name="status" class="form-control-erp form-select-erp">
                      <option value="Active" ${isEdit && partner.status === 'Active' ? 'selected' : ''}>Active</option>
                      <option value="Pending Renewal" ${isEdit && partner.status === 'Pending Renewal' ? 'selected' : ''}>Pending Renewal</option>
                      <option value="Inactive" ${isEdit && partner.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Office / Fabrication Yard Address</label>
                    <input type="text" name="address" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(partner.address) : ''}" placeholder="Street, City, State, Country">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('partnerFormModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">
                <i data-lucide="check" style="width: 16px; height: 16px;"></i> ${isEdit ? 'Save Changes' : 'Create Partner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function handleFormSubmit(event, editId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const data = {
      id: formData.get('id'),
      companyName: formData.get('companyName').trim(),
      contactPerson: formData.get('contactPerson').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      gstNumber: formData.get('gstNumber').trim(),
      partnershipType: formData.get('partnershipType').trim(),
      paymentTerms: formData.get('paymentTerms'),
      status: formData.get('status'),
      address: formData.get('address').trim(),
      agreementDate: editId ? (FabStorage.findById(FabStorage.KEYS.PARTNERS, editId).agreementDate || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=120&q=80',
      notes: 'Active partner account'
    };

    if (editId) {
      FabStorage.update(FabStorage.KEYS.PARTNERS, editId, data, 'Partners', `Updated partner ${data.companyName}`);
      FabUtils.showToast(`Updated partner ${data.companyName}`, 'success');
    } else {
      FabStorage.add(FabStorage.KEYS.PARTNERS, data, 'Partners', `Added new partner ${data.companyName}`);
      FabNotifications.addNotification('partner', `New Partner Added: ${data.companyName}`, `${data.partnershipType} registered.`, '#partners');
      FabUtils.showToast(`Added partner ${data.companyName}`, 'success');
    }

    document.getElementById('partnerFormModal').remove();
    render();
  }

  function deletePartner(id) {
    const p = FabStorage.findById(FabStorage.KEYS.PARTNERS, id);
    if (!p) return;

    if (confirm(`Are you sure you want to remove partner account ${p.companyName}?`)) {
      FabStorage.delete(FabStorage.KEYS.PARTNERS, id, 'Partners', `Deleted partner ${p.companyName}`);
      FabUtils.showToast(`Deleted partner ${p.companyName}`, 'danger');
      render();
    }
  }

  function exportPartnersCSV() {
    const list = getFilteredPartners();
    const headers = {
      id: 'Partner ID',
      companyName: 'Company Name',
      contactPerson: 'Contact Person',
      email: 'Email',
      phone: 'Phone',
      partnershipType: 'Type',
      gstNumber: 'GSTIN / Tax ID',
      paymentTerms: 'Payment Terms',
      status: 'Status',
      address: 'Address'
    };
    FabUtils.exportToCSV(`fab-steel-partners-${new Date().toISOString().split('T')[0]}`, list, headers);
  }

  return {
    render,
    handleSearch,
    handleStatusFilter,
    resetFilters,
    viewPartnerProfile,
    openAddModal,
    openEditModal,
    handleFormSubmit,
    deletePartner,
    exportPartnersCSV
  };
})();

