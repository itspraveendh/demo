/**
 * FAB STEEL CONSULTANCY ERP - MAIN APPLICATION ORCHESTRATOR
 * Hash-based client router, security guard, global spotlight search (Ctrl+K), and responsive shell
 */

window.FabApp = (function () {
  'use strict';

  // Module Router Mapping
  const ROUTE_MAP = {
    dashboard: window.FabDashboardModule,
    employees: window.FabEmployeesModule,
    attendance: window.FabAttendanceModule,
    invoices: window.FabInvoicesModule,
    partners: window.FabPartnersModule,
    salary: window.FabSalaryModule,
    payroll: window.FabPayrollModule,
    website: window.FabWebsiteModule,
    team: window.FabTeamModule,
    contacts: window.FabContactsModule,
    inquiries: window.FabInquiriesModule,
    mailer: window.FabMailerModule,
    logs: window.FabLogsModule,
    reports: window.FabReportsModule,
    settings: window.FabSettingsModule
  };

  const PAGE_TITLES = {
    dashboard: 'Executive Dashboard',
    employees: 'Employee Management',
    attendance: 'Workforce Attendance',
    invoices: 'Project Invoices',
    partners: 'Enterprise Partners',
    salary: 'Salary Management',
    payroll: 'Monthly Payroll',
    website: 'Website Management',
    team: 'Team Management',
    contacts: 'Contact Messages',
    inquiries: 'Partner Inquiries',
    mailer: 'Google Mailer Gateway',
    logs: 'Activity Audit Trail',
    reports: 'Reports & Analytics',
    settings: 'Enterprise Settings'
  };

  function init() {
    // Enforce login authentication
    if (!FabAuth.requireAuth()) return;

    // Apply saved theme (Default: light)
    const savedTheme = localStorage.getItem(FabStorage.KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIconInit = document.getElementById('themeToggleIcon');
    if (themeIconInit) {
      themeIconInit.setAttribute('data-lucide', savedTheme === 'dark' ? 'sun' : 'moon');
    }

    // Setup Shell UI
    setupSidebar();
    setupTopNav();
    setupGlobalSearch();
    setupLiveTicker();

    // Setup Router Listeners
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('fab_storage_changed', (e) => {
      FabNotifications.updateBadge();
      updateSidebarBadges();
    });

    // Handle initial route
    handleRoute();

    // Initial badge update
    FabNotifications.updateBadge();
    updateSidebarBadges();

    // Enable Lucide icons
    if (window.lucide) window.lucide.createIcons();
  }

  // Hash-based Route Handler
  function handleRoute() {
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    const route = rawHash || 'dashboard';

    const user = FabAuth.getCurrentUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    // Update Top Breadcrumb & Page Title
    const titleEl = document.getElementById('topNavPageTitle');
    const breadcrumbEl = document.getElementById('topNavBreadcrumb');
    const pageTitle = PAGE_TITLES[route] || 'Fab Steel ERP';

    if (titleEl) titleEl.innerText = pageTitle;
    if (breadcrumbEl) breadcrumbEl.innerHTML = `<span>Portal</span> &middot; <span style="color: var(--primary);">${pageTitle}</span>`;
    document.title = `${pageTitle} — Fab Steel Consultancy ERP`;

    // Highlight active sidebar item
    document.querySelectorAll('.nav-item-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === `#${route}` || (route === 'dashboard' && href === '#dashboard')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile drawer on route change
    closeMobileSidebar();

    // Check Role Permissions
    if (!FabPermissions.canAccessModule(user.role, route)) {
      const container = document.getElementById('mainAppContent');
      if (container) {
        container.innerHTML = FabPermissions.renderAccessDenied(route, user.role);
        if (window.lucide) window.lucide.createIcons();
      }
      return;
    }

    // Render corresponding module
    const module = ROUTE_MAP[route];
    if (module && typeof module.render === 'function') {
      module.render('mainAppContent');
    } else {
      // Default to dashboard
      window.location.hash = '#dashboard';
    }

    // Re-bind Lucide icons
    if (window.lucide) window.lucide.createIcons();
  }

  // Sidebar Setup & Role-based Menu Item Visibility
  function setupSidebar() {
    const user = FabAuth.getCurrentUser();
    if (!user) return;

    // Filter menu items by user role
    document.querySelectorAll('.sidebar-nav-list li').forEach(li => {
      const link = li.querySelector('.nav-item-link');
      if (!link) return;
      const href = (link.getAttribute('href') || '').replace('#', '');
      if (href && !FabPermissions.canAccessModule(user.role, href)) {
        li.style.display = 'none';
      } else {
        li.style.display = 'block';
      }
    });

    // Populate user profile info in sidebar footer
    const avatarEl = document.getElementById('sidebarUserAvatar');
    const nameEl = document.getElementById('sidebarUserName');
    const roleEl = document.getElementById('sidebarUserRole');

    if (avatarEl) avatarEl.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    if (nameEl) nameEl.innerText = user.name;
    if (roleEl) roleEl.innerText = user.role.replace('_', ' ');

    // Sidebar collapse toggler
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebar = document.getElementById('appSidebar');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          sidebar.classList.toggle('mobile-open');
          const backdrop = document.getElementById('sidebarBackdrop');
          if (backdrop) backdrop.classList.toggle('active');
        } else {
          sidebar.classList.toggle('collapsed');
          localStorage.setItem('fab_sidebar_collapsed', sidebar.classList.contains('collapsed'));
        }
      });
    }

    // Mobile backdrop click
    const backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMobileSidebar);
    }
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  // Top Nav Setup (Theme switcher, User menu, Notifications)
  function setupTopNav() {
    const user = FabAuth.getCurrentUser();
    if (!user) return;

    // Top User Profile Pill
    const topAvatar = document.getElementById('topNavUserAvatar');
    const topName = document.getElementById('topNavUserName');
    const topRole = document.getElementById('topNavUserRole');

    if (topAvatar) topAvatar.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    if (topName) topName.innerText = user.name;
    if (topRole) topRole.innerText = user.role.replace('_', ' ');

    // Theme Switcher Button
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Profile Dropdown Button
    const profileBtn = document.getElementById('userProfileDropdownBtn');
    const profileMenu = document.getElementById('userProfileDropdownMenu');
    if (profileBtn && profileMenu) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
          profileMenu.classList.remove('show');
        }
      });
    }

    // Notification dropdown button
    const notifBtn = document.getElementById('notifDropdownBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        FabNotifications.toggleDropdown();
      });
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(FabStorage.KEYS.THEME, newTheme);

    const themeIcon = document.getElementById('themeToggleIcon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', newTheme === 'dark' ? 'sun' : 'moon');
      if (window.lucide) window.lucide.createIcons();
    }

    // Trigger Chart.js refresh for theme
    if (window.FabCharts) {
      setTimeout(() => FabCharts.renderAllDashboardCharts(), 100);
    }
    if (window.location.hash === '#reports' && window.FabReportsModule) {
      setTimeout(() => window.FabReportsModule.render(), 100);
    }
  }

  function updateSidebarBadges() {
    const contacts = FabStorage.get(FabStorage.KEYS.CONTACTS, []) || [];
    const unreadContacts = contacts.filter(c => c.status === 'New' || c.status === 'Unread').length;
    const contactBadge = document.getElementById('sidebarContactBadge');
    if (contactBadge) {
      contactBadge.innerText = unreadContacts;
      contactBadge.style.display = unreadContacts > 0 ? 'inline-block' : 'none';
    }

    const inquiries = FabStorage.get(FabStorage.KEYS.INQUIRIES, []) || [];
    const pendingInquiries = inquiries.filter(i => i.status === 'New' || i.status === 'Under Review').length;
    const inqBadge = document.getElementById('sidebarInquiryBadge');
    if (inqBadge) {
      inqBadge.innerText = pendingInquiries;
      inqBadge.style.display = pendingInquiries > 0 ? 'inline-block' : 'none';
    }
  }

  // Global Search Spotlight (Ctrl+K or Cmd+K)
  function setupGlobalSearch() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSpotlightSearch();
      }
      if (e.key === 'Escape') {
        closeSpotlightSearch();
      }
    });

    const searchTriggers = document.querySelectorAll('.trigger-global-search');
    searchTriggers.forEach(btn => {
      btn.addEventListener('click', openSpotlightSearch);
    });
  }

  function openSpotlightSearch() {
    let modal = document.getElementById('globalSearchModal');
    if (!modal) {
      const html = `
        <div id="globalSearchModal" class="search-spotlight-modal active" onclick="if(event.target === this) window.FabApp.closeSpotlightSearch()">
          <div class="search-spotlight-box">
            <div class="search-input-header">
              <i data-lucide="search" style="width: 20px; height: 20px; color: var(--primary);"></i>
              <input type="text" id="spotlightSearchInput" placeholder="Quick find personnel, partners, invoices, or inquiries (ESC to exit)..." oninput="window.FabApp.handleSpotlightInput(this.value)">
              <span class="kbd-shortcut">ESC</span>
            </div>
            <div id="spotlightSearchResults" class="search-results-list">
              <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                Type a name, ID (e.g. <code>EMP-1001</code>, <code>INV-2026-001</code>), or client partner to jump immediately.
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', html);
      if (window.lucide) window.lucide.createIcons();
    } else {
      modal.classList.add('active');
    }

    setTimeout(() => {
      const input = document.getElementById('spotlightSearchInput');
      if (input) {
        input.value = '';
        input.focus();
      }
    }, 50);
  }

  function closeSpotlightSearch() {
    const modal = document.getElementById('globalSearchModal');
    if (modal) modal.classList.remove('active');
  }

  function handleSpotlightInput(val) {
    const resultsContainer = document.getElementById('spotlightSearchResults');
    if (!resultsContainer) return;

    const q = (val || '').toLowerCase().trim();
    if (!q) {
      resultsContainer.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          Type to search across all ERP modules.
        </div>
      `;
      return;
    }

    const employees = (FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || []).filter(e =>
      e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || (e.department && e.department.toLowerCase().includes(q))
    ).slice(0, 3);

    const partners = (FabStorage.get(FabStorage.KEYS.PARTNERS, []) || []).filter(p =>
      p.companyName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    ).slice(0, 3);

    const invoices = (FabStorage.get(FabStorage.KEYS.INVOICES, []) || []).filter(i =>
      i.id.toLowerCase().includes(q) || i.partnerName.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    ).slice(0, 3);

    const contacts = (FabStorage.get(FabStorage.KEYS.CONTACTS, []) || []).filter(c =>
      c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    ).slice(0, 2);

    const totalMatches = employees.length + partners.length + invoices.length + contacts.length;

    if (totalMatches === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No matching records found for "${FabUtils.escapeHtml(q)}".
        </div>
      `;
      return;
    }

    let out = '';

    if (employees.length > 0) {
      out += `<div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); padding: 6px 12px; text-transform: uppercase;">Employees</div>`;
      employees.forEach(e => {
        out += `
          <div class="search-result-item" onclick="window.FabApp.navigateFromSpotlight('#employees', '${e.id}')">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <i data-lucide="user" style="width: 16px; height: 16px; color: var(--primary);"></i>
              <div>
                <strong style="color: var(--text-primary); font-size: 0.85rem;">${FabUtils.escapeHtml(e.name)}</strong>
                <span style="font-size: 0.725rem; color: var(--text-muted); margin-left: 6px;">${FabUtils.escapeHtml(e.designation)}</span>
              </div>
            </div>
            <span class="font-mono" style="font-size: 0.7rem; color: var(--primary);">${e.id}</span>
          </div>
        `;
      });
    }

    if (partners.length > 0) {
      out += `<div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); padding: 6px 12px; text-transform: uppercase;">Partners & EPC</div>`;
      partners.forEach(p => {
        out += `
          <div class="search-result-item" onclick="window.FabApp.navigateFromSpotlight('#partners', '${p.id}')">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <i data-lucide="building" style="width: 16px; height: 16px; color: var(--secondary);"></i>
              <div>
                <strong style="color: var(--text-primary); font-size: 0.85rem;">${FabUtils.escapeHtml(p.companyName)}</strong>
                <span style="font-size: 0.725rem; color: var(--text-muted); margin-left: 6px;">${FabUtils.escapeHtml(p.partnershipType)}</span>
              </div>
            </div>
            <span class="font-mono" style="font-size: 0.7rem; color: var(--secondary);">${p.id}</span>
          </div>
        `;
      });
    }

    if (invoices.length > 0) {
      out += `<div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); padding: 6px 12px; text-transform: uppercase;">Invoices</div>`;
      invoices.forEach(i => {
        out += `
          <div class="search-result-item" onclick="window.FabApp.navigateFromSpotlight('#invoices', '${i.id}')">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <i data-lucide="file-text" style="width: 16px; height: 16px; color: var(--success);"></i>
              <div>
                <strong style="color: var(--text-primary); font-size: 0.85rem;">${i.id} &middot; ${FabUtils.escapeHtml(i.partnerName)}</strong>
                <span style="font-size: 0.725rem; color: var(--text-muted); margin-left: 6px;">${FabUtils.formatCurrency(i.totalAmount)}</span>
              </div>
            </div>
            <span class="badge-status badge-${(i.status || '').toLowerCase()}" style="font-size: 0.65rem;">${i.status}</span>
          </div>
        `;
      });
    }

    resultsContainer.innerHTML = out;
    if (window.lucide) window.lucide.createIcons();
  }

  function navigateFromSpotlight(hash, id) {
    closeSpotlightSearch();
    window.location.hash = hash;
  }

  // Live Trading Terminal Ribbon Telemetry
  function setupLiveTicker() {
    const tickerContainer = document.getElementById('terminalTickerContent');
    if (!tickerContainer) return;

    const items = [
      { code: 'STEEL_HRB', name: 'Hot-Rolled Coil', val: '$682/MT', change: '+1.4%', up: true },
      { code: 'AISC_COMP', name: 'AISC Detailing Index', val: '98.8%', change: '+0.2%', up: true },
      { code: 'TEKLA_LOD', name: 'Model LOD 400', val: 'Active', change: 'Online', up: true },
      { code: 'FAB_YARD4', name: 'Apex Refinery Yard', val: '4,200 MT', change: 'Erection 92%', up: true },
      { code: 'WELD_QC', name: 'AWS CWI Inspection', val: '100% Pass', change: 'Zero NCR', up: true }
    ];

    tickerContainer.innerHTML = items.map(t => `
      <div class="ticker-item">
        <span style="color: var(--text-muted); font-weight: 700;">${t.code}:</span>
        <span style="color: var(--text-primary); font-weight: 600;">${t.val}</span>
        <span class="${t.up ? 'val-up' : 'val-down'}">${t.change}</span>
      </div>
    `).join('&middot;');
  }

  // DOM Content Loaded Handler
  document.addEventListener('DOMContentLoaded', init);

  return {
    init,
    handleRoute,
    toggleTheme,
    closeMobileSidebar,
    openSpotlightSearch,
    closeSpotlightSearch,
    handleSpotlightInput,
    navigateFromSpotlight
  };
})();

