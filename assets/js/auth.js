/**
 * FAB STEEL CONSULTANCY ERP - AUTHENTICATION & SESSION SERVICE
 * Handles login, session management, role persona quick-switching, and password reset flows
 */

window.FabAuth = (function () {
  'use strict';

  const SESSION_KEY = FabStorage.KEYS.SESSION;
  const REMEMBER_KEY = 'fab_erp_remembered_email';

  // Get current session user
  function getCurrentUser() {
    return FabStorage.get(SESSION_KEY, null);
  }

  // Check if authenticated
  function isAuthenticated() {
    const user = getCurrentUser();
    return !!(user && user.email && user.role);
  }

  // Perform Login
  function login(email, password, rememberMe = false) {
    const users = FabStorage.get(FabStorage.KEYS.USERS, []);
    const cleanEmail = String(email || '').trim().toLowerCase();
    
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'Invalid credentials. User not found.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Check demo credentials.' };
    }

    if (user.active === false) {
      return { success: false, message: 'Account has been deactivated by the administrator.' };
    }

    // Set active session
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      designation: user.designation,
      department: user.department,
      site: user.site || 'Global Headquarters',
      employeeId: user.employeeId || null,
      partnerId: user.partnerId || null,
      loginTime: new Date().toISOString()
    };

    FabStorage.set(SESSION_KEY, sessionUser);

    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, user.email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    FabStorage.logActivity('LOGIN', 'Authentication', `User ${user.name} logged in (${user.role}).`);

    return { success: true, user: sessionUser };
  }

  // Quick Switch Persona for Demo Evaluation
  function quickLoginAsRole(roleKey) {
    const users = FabStorage.get(FabStorage.KEYS.USERS, []);
    const user = users.find(u => u.role === roleKey);
    if (user) {
      return login(user.email, user.password, true);
    }
    return { success: false, message: `No demo account registered for role ${roleKey}` };
  }

  // Logout
  function logout() {
    const user = getCurrentUser();
    if (user) {
      FabStorage.logActivity('LOGOUT', 'Authentication', `User ${user.name} logged out.`);
    }
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  // Require Auth guard: if not logged in, redirect to login.html
  function requireAuth() {
    if (!isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  // Show Quick Role Switcher Modal
  function showSwitchRoleModal() {
    const existing = document.getElementById('switchRoleModal');
    if (existing) existing.remove();

    const users = FabStorage.get(FabStorage.KEYS.USERS, []);
    const currentUser = getCurrentUser();

    const modalHtml = `
      <div id="switchRoleModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp" style="max-width: 600px;">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="shield" style="color: var(--primary);"></i>
              Switch Demo Role Persona
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('switchRoleModal').remove()">&times;</button>
          </div>
          <div class="modal-body-erp">
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              Instantly preview how the ERP adapts navigation, views, dashboard metrics, and CRUD permissions for each enterprise role:
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${users.map(u => {
                const isCurrent = currentUser && currentUser.role === u.role;
                return `
                  <div onclick="window.FabAuth.selectRoleAndReload('${u.role}')" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid ${isCurrent ? 'var(--primary)' : 'var(--border-subtle)'}; background-color: ${isCurrent ? 'var(--primary-light)' : 'var(--bg-surface-elevated)'}; cursor: pointer; transition: all var(--transition-fast);" class="role-select-card">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                      <img src="${u.avatar}" style="width: 38px; height: 38px; border-radius: var(--radius-full); object-fit: cover; border: 1px solid var(--border-medium);" alt="${u.name}">
                      <div>
                        <div style="font-weight: 700; font-size: 0.875rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.4rem;">
                          ${FabUtils.escapeHtml(u.name)}
                          ${isCurrent ? '<span class="badge-status badge-active" style="font-size:0.65rem; padding: 1px 6px;">Active</span>' : ''}
                        </div>
                        <div style="font-size: 0.725rem; color: var(--text-muted);">${FabUtils.escapeHtml(u.designation)}</div>
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <span class="badge-status" style="font-family: var(--font-mono); font-size: 0.68rem; background: var(--bg-surface); border: 1px solid var(--border-subtle);">
                        ${u.role}
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          <div class="modal-footer-erp">
            <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('switchRoleModal').remove()">Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function selectRoleAndReload(roleKey) {
    const res = quickLoginAsRole(roleKey);
    if (res.success) {
      FabUtils.showToast(`Switched persona to ${res.user.role}`, 'success');
      setTimeout(() => {
        window.location.hash = '#dashboard';
        window.location.reload();
      }, 350);
    }
  }

  return {
    getCurrentUser,
    isAuthenticated,
    login,
    quickLoginAsRole,
    logout,
    requireAuth,
    showSwitchRoleModal,
    selectRoleAndReload,
    REMEMBER_KEY
  };
})();

