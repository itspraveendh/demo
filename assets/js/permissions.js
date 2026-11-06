/**
 * FAB STEEL CONSULTANCY ERP - ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSION ENGINE
 * Enforces strict enterprise security boundaries across all views and operations
 */

window.FabPermissions = (function () {
  'use strict';

  // Role Constants
  const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    HR_STAFF: 'HR_STAFF',
    FINANCE_STAFF: 'FINANCE_STAFF',
    PARTNER: 'PARTNER',
    EMPLOYEE: 'EMPLOYEE',
    SITE_MANAGER: 'SITE_MANAGER'
  };

  // Module Keys
  const MODULES = {
    DASHBOARD: 'dashboard',
    EMPLOYEES: 'employees',
    ATTENDANCE: 'attendance',
    INVOICES: 'invoices',
    PARTNERS: 'partners',
    SALARY: 'salary',
    PAYROLL: 'payroll',
    WEBSITE: 'website',
    TEAM: 'team',
    CONTACTS: 'contacts',
    INQUIRIES: 'inquiries',
    MAILER: 'mailer',
    LOGS: 'logs',
    REPORTS: 'reports',
    SETTINGS: 'settings'
  };

  // Role Access Matrix: defines which modules each role can navigate to
  const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: {
      name: 'Super Administrator',
      modules: Object.values(MODULES),
      actions: { create: true, read: true, update: true, delete: true, export: true }
    },
    [ROLES.HR_STAFF]: {
      name: 'Human Resources Staff',
      modules: [
        MODULES.DASHBOARD,
        MODULES.EMPLOYEES,
        MODULES.ATTENDANCE,
        MODULES.SALARY,
        MODULES.TEAM,
        MODULES.REPORTS,
        MODULES.LOGS
      ],
      actions: {
        [MODULES.EMPLOYEES]: { create: true, read: true, update: true, delete: false },
        [MODULES.ATTENDANCE]: { create: true, read: true, update: true, delete: true },
        [MODULES.SALARY]: { create: false, read: true, update: true, delete: false },
        [MODULES.TEAM]: { create: true, read: true, update: true, delete: false }
      }
    },
    [ROLES.FINANCE_STAFF]: {
      name: 'Finance & Accounts Specialist',
      modules: [
        MODULES.DASHBOARD,
        MODULES.INVOICES,
        MODULES.PARTNERS,
        MODULES.SALARY,
        MODULES.PAYROLL,
        MODULES.REPORTS,
        MODULES.LOGS
      ],
      actions: {
        [MODULES.INVOICES]: { create: true, read: true, update: true, delete: true },
        [MODULES.PARTNERS]: { create: true, read: true, update: true, delete: false },
        [MODULES.SALARY]: { create: true, read: true, update: true, delete: true },
        [MODULES.PAYROLL]: { create: true, read: true, update: true, delete: true }
      }
    },
    [ROLES.PARTNER]: {
      name: 'Industrial Partner & Client',
      modules: [
        MODULES.DASHBOARD, // Customized Partner Dashboard
        MODULES.INVOICES,  // Scoped to own invoices
        MODULES.INQUIRIES  // Submit own inquiries
      ],
      actions: {
        [MODULES.INVOICES]: { create: false, read: true, update: false, delete: false },
        [MODULES.INQUIRIES]: { create: true, read: true, update: false, delete: false }
      }
    },
    [ROLES.EMPLOYEE]: {
      name: 'Engineering Personnel',
      modules: [
        MODULES.DASHBOARD, // Customized Personal Dashboard
        MODULES.ATTENDANCE, // Personal punch-in and calendar
        MODULES.SALARY     // Personal payslips
      ],
      actions: {
        [MODULES.ATTENDANCE]: { create: true, read: true, update: false, delete: false },
        [MODULES.SALARY]: { create: false, read: true, update: false, delete: false }
      }
    },
    [ROLES.SITE_MANAGER]: {
      name: 'Site Operations & Erection Manager',
      modules: [
        MODULES.DASHBOARD, // Customized Site Dashboard
        MODULES.EMPLOYEES, // Scoped to assigned site crew
        MODULES.ATTENDANCE // Mark site crew attendance
      ],
      actions: {
        [MODULES.EMPLOYEES]: { create: false, read: true, update: false, delete: false },
        [MODULES.ATTENDANCE]: { create: true, read: true, update: true, delete: false }
      }
    }
  };

  // Check if role is authorized to access a given module
  function canAccessModule(role, moduleName) {
    if (!role) return false;
    if (role === ROLES.SUPER_ADMIN) return true;

    const roleConfig = ROLE_PERMISSIONS[role];
    if (!roleConfig) return false;

    return roleConfig.modules.includes(moduleName);
  }

  // Check if role has action permission on a module
  function canPerformAction(role, action, moduleName) {
    if (role === ROLES.SUPER_ADMIN) return true;

    const roleConfig = ROLE_PERMISSIONS[role];
    if (!roleConfig) return false;

    if (!roleConfig.modules.includes(moduleName)) return false;

    if (roleConfig.actions && roleConfig.actions[moduleName]) {
      return !!roleConfig.actions[moduleName][action];
    }
    return action === 'read';
  }

  // Render a high-impact Enterprise 403 Access Denied view
  function renderAccessDenied(moduleName, role) {
    const roleTitle = (ROLE_PERMISSIONS[role] && ROLE_PERMISSIONS[role].name) || role || 'Your Account Role';
    return `
      <div class="card-trading text-center" style="padding: 4rem 2rem; max-width: 650px; margin: 3rem auto; border: 1px solid rgba(239, 68, 68, 0.3); background: radial-gradient(circle at top, rgba(239, 68, 68, 0.08) 0%, transparent 70%), var(--bg-surface);">
        <div style="width: 72px; height: 72px; margin: 0 auto 1.5rem; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--danger); box-shadow: 0 0 25px rgba(239, 68, 68, 0.25);">
          <i data-lucide="shield-alert" style="width: 36px; height: 36px;"></i>
        </div>
        <div class="badge-status badge-inactive" style="margin-bottom: 1rem; font-family: var(--font-mono); font-size: 0.75rem;">
          <span class="badge-status-dot"></span> HTTP 403 · ACCESS RESTRICTED
        </div>
        <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem;">Enterprise Permission Boundary</h2>
        <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.75rem; font-size: 0.925rem; line-height: 1.6;">
          Your current security profile (<strong style="color: var(--secondary);">${FabUtils.escapeHtml(roleTitle)}</strong>) does not have authorization to view or manipulate the <code style="color: var(--primary); font-family: var(--font-mono); font-weight: 600;">#${FabUtils.escapeHtml(moduleName)}</code> module.
        </p>
        <div style="background-color: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 2rem; text-align: left; font-size: 0.8rem; font-family: var(--font-mono);">
          <div style="color: var(--text-muted); margin-bottom: 4px;">SECURITY CONTEXT AUDIT:</div>
          <div style="color: var(--text-secondary);">Role Policy: <span style="color: var(--warning);">${FabUtils.escapeHtml(role)}</span></div>
          <div style="color: var(--text-secondary);">Target Resource: <span style="color: var(--danger);">${FabUtils.escapeHtml(moduleName)}</span></div>
          <div style="color: var(--text-secondary);">Enforcement: Frontend Session Boundary Guard</div>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <a href="#dashboard" class="btn-erp btn-erp-primary">
            <i data-lucide="layout-dashboard" style="width: 16px; height: 16px;"></i> Return to Dashboard
          </a>
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabAuth.showSwitchRoleModal()">
            <i data-lucide="users" style="width: 16px; height: 16px;"></i> Switch Demo Persona
          </button>
        </div>
      </div>
    `;
  }

  return {
    ROLES,
    MODULES,
    ROLE_PERMISSIONS,
    canAccessModule,
    canPerformAction,
    renderAccessDenied
  };
})();

