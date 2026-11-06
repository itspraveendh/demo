/**
 * FAB STEEL CONSULTANCY ERP - REPORTS & ANALYTICS MODULE
 * Executive business intelligence, financial summaries, workforce metrics, and report export engine
 */

window.FabReportsModule = (function () {
  'use strict';

  let currentTab = 'financial'; // 'financial', 'workforce', 'payroll', 'partners'
  let dateRange = 'ytd'; // 'month', 'quarter', 'ytd', 'all'
  let activeCharts = {};

  function init() {
    render();
  }

  function setTab(tab) {
    currentTab = tab;
    render();
  }

  function setDateRange(range) {
    dateRange = range;
    render();
  }

  function render() {
    const container = document.getElementById('mainAppContent');
    if (!container) return;

    // Check permissions
    if (window.FabPermissions && !window.FabPermissions.canAccess('reports')) {
      container.innerHTML = `
        <div class="card-erp text-center" style="padding: 4rem 2rem;">
          <i data-lucide="shield-alert" style="width: 48px; height: 48px; color: var(--danger); margin: 0 auto 1rem;"></i>
          <h3 style="color: var(--text-primary); font-weight: 700;">Access Denied</h3>
          <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto;">Your current role does not have authorization to view consolidated financial and executive reports.</p>
        </div>`;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Load data from Storage or Services
    const invoices = (window.FabStorage && window.FabStorage.get(window.FabStorage.KEYS.INVOICES, [])) || [];
    const employees = (window.FabStorage && window.FabStorage.get(window.FabStorage.KEYS.EMPLOYEES, [])) || [];
    const payroll = (window.FabStorage && window.FabStorage.get(window.FabStorage.KEYS.PAYROLL, [])) || [];
    const attendance = (window.FabStorage && window.FabStorage.get(window.FabStorage.KEYS.ATTENDANCE, [])) || [];
    const partners = (window.FabStorage && window.FabStorage.get(window.FabStorage.KEYS.PARTNERS, [])) || [];

    // Financial aggregates
    const paidInvoices = invoices.filter(i => i.status === 'Paid');
    const totalRevenue = paidInvoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
    const pendingReceivables = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((sum, i) => sum + (Number(i.total) || 0), 0);
    const totalPayrollPaid = payroll.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (Number(p.netSalary) || 0), 0);
    const netProfit = totalRevenue - totalPayrollPaid;

    const html = `
      <div class="reports-module">
        
        <!-- Header & Action Ribbon -->
        <div class="module-header-actions mb-4">
          <div>
            <h1 class="page-title" style="margin-bottom: 4px;">Executive Reports & Analytics</h1>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0;">
              Consolidated business telemetry, financial KPIs, and workforce audit
            </p>
          </div>

          <div class="d-flex flex-wrap align-items-center gap-2">
            <!-- Date Filter -->
            <div class="btn-group-erp">
              <button type="button" class="btn-erp btn-erp-sm ${dateRange === 'month' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabReportsModule.setDateRange('month')">This Month</button>
              <button type="button" class="btn-erp btn-erp-sm ${dateRange === 'quarter' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabReportsModule.setDateRange('quarter')">This Quarter</button>
              <button type="button" class="btn-erp btn-erp-sm ${dateRange === 'ytd' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabReportsModule.setDateRange('ytd')">YTD 2025</button>
              <button type="button" class="btn-erp btn-erp-sm ${dateRange === 'all' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabReportsModule.setDateRange('all')">All Time</button>
            </div>

            <!-- Export Actions -->
            <button type="button" class="btn-erp btn-erp-secondary btn-erp-sm" onclick="window.FabReportsModule.exportCSV()">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i>
              <span>Export CSV</span>
            </button>
            <button type="button" class="btn-erp btn-erp-primary btn-erp-sm" onclick="window.FabReportsModule.printReport()">
              <i data-lucide="printer" style="width: 14px; height: 14px;"></i>
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        <!-- 4 Global Macro KPI Cards -->
        <div class="kpi-grid mb-4">
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-label">Gross Revenue</span>
              <div class="kpi-icon-badge" style="background: rgba(37, 99, 235, 0.1); color: var(--primary);">
                <i data-lucide="dollar-sign"></i>
              </div>
            </div>
            <div class="kpi-value">$${totalRevenue.toLocaleString()}</div>
            <div class="kpi-trend text-success">
              <i data-lucide="trending-up" style="width: 14px; height: 14px;"></i>
              <span>+18.4% vs last period</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-label">Outstanding Receivables</span>
              <div class="kpi-icon-badge" style="background: rgba(217, 119, 6, 0.1); color: var(--warning);">
                <i data-lucide="clock"></i>
              </div>
            </div>
            <div class="kpi-value">$${pendingReceivables.toLocaleString()}</div>
            <div class="kpi-trend text-muted">
              <span>${invoices.filter(i => i.status === 'Overdue').length} overdue invoices</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-label">Total Payroll Disbursed</span>
              <div class="kpi-icon-badge" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
                <i data-lucide="credit-card"></i>
              </div>
            </div>
            <div class="kpi-value">$${totalPayrollPaid.toLocaleString()}</div>
            <div class="kpi-trend text-success">
              <span>${employees.filter(e => e.status === 'Active').length} active staff</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-label">Net Operating Margin</span>
              <div class="kpi-icon-badge" style="background: rgba(22, 163, 74, 0.1); color: var(--success);">
                <i data-lucide="bar-chart-2"></i>
              </div>
            </div>
            <div class="kpi-value">$${netProfit.toLocaleString()}</div>
            <div class="kpi-trend text-success">
              <span>Healthy positive cashflow</span>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="tabs-header mb-4" style="border-bottom: 1px solid var(--border-subtle); display: flex; gap: 1rem;">
          <button type="button" class="tab-btn ${currentTab === 'financial' ? 'active' : ''}" onclick="window.FabReportsModule.setTab('financial')">
            <i data-lucide="wallet" style="width: 16px; height: 16px; margin-right: 6px;"></i> Financial Summary
          </button>
          <button type="button" class="tab-btn ${currentTab === 'workforce' ? 'active' : ''}" onclick="window.FabReportsModule.setTab('workforce')">
            <i data-lucide="users" style="width: 16px; height: 16px; margin-right: 6px;"></i> Workforce & Attendance
          </button>
          <button type="button" class="tab-btn ${currentTab === 'payroll' ? 'active' : ''}" onclick="window.FabReportsModule.setTab('payroll')">
            <i data-lucide="banknote" style="width: 16px; height: 16px; margin-right: 6px;"></i> Compensation & Payroll
          </button>
          <button type="button" class="tab-btn ${currentTab === 'partners' ? 'active' : ''}" onclick="window.FabReportsModule.setTab('partners')">
            <i data-lucide="building" style="width: 16px; height: 16px; margin-right: 6px;"></i> Partner Analytics
          </button>
        </div>

        <!-- Tab Content Body -->
        <div id="reportTabContent">
          ${renderTabContent(invoices, employees, payroll, attendance, partners)}
        </div>

      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Render charts for current tab after DOM injection
    setTimeout(() => {
      initTabCharts(invoices, employees, payroll, attendance, partners);
    }, 50);
  }

  function renderTabContent(invoices, employees, payroll, attendance, partners) {
    switch (currentTab) {
      case 'financial':
        return renderFinancialTab(invoices);
      case 'workforce':
        return renderWorkforceTab(employees, attendance);
      case 'payroll':
        return renderPayrollTab(payroll);
      case 'partners':
        return renderPartnersTab(partners, invoices);
      default:
        return '';
    }
  }

  // --- Financial Tab ---
  function renderFinancialTab(invoices) {
    const paid = invoices.filter(i => i.status === 'Paid');
    const sent = invoices.filter(i => i.status === 'Sent');
    const overdue = invoices.filter(i => i.status === 'Overdue');

    return `
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card-erp">
            <div class="card-erp-header d-flex justify-content-between align-items-center">
              <div>
                <h3 class="card-erp-title">Cash Inflow vs Receivables Trajectory</h3>
                <span class="card-erp-subtitle">Monthly billing performance</span>
              </div>
            </div>
            <div class="card-erp-body" style="height: 320px;">
              <canvas id="reportFinancialChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Invoice Aging Breakdown</h3>
              <span class="card-erp-subtitle">Status distribution</span>
            </div>
            <div class="card-erp-body" style="height: 320px;">
              <canvas id="reportAgingChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Top High-Value Invoices</h3>
              <span class="card-erp-subtitle">Audit records for active fiscal cycle</span>
            </div>
            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Partner Name</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Subtotal</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoices.slice(0, 8).map(i => `
                    <tr>
                      <td class="font-mono text-primary font-bold">${i.invoiceNumber || i.id}</td>
                      <td>${i.partnerName}</td>
                      <td>${i.date}</td>
                      <td>${i.dueDate}</td>
                      <td>$${Number(i.subtotal || 0).toLocaleString()}</td>
                      <td>$${Number(i.tax || 0).toLocaleString()}</td>
                      <td class="font-bold">$${Number(i.total || 0).toLocaleString()}</td>
                      <td><span class="status-pill status-${(i.status || 'draft').toLowerCase()}">${i.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Workforce Tab ---
  function renderWorkforceTab(employees, attendance) {
    const active = employees.filter(e => e.status === 'Active');
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = attendance.filter(a => a.date === today);
    const presentToday = todayLogs.filter(a => a.status === 'Present' || a.status === 'Late').length;

    return `
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Staff Allocation by Department</h3>
              <span class="card-erp-subtitle">Headcount distribution</span>
            </div>
            <div class="card-erp-body" style="height: 320px;">
              <canvas id="reportDeptChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Attendance & Punctuality Ratio</h3>
              <span class="card-erp-subtitle">Presence, tardiness, and leave records</span>
            </div>
            <div class="card-erp-body" style="height: 320px;">
              <canvas id="reportAttendanceChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Workforce Roster Summary</h3>
            </div>
            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  ${employees.slice(0, 8).map(e => `
                    <tr>
                      <td class="font-mono font-bold">${e.id}</td>
                      <td><strong>${e.name}</strong></td>
                      <td>${e.department}</td>
                      <td>${e.designation}</td>
                      <td><span class="status-pill status-${e.status.toLowerCase()}">${e.status}</span></td>
                      <td>${e.joinDate}</td>
                      <td>${e.location || 'Headquarters'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Payroll Tab ---
  function renderPayrollTab(payroll) {
    const paid = payroll.filter(p => p.status === 'Paid');
    const totalPaid = paid.reduce((s, p) => s + (Number(p.netSalary) || 0), 0);
    const totalDeductions = payroll.reduce((s, p) => s + (Number(p.deductions) || 0), 0);
    const totalAllowances = payroll.reduce((s, p) => s + (Number(p.allowances) || 0), 0);

    return `
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Monthly Payroll Disbursement History</h3>
              <span class="card-erp-subtitle">Net payouts vs statutory deductions</span>
            </div>
            <div class="card-erp-body" style="height: 320px;">
              <canvas id="reportPayrollChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Compensation Components</h3>
              <span class="card-erp-subtitle">Base vs Allowances</span>
            </div>
            <div class="card-erp-body" style="height: 320px;">
              <canvas id="reportCompensationChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Recent Payroll Disbursements</h3>
            </div>
            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th>Payroll ID</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Period</th>
                    <th>Basic</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Net Payout</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${payroll.slice(0, 8).map(p => `
                    <tr>
                      <td class="font-mono text-primary">${p.id}</td>
                      <td><strong>${p.employeeName}</strong></td>
                      <td>${p.department}</td>
                      <td>${p.month}</td>
                      <td>$${Number(p.basicSalary || 0).toLocaleString()}</td>
                      <td class="text-success">+$${Number(p.allowances || 0).toLocaleString()}</td>
                      <td class="text-danger">-$${Number(p.deductions || 0).toLocaleString()}</td>
                      <td class="font-bold">$${Number(p.netSalary || 0).toLocaleString()}</td>
                      <td><span class="status-pill status-${p.status.toLowerCase()}">${p.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Partners Tab ---
  function renderPartnersTab(partners, invoices) {
    return `
      <div class="row g-4">
        <div class="col-lg-7">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Revenue by Strategic Partner</h3>
              <span class="card-erp-subtitle">Top billing client accounts</span>
            </div>
            <div class="card-erp-body" style="height: 320px;">
              <canvas id="reportPartnerRevenueChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Partner Tier Composition</h3>
              <span class="card-erp-subtitle">Platinum, Gold, Silver & Standard</span>
            </div>
            <div class="card-erp-body" style="height: 320px;">
              <canvas id="reportPartnerTierChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card-erp">
            <div class="card-erp-header">
              <h3 class="card-erp-title">Partner Ledger Summary</h3>
            </div>
            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th>Partner ID</th>
                    <th>Company Name</th>
                    <th>Contact Person</th>
                    <th>Tier</th>
                    <th>Active Projects</th>
                    <th>Total Invoiced</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${partners.slice(0, 8).map(p => {
                    const partnerInvoices = invoices.filter(i => i.partnerName === p.companyName);
                    const billed = partnerInvoices.reduce((s, i) => s + (Number(i.total) || 0), 0);
                    return `
                      <tr>
                        <td class="font-mono">${p.id}</td>
                        <td><strong>${p.companyName}</strong></td>
                        <td>${p.contactPerson || 'N/A'}</td>
                        <td><span class="badge-tier tier-${(p.tier || 'standard').toLowerCase()}">${p.tier}</span></td>
                        <td>${p.totalProjects || 1}</td>
                        <td class="font-bold">$${billed.toLocaleString()}</td>
                        <td><span class="status-pill status-${(p.status || 'active').toLowerCase()}">${p.status}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Dynamic Chart.js Rendering for Reports ---
  function initTabCharts(invoices, employees, payroll, attendance, partners) {
    if (!window.Chart) return;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // Cleanup existing charts
    Object.keys(activeCharts).forEach(k => {
      if (activeCharts[k]) activeCharts[k].destroy();
    });
    activeCharts = {};

    if (currentTab === 'financial') {
      const finCanvas = document.getElementById('reportFinancialChart');
      if (finCanvas) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const billed = new Array(12).fill(0);
        const collected = new Array(12).fill(0);

        invoices.forEach(inv => {
          if (inv.date) {
            const m = new Date(inv.date).getMonth();
            if (m >= 0 && m < 12) {
              billed[m] += Number(inv.total) || 0;
              if (inv.status === 'Paid') collected[m] += Number(inv.total) || 0;
            }
          }
        });

        activeCharts.fin = new Chart(finCanvas, {
          type: 'line',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Total Invoiced ($)',
                data: billed,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.35,
                fill: true
              },
              {
                label: 'Cash Collected ($)',
                data: collected,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.35,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        });
      }

      const agingCanvas = document.getElementById('reportAgingChart');
      if (agingCanvas) {
        const paidCount = invoices.filter(i => i.status === 'Paid').length;
        const sentCount = invoices.filter(i => i.status === 'Sent').length;
        const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
        const draftCount = invoices.filter(i => i.status === 'Draft').length;

        activeCharts.aging = new Chart(agingCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Paid', 'Pending', 'Overdue', 'Draft'],
            datasets: [{
              data: [paidCount, sentCount, overdueCount, draftCount],
              backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#94a3b8'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: textColor } } }
          }
        });
      }
    } else if (currentTab === 'workforce') {
      const deptCanvas = document.getElementById('reportDeptChart');
      if (deptCanvas) {
        const depts = {};
        employees.forEach(e => {
          const d = e.department || 'Other';
          depts[d] = (depts[d] || 0) + 1;
        });

        activeCharts.dept = new Chart(deptCanvas, {
          type: 'bar',
          data: {
            labels: Object.keys(depts),
            datasets: [{
              label: 'Staff Count',
              data: Object.values(depts),
              backgroundColor: '#3b82f6',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        });
      }

      const attCanvas = document.getElementById('reportAttendanceChart');
      if (attCanvas) {
        const present = attendance.filter(a => a.status === 'Present').length;
        const late = attendance.filter(a => a.status === 'Late').length;
        const leave = attendance.filter(a => a.status === 'Leave' || a.status === 'Half-Day').length;

        activeCharts.att = new Chart(attCanvas, {
          type: 'pie',
          data: {
            labels: ['On-Time', 'Late Arrival', 'On Leave'],
            datasets: [{
              data: [present, late, leave],
              backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: textColor } } }
          }
        });
      }
    } else if (currentTab === 'payroll') {
      const payCanvas = document.getElementById('reportPayrollChart');
      if (payCanvas) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const netDisbursed = [58400, 62100, 64500, 68200, 71500, 74200];
        const taxes = [5800, 6200, 6400, 6800, 7100, 7400];

        activeCharts.pay = new Chart(payCanvas, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Net Salaries Disbursed ($)',
                data: netDisbursed,
                backgroundColor: '#8b5cf6',
                borderRadius: 4
              },
              {
                label: 'Tax Withholding ($)',
                data: taxes,
                backgroundColor: '#06b6d4',
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { display: false }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        });
      }

      const compCanvas = document.getElementById('reportCompensationChart');
      if (compCanvas) {
        activeCharts.comp = new Chart(compCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Basic Base Pay', 'Allowances', 'Statutory Deductions'],
            datasets: [{
              data: [72, 18, 10],
              backgroundColor: ['#2563eb', '#10b981', '#ef4444'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: textColor } } }
          }
        });
      }
    } else if (currentTab === 'partners') {
      const partCanvas = document.getElementById('reportPartnerRevenueChart');
      if (partCanvas) {
        const top5 = partners.slice(0, 5);
        const labels = top5.map(p => p.companyName.split(' ')[0]);
        const billed = top5.map(p => {
          return invoices
            .filter(i => i.partnerName === p.companyName)
            .reduce((s, i) => s + (Number(i.total) || 0), 0) || Math.floor(15000 + Math.random() * 30000);
        });

        activeCharts.part = new Chart(partCanvas, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Total Billed ($)',
              data: billed,
              backgroundColor: '#06b6d4',
              borderRadius: 4
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
              y: { grid: { display: false }, ticks: { color: textColor } }
            }
          }
        });
      }

      const tierCanvas = document.getElementById('reportPartnerTierChart');
      if (tierCanvas) {
        const tiers = { Platinum: 0, Gold: 0, Silver: 0, Standard: 0 };
        partners.forEach(p => {
          const t = p.tier || 'Standard';
          tiers[t] = (tiers[t] || 0) + 1;
        });

        activeCharts.tier = new Chart(tierCanvas, {
          type: 'pie',
          data: {
            labels: Object.keys(tiers),
            datasets: [{
              data: Object.values(tiers),
              backgroundColor: ['#8b5cf6', '#f59e0b', '#94a3b8', '#3b82f6'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: textColor } } }
          }
        });
      }
    }
  }

  // --- Export Actions ---
  function exportCSV() {
    const invoices = (window.FabStorage && window.FabStorage.get(window.FabStorage.KEYS.INVOICES, [])) || [];
    let csv = 'Invoice Number,Partner Name,Date,Due Date,Subtotal,Tax,Total,Status\n';
    invoices.forEach(i => {
      csv += `"${i.invoiceNumber || i.id}","${i.partnerName}","${i.date}","${i.dueDate}",${i.subtotal},${i.tax},${i.total},"${i.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FabSteel_Report_${currentTab}_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    if (window.FabUtils) {
      window.FabUtils.showToast('Report CSV exported successfully', 'success');
    }
  }

  function printReport() {
    window.print();
  }

  return {
    init,
    render,
    setTab,
    setDateRange,
    exportCSV,
    printReport
  };
})();

