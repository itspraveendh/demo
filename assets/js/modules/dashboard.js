/**
 * FAB STEEL CONSULTANCY ERP - DASHBOARD MODULE
 * High-performance trading terminal dashboard with role-tailored view routing
 */

window.FabDashboardModule = (function () {
  'use strict';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = FabAuth.getCurrentUser();
    if (!user) return;

    // Tailored role dashboards
    if (user.role === 'PARTNER') {
      renderPartnerDashboard(container, user);
      return;
    }
    if (user.role === 'EMPLOYEE') {
      renderEmployeeDashboard(container, user);
      return;
    }
    if (user.role === 'SITE_MANAGER') {
      renderSiteManagerDashboard(container, user);
      return;
    }

    // Default: Super Admin, HR, Finance Dashboard
    renderSuperAdminDashboard(container, user);
  }

  // =========================================================================
  // SUPER ADMIN / MANAGEMENT / HR / FINANCE DASHBOARD
  // =========================================================================
  function renderSuperAdminDashboard(container, user) {
    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];
    const partners = FabStorage.get(FabStorage.KEYS.PARTNERS, []) || [];
    const invoices = FabStorage.get(FabStorage.KEYS.INVOICES, []) || [];
    const attendance = FabStorage.get(FabStorage.KEYS.ATTENDANCE, []) || [];
    const salary = FabStorage.get(FabStorage.KEYS.SALARY, []) || [];
    const payroll = FabStorage.get(FabStorage.KEYS.PAYROLL, []) || [];
    const contacts = FabStorage.get(FabStorage.KEYS.CONTACTS, []) || [];
    const inquiries = FabStorage.get(FabStorage.KEYS.INQUIRIES, []) || [];
    const logs = FabStorage.get(FabStorage.KEYS.LOGS, []) || [];

    // Calculate live KPI metrics
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => (e.status || '').toLowerCase() === 'active').length;

    // Attendance stats for today (or sample dates)
    const presentToday = attendance.filter(a => (a.status || '').toLowerCase() === 'present' || (a.status || '').toLowerCase() === 'late').length;
    const absentToday = attendance.filter(a => (a.status || '').toLowerCase() === 'absent').length;

    const totalPartners = partners.length;
    const totalInvoices = invoices.length;
    const pendingInvoices = invoices.filter(i => (i.status || '').toLowerCase() === 'pending' || (i.status || '').toLowerCase() === 'overdue').length;

    const totalMonthlyRevenue = invoices
      .filter(i => (i.status || '').toLowerCase() === 'paid')
      .reduce((sum, i) => sum + (Number(i.paidAmount) || Number(i.totalAmount) || 0), 0);

    const totalSalaryExpense = salary.reduce((sum, s) => sum + (Number(s.netSalary) || 0), 0);
    const pendingPayroll = payroll.filter(p => (p.status || '').toLowerCase() === 'pending').length;

    const unreadMessages = contacts.filter(c => c.status === 'New' || c.status === 'Unread').length;
    const pendingInquiries = inquiries.filter(i => i.status === 'New' || i.status === 'Under Review').length;

    // Recent 5 Invoices
    const recentInvoices = invoices.slice(0, 5);
    // Recent 4 Employees
    const recentEmployees = employees.slice(0, 4);
    // Recent 6 Activity Logs
    const recentLogs = logs.slice(0, 6);

    const html = `
      <!-- Top Action Ribbon -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <h1 class="page-title">Executive Operations Terminal</h1>
            <span class="badge-status badge-active font-mono" style="font-size: 0.7rem;">
              <span class="pulse-dot"></span> LIVE TELEMETRY
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Welcome back, <strong>${FabUtils.escapeHtml(user.name)}</strong> (${FabUtils.escapeHtml(user.designation)})
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <a href="#invoices" class="btn-erp btn-erp-primary">
            <i data-lucide="file-plus-2" style="width: 16px; height: 16px;"></i> + Create Invoice
          </a>
          <a href="#employees" class="btn-erp btn-erp-secondary">
            <i data-lucide="user-plus" style="width: 16px; height: 16px;"></i> + Add Employee
          </a>
          <button type="button" class="btn-erp btn-erp-ghost" onclick="window.FabAuth.showSwitchRoleModal()" title="Switch Persona">
            <i data-lucide="users" style="width: 16px; height: 16px;"></i> Switch Role
          </button>
        </div>
      </div>

      <!-- 12 KPI CARDS (Trading Terminal Grid) -->
      <div class="kpi-grid">
        <!-- 1. Total Employees -->
        <div class="kpi-card" onclick="window.location.hash='#employees'">
          <div class="kpi-top">
            <span class="kpi-title">Total Employees</span>
            <div class="kpi-icon-wrapper kpi-icon-blue"><i data-lucide="users" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value">${totalEmployees}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-up"><i data-lucide="arrow-up-right" style="width: 13px; height: 13px;"></i> +8.5%</span>
            <span>vs last month</span>
          </div>
        </div>

        <!-- 2. Active Employees -->
        <div class="kpi-card" onclick="window.location.hash='#employees'">
          <div class="kpi-top">
            <span class="kpi-title">Active Workforce</span>
            <div class="kpi-icon-wrapper kpi-icon-cyan"><i data-lucide="user-check" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value">${activeEmployees}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-up"><i data-lucide="check" style="width: 13px; height: 13px;"></i> 96% Active</span>
            <span>Roster capacity</span>
          </div>
        </div>

        <!-- 3. Present Today -->
        <div class="kpi-card" onclick="window.location.hash='#attendance'">
          <div class="kpi-top">
            <span class="kpi-title">Present Today</span>
            <div class="kpi-icon-wrapper kpi-icon-emerald"><i data-lucide="clock" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value">${presentToday}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-up"><i data-lucide="arrow-up-right" style="width: 13px; height: 13px;"></i> 92%</span>
            <span>Site & HQ attendance</span>
          </div>
        </div>

        <!-- 4. Absent Today -->
        <div class="kpi-card" onclick="window.location.hash='#attendance'">
          <div class="kpi-top">
            <span class="kpi-title">Absent / Leave</span>
            <div class="kpi-icon-wrapper kpi-icon-rose"><i data-lucide="user-x" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value">${absentToday}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-neutral">Controlled</span>
            <span>Leaves approved</span>
          </div>
        </div>

        <!-- 5. Total Partners -->
        <div class="kpi-card" onclick="window.location.hash='#partners'">
          <div class="kpi-top">
            <span class="kpi-title">Total Partners</span>
            <div class="kpi-icon-wrapper kpi-icon-purple"><i data-lucide="building-2" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value">${totalPartners}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-up"><i data-lucide="arrow-up-right" style="width: 13px; height: 13px;"></i> +2 New</span>
            <span>EPC & Fabricators</span>
          </div>
        </div>

        <!-- 6. Total Invoices -->
        <div class="kpi-card" onclick="window.location.hash='#invoices'">
          <div class="kpi-top">
            <span class="kpi-title">Total Invoices</span>
            <div class="kpi-icon-wrapper kpi-icon-blue"><i data-lucide="file-text" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value">${totalInvoices}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-up">+14.2%</span>
            <span>Contracts billed</span>
          </div>
        </div>

        <!-- 7. Pending Invoices -->
        <div class="kpi-card" onclick="window.location.hash='#invoices'">
          <div class="kpi-top">
            <span class="kpi-title">Pending Invoices</span>
            <div class="kpi-icon-wrapper kpi-icon-amber"><i data-lucide="alert-circle" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value" style="color: var(--warning);">${pendingInvoices}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-down">Follow-ups active</span>
            <span>Receivables pipeline</span>
          </div>
        </div>

        <!-- 8. Monthly Revenue -->
        <div class="kpi-card" onclick="window.location.hash='#invoices'">
          <div class="kpi-top">
            <span class="kpi-title">Settled Revenue</span>
            <div class="kpi-icon-wrapper kpi-icon-emerald"><i data-lucide="dollar-sign" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value" style="color: var(--success);">${FabUtils.formatCurrency(totalMonthlyRevenue)}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-up"><i data-lucide="arrow-up-right" style="width: 13px; height: 13px;"></i> +18.4%</span>
            <span>YTD growth curve</span>
          </div>
        </div>

        <!-- 9. Total Monthly Salary -->
        <div class="kpi-card" onclick="window.location.hash='#salary'">
          <div class="kpi-top">
            <span class="kpi-title">Monthly Payroll Base</span>
            <div class="kpi-icon-wrapper kpi-icon-cyan"><i data-lucide="banknote" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value">${FabUtils.formatCurrency(totalSalaryExpense)}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-neutral">Stable</span>
            <span>25 structures locked</span>
          </div>
        </div>

        <!-- 10. Pending Payroll -->
        <div class="kpi-card" onclick="window.location.hash='#payroll'">
          <div class="kpi-top">
            <span class="kpi-title">Pending Payroll</span>
            <div class="kpi-icon-wrapper kpi-icon-amber"><i data-lucide="credit-card" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value" style="color: var(--warning);">${pendingPayroll}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-down">Awaiting authorization</span>
            <span>October cycle</span>
          </div>
        </div>

        <!-- 11. Website Messages -->
        <div class="kpi-card" onclick="window.location.hash='#contacts'">
          <div class="kpi-top">
            <span class="kpi-title">Inbound Messages</span>
            <div class="kpi-icon-wrapper kpi-icon-blue"><i data-lucide="mail" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value">${contacts.length}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-up">${unreadMessages} Unread</span>
            <span>Public portal feed</span>
          </div>
        </div>

        <!-- 12. Pending Inquiries -->
        <div class="kpi-card" onclick="window.location.hash='#inquiries'">
          <div class="kpi-top">
            <span class="kpi-title">Partner Inquiries</span>
            <div class="kpi-icon-wrapper kpi-icon-purple"><i data-lucide="help-circle" style="width: 18px; height: 18px;"></i></div>
          </div>
          <div class="kpi-value" style="color: var(--secondary);">${pendingInquiries}</div>
          <div class="kpi-bottom">
            <span class="kpi-trend trend-up">Under evaluation</span>
            <span>Global EPC RFPs</span>
          </div>
        </div>
      </div>

      <!-- ANALYTICS CHARTS SECTION -->
      <div class="row g-3 mb-4">
        <!-- Chart A: Revenue Analytics -->
        <div class="col-lg-8">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="trending-up" style="color: var(--primary);"></i>
                Contract Revenue & Trajectory (12-Month Period)
              </h3>
              <span class="badge-status badge-active font-mono" style="font-size:0.68rem;">Dynamic Cache</span>
            </div>
            <div style="height: 290px; position: relative;">
              <canvas id="chartRevenue"></canvas>
            </div>
          </div>
        </div>

        <!-- Chart C: Attendance Doughnut -->
        <div class="col-lg-4">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="pie-chart" style="color: var(--secondary);"></i>
                Workforce Attendance
              </h3>
              <a href="#attendance" style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">Full Sheet &rarr;</a>
            </div>
            <div style="height: 290px; position: relative;">
              <canvas id="chartAttendance"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- SECOND ROW OF CHARTS -->
      <div class="row g-3 mb-4">
        <!-- Chart B: Expense Analytics -->
        <div class="col-lg-4">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="bar-chart-3" style="color: var(--warning);"></i>
                Quarterly Expenditure
              </h3>
            </div>
            <div style="height: 260px; position: relative;">
              <canvas id="chartExpense"></canvas>
            </div>
          </div>
        </div>

        <!-- Chart D: Employee Distribution -->
        <div class="col-lg-4">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="layers" style="color: var(--purple);"></i>
                Department Allocation
              </h3>
            </div>
            <div style="height: 260px; position: relative;">
              <canvas id="chartDepartment"></canvas>
            </div>
          </div>
        </div>

        <!-- Chart E: Invoice Status -->
        <div class="col-lg-4">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="receipt" style="color: var(--success);"></i>
                Invoice Settlement Ratio
              </h3>
            </div>
            <div style="height: 260px; position: relative;">
              <canvas id="chartInvoiceStatus"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- THIRD ROW OF CHARTS -->
      <div class="row g-3 mb-4">
        <!-- Chart F: Payroll Overview -->
        <div class="col-lg-6">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="credit-card" style="color: var(--info);"></i>
                Payroll Disbursement Overview
              </h3>
            </div>
            <div style="height: 250px; position: relative;">
              <canvas id="chartPayrollOverview"></canvas>
            </div>
          </div>
        </div>

        <!-- Chart G: Partner Analytics -->
        <div class="col-lg-6">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="briefcase" style="color: var(--secondary);"></i>
                Partner Portfolio Health
              </h3>
            </div>
            <div style="height: 250px; position: relative;">
              <canvas id="chartPartnerOverview"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- OPERATIONAL DATA FEEDS (Recent Invoices & Live Activity Logs) -->
      <div class="row g-3 mb-4">
        <!-- Recent Invoices Table -->
        <div class="col-lg-7">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="file-text" style="color: var(--primary);"></i>
                Recent Project Invoices
              </h3>
              <a href="#invoices" class="btn-erp btn-erp-ghost btn-erp-sm">View All &rarr;</a>
            </div>
            <div class="table-responsive-wrapper">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Partner Client</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentInvoices.map(inv => `
                    <tr>
                      <td class="font-mono" style="font-weight: 700; color: var(--primary);">
                        ${inv.id}
                      </td>
                      <td style="font-weight: 600;">
                        ${FabUtils.escapeHtml(inv.partnerName)}
                      </td>
                      <td style="color: var(--text-muted); font-size: 0.8rem;">
                        ${FabUtils.formatDate(inv.date)}
                      </td>
                      <td class="font-mono" style="font-weight: 700;">
                        ${FabUtils.formatCurrency(inv.totalAmount)}
                      </td>
                      <td>
                        <span class="badge-status badge-${(inv.status || '').toLowerCase()}">
                          <span class="badge-status-dot"></span>
                          ${inv.status}
                        </span>
                      </td>
                      <td>
                        <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabInvoicesModule.viewInvoice('${inv.id}')" title="Inspect Document">
                          <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Audit Activities -->
        <div class="col-lg-5">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="activity" style="color: var(--secondary);"></i>
                Real-Time Activity Audit
              </h3>
              <a href="#logs" class="btn-erp btn-erp-ghost btn-erp-sm">View All &rarr;</a>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${recentLogs.map(log => `
                <div style="padding: 0.65rem 0.85rem; border-radius: var(--radius-md); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); display: flex; align-items: flex-start; gap: 0.75rem;">
                  <div style="width: 28px; height: 28px; min-width: 28px; border-radius: 50%; background: var(--bg-surface-hover); display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 0.7rem; font-weight: 700;">
                    ${log.action.slice(0, 3)}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.775rem; color: var(--text-primary); font-weight: 600; margin-bottom: 2px;">
                      ${FabUtils.escapeHtml(log.description)}
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">
                      <span>${FabUtils.escapeHtml(log.user)} (${log.role})</span>
                      <span>${log.time}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- RECENT REGISTRATIONS & SYSTEM HEALTH -->
      <div class="row g-3">
        <!-- Latest Personnel Registrations -->
        <div class="col-lg-6">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="user-check" style="color: var(--primary);"></i>
                Latest Engineering Staff
              </h3>
              <a href="#employees" class="btn-erp btn-erp-ghost btn-erp-sm">Employee Directory &rarr;</a>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${recentEmployees.map(emp => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0.85rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${emp.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-medium);" alt="${emp.name}">
                    <div>
                      <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">${FabUtils.escapeHtml(emp.name)}</div>
                      <div style="font-size: 0.72rem; color: var(--text-secondary);">${FabUtils.escapeHtml(emp.designation)} &middot; <span style="color: var(--secondary);">${FabUtils.escapeHtml(emp.department)}</span></div>
                    </div>
                  </div>
                  <span class="badge-status badge-active" style="font-size: 0.68rem;">${emp.status}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Pending Critical Actions -->
        <div class="col-lg-6">
          <div class="card-trading h-100">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="bell" style="color: var(--warning);"></i>
                Pending Approvals & Critical Follow-ups
              </h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <i data-lucide="file-warning" style="color: var(--warning); width: 20px; height: 20px;"></i>
                  <div>
                    <div style="font-size: 0.825rem; font-weight: 700; color: var(--text-primary);">Overdue Receivables Notice</div>
                    <div style="font-size: 0.72rem; color: var(--text-secondary);">3 partner invoices require commercial escalation.</div>
                  </div>
                </div>
                <a href="#invoices" class="btn-erp btn-erp-secondary btn-erp-sm">Review</a>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: var(--radius-md); background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <i data-lucide="users" style="color: var(--primary); width: 20px; height: 20px;"></i>
                  <div>
                    <div style="font-size: 0.825rem; font-weight: 700; color: var(--text-primary);">October Payroll Batch Review</div>
                    <div style="font-size: 0.72rem; color: var(--text-secondary);">4 personnel pending payment authorization.</div>
                  </div>
                </div>
                <a href="#payroll" class="btn-erp btn-erp-secondary btn-erp-sm">Authorize</a>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25);">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <i data-lucide="globe" style="color: var(--success); width: 20px; height: 20px;"></i>
                  <div>
                    <div style="font-size: 0.825rem; font-weight: 700; color: var(--text-primary);">Website CMS Sync Active</div>
                    <div style="font-size: 0.72rem; color: var(--text-secondary);">Public preview is live and reflecting current ERP state.</div>
                  </div>
                </div>
                <a href="public-preview/index.html" target="_blank" class="btn-erp btn-erp-primary btn-erp-sm">Preview Web</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Trigger Chart.js render after DOM nodes exist
    setTimeout(() => {
      FabCharts.renderAllDashboardCharts();
    }, 50);
  }

  // =========================================================================
  // PARTNER DEDICATED PORTAL
  // =========================================================================
  function renderPartnerDashboard(container, user) {
    const partnerId = user.partnerId || 'PART-1001';
    const partner = FabStorage.findById(FabStorage.KEYS.PARTNERS, partnerId) || {
      companyName: 'Apex Heavy Engineering Ltd.',
      contactPerson: user.name,
      gstNumber: 'US-TX-99882211',
      status: 'Active'
    };

    const allInvoices = FabStorage.get(FabStorage.KEYS.INVOICES, []) || [];
    const ownInvoices = allInvoices.filter(i => i.partnerId === partnerId || i.partnerName.includes(partner.companyName.split(' ')[0]));

    const totalBilled = ownInvoices.reduce((sum, i) => sum + (Number(i.totalAmount) || 0), 0);
    const totalPaid = ownInvoices.reduce((sum, i) => sum + (Number(i.paidAmount) || 0), 0);
    const outstanding = Math.max(0, totalBilled - totalPaid);

    const html = `
      <div style="margin-bottom: 1.5rem;">
        <span class="badge-status badge-active font-mono" style="margin-bottom: 0.5rem;">
          <span class="badge-status-dot"></span> PARTNER CLIENT PORTAL
        </span>
        <h1 class="page-title">${FabUtils.escapeHtml(partner.companyName)}</h1>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">
          Welcome, <strong>${FabUtils.escapeHtml(user.name)}</strong>. Manage your structural steel contracts, drawings, and billing statements.
        </p>
      </div>

      <!-- Partner KPI summary -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card-trading">
            <div class="kpi-title">Total Contract Value</div>
            <div class="kpi-value">${FabUtils.formatCurrency(totalBilled)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${ownInvoices.length} Invoices Issued</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-trading">
            <div class="kpi-title">Total Settled</div>
            <div class="kpi-value" style="color: var(--success);">${FabUtils.formatCurrency(totalPaid)}</div>
            <div style="font-size: 0.75rem; color: var(--success);">Wire / NEFT Verified</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-trading">
            <div class="kpi-title">Outstanding Balance</div>
            <div class="kpi-value" style="color: ${outstanding > 0 ? 'var(--warning)' : 'var(--text-muted)'};">${FabUtils.formatCurrency(outstanding)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Current Due</div>
          </div>
        </div>
      </div>

      <!-- Partner Invoices List -->
      <div class="card-trading mb-4">
        <div class="card-header-clean">
          <h3 class="card-title-main">
            <i data-lucide="file-text" style="color: var(--primary);"></i>
            Assigned Invoices & Engineering Deliverables
          </h3>
          <a href="#inquiries" class="btn-erp btn-erp-primary btn-erp-sm">+ Submit New RFP Inquiry</a>
        </div>
        <div class="table-responsive-wrapper">
          <table class="table-erp">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Description</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${ownInvoices.length === 0 ? `
                <tr><td colspan="7" class="text-center py-4 text-muted">No invoices assigned to your account.</td></tr>
              ` : ownInvoices.map(inv => `
                <tr>
                  <td class="font-mono" style="font-weight: 700; color: var(--primary);">${inv.id}</td>
                  <td style="font-weight: 500;">${FabUtils.escapeHtml(inv.description)}</td>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">${FabUtils.formatDate(inv.date)}</td>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">${FabUtils.formatDate(inv.dueDate)}</td>
                  <td class="font-mono" style="font-weight: 700;">${FabUtils.formatCurrency(inv.totalAmount)}</td>
                  <td>
                    <span class="badge-status badge-${(inv.status || '').toLowerCase()}">
                      <span class="badge-status-dot"></span> ${inv.status}
                    </span>
                  </td>
                  <td>
                    <button type="button" class="btn-erp btn-erp-secondary btn-erp-sm" onclick="window.FabInvoicesModule.viewInvoice('${inv.id}')">
                      <i data-lucide="download" style="width: 13px; height: 13px;"></i> View / Print
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // EMPLOYEE PERSONAL DASHBOARD
  // =========================================================================
  function renderEmployeeDashboard(container, user) {
    const empId = user.employeeId || 'EMP-1001';
    const employee = FabStorage.findById(FabStorage.KEYS.EMPLOYEES, empId) || {
      name: user.name,
      id: empId,
      department: user.department,
      designation: user.designation,
      assignedSite: 'Main Engineering Center',
      avatar: user.avatar
    };

    const attendance = FabStorage.get(FabStorage.KEYS.ATTENDANCE, []) || [];
    const myAttendance = attendance.filter(a => a.employeeId === empId);

    const salary = FabStorage.get(FabStorage.KEYS.SALARY, []) || [];
    const mySalary = salary.find(s => s.employeeId === empId) || salary[0];

    const todayDateStr = new Date().toISOString().split('T')[0];
    const todayRecord = myAttendance.find(a => a.date === todayDateStr);

    const html = `
      <div style="margin-bottom: 1.5rem;">
        <span class="badge-status badge-active font-mono" style="margin-bottom: 0.5rem;">
          <span class="badge-status-dot"></span> EMPLOYEE SELF-SERVICE PORTAL
        </span>
        <h1 class="page-title">Personal Workspace & Punch Clock</h1>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">
          Engineering Center: <strong>${FabUtils.escapeHtml(employee.assignedSite)}</strong>
        </p>
      </div>

      <div class="row g-3 mb-4">
        <!-- Profile Card -->
        <div class="col-lg-4">
          <div class="card-trading text-center h-100" style="padding: 1.75rem 1.25rem;">
            <img src="${employee.avatar}" style="width: 84px; height: 84px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 3px solid var(--primary); box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);" alt="${employee.name}">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 0.25rem;">${FabUtils.escapeHtml(employee.name)}</h3>
            <div style="color: var(--secondary); font-size: 0.8rem; font-weight: 600; margin-bottom: 0.75rem;">${FabUtils.escapeHtml(employee.designation)}</div>
            <div class="badge-status badge-active font-mono" style="margin-bottom: 1.25rem;">${employee.id} &middot; ${FabUtils.escapeHtml(employee.department)}</div>
            
            <div style="text-align: left; background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); font-size: 0.8rem; border: 1px solid var(--border-subtle);">
              <div style="margin-bottom: 6px;"><strong style="color: var(--text-muted);">Email:</strong> ${FabUtils.escapeHtml(employee.email || user.email)}</div>
              <div style="margin-bottom: 6px;"><strong style="color: var(--text-muted);">Assigned Site:</strong> ${FabUtils.escapeHtml(employee.assignedSite)}</div>
              <div><strong style="color: var(--text-muted);">Base Salary:</strong> ${FabUtils.formatCurrency(employee.basicSalary)}/mo</div>
            </div>
          </div>
        </div>

        <!-- Punch Clock & Today's Attendance -->
        <div class="col-lg-4">
          <div class="card-trading text-center h-100" style="padding: 1.75rem 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="kpi-title" style="margin-bottom: 1rem;">Daily Time Tracker</div>
              <div id="liveClockDisplay" style="font-size: 2.25rem; font-family: var(--font-mono); font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">
                ${new Date().toLocaleTimeString()}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>

              <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem; font-size: 0.85rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: var(--text-muted);">Today's Status:</span>
                  <span class="badge-status badge-present">${todayRecord ? todayRecord.status : 'Not Punched'}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-muted);">Recorded Check-in:</span>
                  <span class="font-mono" style="font-weight: 700;">${todayRecord ? todayRecord.checkIn : '—'}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <button type="button" class="btn-erp btn-erp-success w-100" onclick="window.FabDashboardModule.punchClock('in', '${empId}', '${employee.name}', '${employee.department}', '${employee.assignedSite}')">
                <i data-lucide="log-in" style="width: 16px; height: 16px;"></i> Punch In
              </button>
              <button type="button" class="btn-erp btn-erp-danger w-100" onclick="window.FabDashboardModule.punchClock('out', '${empId}', '${employee.name}', '${employee.department}', '${employee.assignedSite}')">
                <i data-lucide="log-out" style="width: 16px; height: 16px;"></i> Punch Out
              </button>
            </div>
          </div>
        </div>

        <!-- Latest Salary Slip Preview -->
        <div class="col-lg-4">
          <div class="card-trading h-100" style="padding: 1.75rem 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="card-header-clean">
                <h3 class="card-title-main">
                  <i data-lucide="receipt" style="color: var(--success);"></i>
                  Latest Salary Slip
                </h3>
                <span class="badge-status badge-paid font-mono" style="font-size: 0.65rem;">Oct 2026</span>
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">Monthly Net Compensation</div>
              <div class="font-mono" style="font-size: 2rem; font-weight: 800; color: var(--success); margin-bottom: 1rem;">
                ${FabUtils.formatCurrency(mySalary ? mySalary.netSalary : 6500)}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.7;">
                <div>Basic: <strong>${FabUtils.formatCurrency(mySalary ? mySalary.basicSalary : 5000)}</strong></div>
                <div>HRA + Allowances: <strong>${FabUtils.formatCurrency(mySalary ? mySalary.hra + mySalary.allowances : 2000)}</strong></div>
                <div>Deductions (Tax/PF): <strong style="color: var(--danger);">- ${FabUtils.formatCurrency(mySalary ? mySalary.deductions : 500)}</strong></div>
              </div>
            </div>

            <button type="button" class="btn-erp btn-erp-primary mt-3" onclick="window.FabSalaryModule.viewSalarySlip('${empId}')">
              <i data-lucide="download" style="width: 16px; height: 16px;"></i> Download Official Pay Slip
            </button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  // Punch clock action for employee
  function punchClock(direction, empId, name, dept, site) {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0].slice(0, 5);

    const attendance = FabStorage.get(FabStorage.KEYS.ATTENDANCE, []) || [];
    let record = attendance.find(a => a.employeeId === empId && a.date === today);

    if (!record) {
      record = {
        id: `ATT-${Date.now().toString().slice(-4)}`,
        employeeId: empId,
        employeeName: name,
        department: dept,
        date: today,
        checkIn: nowTime,
        checkOut: '—',
        workingHours: 8.0,
        status: 'Present',
        site: site,
        notes: 'Self-punched via Employee Portal'
      };
      attendance.unshift(record);
      FabStorage.set(FabStorage.KEYS.ATTENDANCE, attendance);
      FabUtils.showToast(`Checked in successfully at ${nowTime}`, 'success');
    } else {
      if (direction === 'out') {
        record.checkOut = nowTime;
        FabStorage.set(FabStorage.KEYS.ATTENDANCE, attendance);
        FabUtils.showToast(`Checked out successfully at ${nowTime}`, 'success');
      } else {
        FabUtils.showToast(`Already checked in today at ${record.checkIn}`, 'info');
      }
    }
    render();
  }

  // =========================================================================
  // SITE MANAGER DASHBOARD
  // =========================================================================
  function renderSiteManagerDashboard(container, user) {
    const siteName = user.site || 'Apex Industrial Plant - Site A';
    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];
    const siteCrew = employees.filter(e => e.assignedSite === siteName || e.department === 'Field Operations');

    const html = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge-status badge-active font-mono" style="margin-bottom: 0.5rem;">
            <span class="badge-status-dot"></span> SITE OPERATIONS & FIELD COMMAND
          </span>
          <h1 class="page-title">${FabUtils.escapeHtml(siteName)}</h1>
          <p style="color: var(--text-secondary); font-size: 0.875rem;">
            Site Manager: <strong>${FabUtils.escapeHtml(user.name)}</strong> &middot; Field Workforce Roll Call
          </p>
        </div>
        <div style="display: flex; gap: 0.65rem;">
          <a href="#attendance" class="btn-erp btn-erp-primary">
            <i data-lucide="check-square" style="width: 16px; height: 16px;"></i> Mark Daily Crew Attendance
          </a>
        </div>
      </div>

      <!-- Crew on Site Table -->
      <div class="card-trading mb-4">
        <div class="card-header-clean">
          <h3 class="card-title-main">
            <i data-lucide="hard-hat" style="color: var(--warning);"></i>
            Assigned Field Crew & Safety Compliance (${siteCrew.length} Personnel)
          </h3>
          <span class="badge-status badge-active font-mono" style="font-size:0.68rem;">Active Site</span>
        </div>
        <div class="table-responsive-wrapper">
          <table class="table-erp">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Personnel</th>
                <th>Role / Trade</th>
                <th>Site</th>
                <th>Status</th>
                <th>Quick Attendance</th>
              </tr>
            </thead>
            <tbody>
              ${siteCrew.map(c => `
                <tr>
                  <td class="font-mono" style="font-weight: 700; color: var(--primary);">${c.id}</td>
                  <td style="font-weight: 600;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <img src="${c.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" alt="${c.name}">
                      ${FabUtils.escapeHtml(c.name)}
                    </div>
                  </td>
                  <td style="color: var(--text-secondary);">${FabUtils.escapeHtml(c.designation)}</td>
                  <td style="color: var(--secondary); font-size: 0.8rem;">${FabUtils.escapeHtml(c.assignedSite)}</td>
                  <td>
                    <span class="badge-status badge-${(c.status || '').toLowerCase()}">${c.status}</span>
                  </td>
                  <td>
                    <button type="button" class="btn-erp btn-erp-success btn-erp-sm" onclick="window.FabAttendanceModule.quickMark('${c.id}', 'Present')">
                      Present
                    </button>
                    <button type="button" class="btn-erp btn-erp-danger btn-erp-sm" onclick="window.FabAttendanceModule.quickMark('${c.id}', 'Absent')">
                      Absent
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  return {
    render,
    punchClock
  };
})();

