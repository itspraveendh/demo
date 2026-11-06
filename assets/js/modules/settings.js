/**
 * FAB STEEL CONSULTANCY ERP - SETTINGS & SYSTEM CONFIGURATION MODULE
 * Company branding, User Management, Role Permissions Matrix, Theme preferences, and JSON Database Backups
 */

window.FabSettingsModule = (function () {
  'use strict';

  let currentTab = 'company'; // 'company', 'users', 'permissions', 'theme', 'notifications', 'data'

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Enterprise Settings & Control Center</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Global corporate identity, user account roles, security matrices, and LocalStorage data engine administration.
          </p>
        </div>
      </div>

      <!-- Settings Navigation Tabs -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem; overflow-x: auto; white-space: nowrap;">
        <button type="button" class="btn-erp btn-erp-sm ${currentTab === 'company' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabSettingsModule.setTab('company')">
          <i data-lucide="building" style="width: 14px; height: 14px;"></i> Company Settings
        </button>
        <button type="button" class="btn-erp btn-erp-sm ${currentTab === 'users' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabSettingsModule.setTab('users')">
          <i data-lucide="users" style="width: 14px; height: 14px;"></i> User Management
        </button>
        <button type="button" class="btn-erp btn-erp-sm ${currentTab === 'permissions' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabSettingsModule.setTab('permissions')">
          <i data-lucide="shield" style="width: 14px; height: 14px;"></i> Role Permissions Matrix
        </button>
        <button type="button" class="btn-erp btn-erp-sm ${currentTab === 'theme' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabSettingsModule.setTab('theme')">
          <i data-lucide="palette" style="width: 14px; height: 14px;"></i> Theme Preferences
        </button>
        <button type="button" class="btn-erp btn-erp-sm ${currentTab === 'notifications' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabSettingsModule.setTab('notifications')">
          <i data-lucide="bell" style="width: 14px; height: 14px;"></i> Notification Rules
        </button>
        <button type="button" class="btn-erp btn-erp-sm ${currentTab === 'data' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabSettingsModule.setTab('data')">
          <i data-lucide="database" style="width: 14px; height: 14px;"></i> Data Management & Backups
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="settingsTabContent">
        ${renderTabContent()}
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function setTab(tab) {
    currentTab = tab;
    render();
  }

  function renderTabContent() {
    switch (currentTab) {
      case 'company': return renderCompanyTab();
      case 'users': return renderUsersTab();
      case 'permissions': return renderPermissionsTab();
      case 'theme': return renderThemeTab();
      case 'notifications': return renderNotificationsTab();
      case 'data': return renderDataTab();
      default: return renderCompanyTab();
    }
  }

  // A. Company Settings
  function renderCompanyTab() {
    const comp = FabStorage.get(FabStorage.KEYS.SETTINGS, {}) || {};
    const bank = comp.bankDetails || {};

    return `
      <div class="row g-3">
        <div class="col-lg-8">
          <div class="card-trading">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="briefcase" style="color: var(--primary);"></i>
                Corporate Entity Details & Legal Identifier
              </h3>
            </div>
            <form onsubmit="window.FabSettingsModule.saveCompanySettings(event)">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Brand Trading Name</label>
                    <input type="text" name="companyName" class="form-control-erp" value="${FabUtils.escapeHtml(comp.companyName || 'Fab Steel Consultancy')}" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Registered Legal Name</label>
                    <input type="text" name="legalName" class="form-control-erp" value="${FabUtils.escapeHtml(comp.legalName || 'Fab Steel Consultancy Global Corp.')}" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Tax Registration / GSTIN / EIN</label>
                    <input type="text" name="gstin" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(comp.gstin || 'US-TX-88392019-STEEL')}" required>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Billing Currency</label>
                    <select name="currency" class="form-control-erp form-select-erp">
                      <option value="USD" ${comp.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                      <option value="INR" ${comp.currency === 'INR' ? 'selected' : ''}>INR (₹)</option>
                      <option value="EUR" ${comp.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                      <option value="GBP" ${comp.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Default Tax Rate (%)</label>
                    <input type="number" name="taxRate" class="form-control-erp font-mono" value="${comp.taxRate || 18}">
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Corporate Contact Email</label>
                    <input type="email" name="email" class="form-control-erp" value="${FabUtils.escapeHtml(comp.email || 'contact@fabsteel.demo')}">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Phone Support Line</label>
                    <input type="text" name="phone" class="form-control-erp" value="${FabUtils.escapeHtml(comp.phone || '+1 (555) 783-3500')}">
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Registered Headquarters Physical Address</label>
                    <textarea name="address" class="form-control-erp" rows="2">${FabUtils.escapeHtml(comp.address || '')}</textarea>
                  </div>
                </div>

                <!-- Banking Details Sub-Section -->
                <div class="col-12">
                  <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0.75rem 0 0.5rem; text-transform: uppercase;">
                    Receiving Bank Account for Invoices
                  </h4>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Bank Name</label>
                    <input type="text" name="bankName" class="form-control-erp" value="${FabUtils.escapeHtml(bank.bankName || 'Standard Chartered Commercial Bank')}">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Account Number</label>
                    <input type="text" name="accountNumber" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(bank.accountNumber || '99882201948271')}">
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">SWIFT / BIC Code</label>
                    <input type="text" name="swiftCode" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(bank.swiftCode || 'SCBLUS33XXX')}">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Routing / IFSC</label>
                    <input type="text" name="routingNumber" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(bank.routingNumber || '026002574')}">
                  </div>
                </div>
              </div>

              <div class="text-end mt-3">
                <button type="submit" class="btn-erp btn-erp-primary">
                  <i data-lucide="check" style="width: 14px; height: 14px;"></i> Save Corporate Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card-trading text-center" style="padding: 2rem 1.25rem;">
            <div style="width: 64px; height: 64px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #1e3a8a, #3b82f6); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.75rem; font-weight: 900; margin: 0 auto 1rem; box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);">
              FSC
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 0.25rem;">${FabUtils.escapeHtml(comp.companyName || 'Fab Steel Consultancy')}</h3>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1.25rem;">Enterprise ERP Management Suite v2.4.0</p>
            <div style="background-color: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); text-align: left; font-size: 0.775rem; line-height: 1.7; border: 1px solid var(--border-subtle);">
              <div><strong style="color: var(--text-primary);">License:</strong> Enterprise Single Tenant</div>
              <div><strong style="color: var(--text-primary);">Storage Engine:</strong> HTML5 WebStorage</div>
              <div><strong style="color: var(--text-primary);">System Status:</strong> <span class="badge-status badge-active" style="padding: 1px 6px; font-size: 0.65rem;">Operational</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function saveCompanySettings(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const comp = FabStorage.get(FabStorage.KEYS.SETTINGS, {}) || {};
    comp.companyName = formData.get('companyName');
    comp.legalName = formData.get('legalName');
    comp.gstin = formData.get('gstin');
    comp.currency = formData.get('currency');
    comp.taxRate = Number(formData.get('taxRate')) || 18;
    comp.email = formData.get('email');
    comp.phone = formData.get('phone');
    comp.address = formData.get('address');
    comp.bankDetails = {
      bankName: formData.get('bankName'),
      accountNumber: formData.get('accountNumber'),
      swiftCode: formData.get('swiftCode'),
      routingNumber: formData.get('routingNumber')
    };

    FabStorage.set(FabStorage.KEYS.SETTINGS, comp);
    FabStorage.logActivity('UPDATE', 'Settings', 'Updated company profile and banking credentials');
    FabUtils.showToast('Company settings successfully updated', 'success');
  }

  // B. User Management Tab
  function renderUsersTab() {
    const users = FabStorage.get(FabStorage.KEYS.USERS, []) || [];

    return `
      <div class="card-trading">
        <div class="card-header-clean">
          <h3 class="card-title-main">
            <i data-lucide="users" style="color: var(--primary);"></i>
            Demo User Accounts & Role Assignments (${users.length} Registered)
          </h3>
          <button type="button" class="btn-erp btn-erp-primary btn-erp-sm" onclick="window.FabSettingsModule.openUserModal()">
            <i data-lucide="user-plus" style="width: 14px; height: 14px;"></i> + Create User Account
          </button>
        </div>
        <div class="table-responsive-wrapper">
          <table class="table-erp">
            <thead>
              <tr>
                <th>User / Identity</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Designation / Site</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <img src="${u.avatar}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover;" alt="${u.name}">
                      <div style="font-weight: 700; color: var(--text-primary);">${FabUtils.escapeHtml(u.name)}</div>
                    </div>
                  </td>
                  <td class="font-mono" style="font-size: 0.8rem;">${FabUtils.escapeHtml(u.email)}</td>
                  <td>
                    <span class="badge-status" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.72rem;">
                      ${u.role}
                    </span>
                  </td>
                  <td style="font-size: 0.8rem; color: var(--text-secondary);">
                    ${FabUtils.escapeHtml(u.designation || 'Staff')} &middot; <span style="color: var(--secondary);">${FabUtils.escapeHtml(u.site || 'HQ')}</span>
                  </td>
                  <td>
                    <span class="badge-status ${u.active !== false ? 'badge-active' : 'badge-inactive'}">
                      ${u.active !== false ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabSettingsModule.openUserModal('${u.id}')" title="Edit User">
                      <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                    </button>
                    <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabSettingsModule.toggleUserStatus('${u.id}')" title="Toggle Active">
                      <i data-lucide="power" style="width: 14px; height: 14px;"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function openUserModal(userId = null) {
    const existing = document.getElementById('userFormModal');
    if (existing) existing.remove();

    const isEdit = !!userId;
    const user = isEdit ? FabStorage.findById(FabStorage.KEYS.USERS, userId) : null;
    const autoId = isEdit ? user.id : `USR-${Math.floor(100 + Math.random() * 900)}`;

    const modalHtml = `
      <div id="userFormModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="${isEdit ? 'edit-3' : 'user-plus'}" style="color: var(--primary);"></i>
              ${isEdit ? 'Modify User ' + user.name : 'Create New Demo Account'}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('userFormModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabSettingsModule.handleUserSubmit(event, ${isEdit ? `'${user.id}'` : 'null'})">
            <div class="modal-body-erp">
              <div class="form-group-erp">
                <label class="form-label-erp">Full Name <span class="required">*</span></label>
                <input type="text" name="name" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(user.name) : ''}" required>
              </div>

              <div class="row g-2">
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Email Address <span class="required">*</span></label>
                    <input type="email" name="email" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(user.email) : ''}" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Password <span class="required">*</span></label>
                    <input type="text" name="password" class="form-control-erp font-mono" value="${isEdit ? FabUtils.escapeHtml(user.password) : 'Demo@123'}" required>
                  </div>
                </div>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Assign Enterprise Role</label>
                <select name="role" class="form-control-erp form-select-erp">
                  <option value="SUPER_ADMIN" ${isEdit && user.role === 'SUPER_ADMIN' ? 'selected' : ''}>Super Admin (Full Access)</option>
                  <option value="HR_STAFF" ${isEdit && user.role === 'HR_STAFF' ? 'selected' : ''}>HR Staff (People, Attendance, Salary View)</option>
                  <option value="FINANCE_STAFF" ${isEdit && user.role === 'FINANCE_STAFF' ? 'selected' : ''}>Finance Staff (Invoices, Payroll, Salary)</option>
                  <option value="PARTNER" ${isEdit && user.role === 'PARTNER' ? 'selected' : ''}>Partner (Own Invoices & Inquiries)</option>
                  <option value="EMPLOYEE" ${isEdit && user.role === 'EMPLOYEE' ? 'selected' : ''}>Employee (Personal Punch & Payslips)</option>
                  <option value="SITE_MANAGER" ${isEdit && user.role === 'SITE_MANAGER' ? 'selected' : ''}>Site Manager (Site Operations & Crew Attendance)</option>
                </select>
              </div>

              <div class="row g-2">
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Designation / Title</label>
                    <input type="text" name="designation" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(user.designation || '') : 'Staff Member'}">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Assigned Site / Branch</label>
                    <input type="text" name="site" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(user.site || '') : 'Global Headquarters - Tower 1'}">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('userFormModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">Save User</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function handleUserSubmit(event, editId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim().toLowerCase(),
      password: formData.get('password').trim(),
      role: formData.get('role'),
      designation: formData.get('designation').trim(),
      site: formData.get('site').trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      active: true
    };

    if (editId) {
      FabStorage.update(FabStorage.KEYS.USERS, editId, data, 'Settings', `Updated user credentials for ${data.name}`);
      FabUtils.showToast(`Updated user ${data.name}`, 'success');
    } else {
      data.id = `USR-${Math.floor(100 + Math.random() * 900)}`;
      FabStorage.add(FabStorage.KEYS.USERS, data, 'Settings', `Created new user ${data.name} (${data.role})`);
      FabUtils.showToast(`Created user ${data.name}`, 'success');
    }

    document.getElementById('userFormModal').remove();
    render();
  }

  function toggleUserStatus(id) {
    const user = FabStorage.findById(FabStorage.KEYS.USERS, id);
    if (!user) return;
    const newState = user.active === false ? true : false;
    FabStorage.update(FabStorage.KEYS.USERS, id, { active: newState }, 'Settings', `${newState ? 'Activated' : 'Deactivated'} user ${user.name}`);
    FabUtils.showToast(`${user.name} is now ${newState ? 'Active' : 'Deactivated'}`, 'info');
    render();
  }

  // C. Role Permissions Matrix
  function renderPermissionsTab() {
    const roles = Object.keys(FabPermissions.ROLE_PERMISSIONS);
    const modules = Object.values(FabPermissions.MODULES);

    return `
      <div class="card-trading">
        <div class="card-header-clean">
          <h3 class="card-title-main">
            <i data-lucide="shield-alert" style="color: var(--secondary);"></i>
            Security Access Control Matrix
          </h3>
          <span class="badge-status badge-active font-mono" style="font-size: 0.68rem;">Enforced at Route Level</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem;">
          The matrix below governs module visibility and route guard barriers. Attempting to navigate to an unauthorized module URL directly will render the ERP 403 Access Denied barrier.
        </p>

        <div class="table-responsive-wrapper">
          <table class="table-erp" style="text-align: center; font-size: 0.775rem;">
            <thead>
              <tr>
                <th style="text-align: left;">ERP Module</th>
                ${roles.map(r => `<th>${r}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${modules.map(mod => `
                <tr>
                  <td style="text-align: left; font-weight: 700; color: var(--text-primary); text-transform: capitalize;">
                    ${mod}
                  </td>
                  ${roles.map(r => {
                    const hasAccess = FabPermissions.canAccessModule(r, mod);
                    return `
                      <td>
                        ${hasAccess ? `
                          <span style="color: var(--success); font-weight: 800;"><i data-lucide="check" style="width: 16px; height: 16px; display: inline;"></i></span>
                        ` : `
                          <span style="color: var(--text-muted);">&mdash;</span>
                        `}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // D. Theme Preferences Tab
  function renderThemeTab() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

    return `
      <div class="card-trading" style="max-width: 650px;">
        <div class="card-header-clean">
          <h3 class="card-title-main">
            <i data-lucide="palette" style="color: var(--primary);"></i>
            Theme Preferences
          </h3>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Switch between the crisp Light Enterprise mode and the high-contrast Dark Trading style. Your preference persists instantly across sessions.
        </p>

        <div class="row g-3">
          <div class="col-6">
            <div onclick="window.FabSettingsModule.applyTheme('light')" style="border: 2px solid ${currentTheme === 'light' ? 'var(--primary)' : 'var(--border-subtle)'}; background: #f8fafc; padding: 1.5rem; border-radius: var(--radius-lg); cursor: pointer; text-align: center;">
              <i data-lucide="sun" style="width: 28px; height: 28px; color: #f59e0b; margin-bottom: 0.5rem;"></i>
              <div style="font-weight: 800; color: #0f172a;">Light Enterprise Mode (Default)</div>
              <div style="font-size: 0.72rem; color: #64748b; margin-top: 4px;">Crisp white panels, high contrast</div>
            </div>
          </div>

          <div class="col-6">
            <div onclick="window.FabSettingsModule.applyTheme('dark')" style="border: 2px solid ${currentTheme === 'dark' ? 'var(--primary)' : 'var(--border-subtle)'}; background: #080c14; padding: 1.5rem; border-radius: var(--radius-lg); cursor: pointer; text-align: center;">
              <i data-lucide="moon" style="width: 28px; height: 28px; color: #38bdf8; margin-bottom: 0.5rem;"></i>
              <div style="font-weight: 800; color: #ffffff;">Dark Trading Mode</div>
              <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">Neon charts, deep midnight navy</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(FabStorage.KEYS.THEME, theme);
    const themeIcon = document.getElementById('themeToggleIcon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      if (window.lucide) window.lucide.createIcons();
    }
    FabUtils.showToast(`Switched theme to ${theme.toUpperCase()} mode`, 'info');
    render();
  }

  // E. Notifications Settings Tab
  function renderNotificationsTab() {
    return `
      <div class="card-trading" style="max-width: 650px;">
        <div class="card-header-clean">
          <h3 class="card-title-main">
            <i data-lucide="bell" style="color: var(--warning);"></i>
            Notification & Alert Rules
          </h3>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.85rem;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-weight: 700;">Inbound Invoice Payment Alerts</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Notify when wire or ACH receipts are recorded</div>
            </div>
            <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--primary);">
          </label>

          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-weight: 700;">Overdue Receivables Escalations</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Raise critical alert when payment exceeds due date</div>
            </div>
            <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--primary);">
          </label>

          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-weight: 700;">Public Web Inquiries & RFP Leads</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Push notification badge on new contact form submission</div>
            </div>
            <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--primary);">
          </label>

          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-weight: 700;">Daily Site Attendance Anomalies</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Alert on late arrivals or absent field crew members</div>
            </div>
            <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--primary);">
          </label>
        </div>
      </div>
    `;
  }

  // F. Data Management Tab
  function renderDataTab() {
    return `
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="download" style="color: var(--success);"></i>
                Export Complete JSON Database
              </h3>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              Download a single consolidated JSON archive of all 25 employees, 10 partners, 20 invoices, attendance logs, and settings for offsite preservation.
            </p>
            <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabStorage.exportAll()">
              <i data-lucide="download" style="width: 16px; height: 16px;"></i> Download JSON Backup
            </button>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="upload" style="color: var(--primary);"></i>
                Restore Database from JSON
              </h3>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              Upload a previously exported Fab Steel ERP backup file to restore full operational state.
            </p>
            <input type="file" id="jsonImportInput" accept=".json" style="display: none;" onchange="window.FabSettingsModule.handleFileImport(event)">
            <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('jsonImportInput').click()">
              <i data-lucide="upload" style="width: 16px; height: 16px;"></i> Select JSON Backup File
            </button>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="refresh-cw" style="color: var(--warning);"></i>
                Reset to Pristine Demo Dataset
              </h3>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              Re-seed the entire ERP database with pristine demo records (25 staff, 10 partners, 20 invoices, 50 attendance logs).
            </p>
            <button type="button" class="btn-erp btn-erp-secondary text-warning" onclick="window.FabSettingsModule.confirmResetDemo()">
              <i data-lucide="rotate-ccw" style="width: 16px; height: 16px;"></i> Reset Demo Database
            </button>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card-trading h-100" style="border-color: rgba(239, 68, 68, 0.3);">
            <div class="card-header-clean">
              <h3 class="card-title-main" style="color: var(--danger);">
                <i data-lucide="trash-2" style="color: var(--danger);"></i>
                Flush LocalStorage
              </h3>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              Wipes all user data tables from browser LocalStorage while preserving session context.
            </p>
            <button type="button" class="btn-erp btn-erp-danger" onclick="window.FabSettingsModule.confirmClearAll()">
              <i data-lucide="alert-triangle" style="width: 16px; height: 16px;"></i> Flush Storage
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const res = FabStorage.importAll(e.target.result);
      if (res.success) {
        FabUtils.showToast('Database restored successfully from JSON file!', 'success');
        setTimeout(() => window.location.reload(), 500);
      } else {
        FabUtils.showToast(`Import failed: ${res.error}`, 'danger');
      }
    };
    reader.readAsText(file);
  }

  function confirmResetDemo() {
    if (confirm('Re-initialize all demo datasets to factory state? Any unsaved edits will be refreshed.')) {
      FabStorage.resetDemoData();
      FabUtils.showToast('Demo data reloaded to pristine state', 'success');
      setTimeout(() => window.location.reload(), 400);
    }
  }

  function confirmClearAll() {
    if (confirm('Are you sure you want to completely flush all LocalStorage ERP tables?')) {
      FabStorage.clearAll();
      FabUtils.showToast('LocalStorage tables flushed', 'danger');
      setTimeout(() => window.location.reload(), 400);
    }
  }

  return {
    render,
    setTab,
    saveCompanySettings,
    openUserModal,
    handleUserSubmit,
    toggleUserStatus,
    applyTheme,
    handleFileImport,
    confirmResetDemo,
    confirmClearAll
  };
})();

