/**
 * FAB STEEL CONSULTANCY ERP - PAYROLL PROCESSING MODULE
 * Monthly payroll runs, batch generation from salary structures, duplicate prevention, payment reconciliation, reports
 */

window.FabPayrollModule = (function () {
  'use strict';

  let selectedMonth = 'October 2026';
  let statusFilter = 'all';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const allPayroll = FabStorage.get(FabStorage.KEYS.PAYROLL, []) || [];
    const currentBatch = allPayroll.filter(p => p.payrollMonth === selectedMonth);

    const totalCommitted = currentBatch.reduce((sum, p) => sum + (Number(p.netPayable) || 0), 0);
    const paidList = currentBatch.filter(p => (p.status || '').toLowerCase() === 'paid');
    const paidAmount = paidList.reduce((sum, p) => sum + (Number(p.netPayable) || 0), 0);
    const pendingList = currentBatch.filter(p => (p.status || '').toLowerCase() !== 'paid');
    const pendingAmount = pendingList.reduce((sum, p) => sum + (Number(p.netPayable) || 0), 0);

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Monthly Payroll Disbursement & Audit</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Execute workforce salary runs, reconcile bank wire UTR references, and export compliance reports.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabPayrollModule.exportPayrollCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabPayrollModule.generatePayrollBatch()">
            <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i> Generate ${FabUtils.escapeHtml(selectedMonth)} Run
          </button>
        </div>
      </div>

      <!-- Payroll Dashboard KPI Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Monthly Commitment</div>
            <div class="kpi-value">${FabUtils.formatCurrency(totalCommitted)}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${currentBatch.length} enrolled personnel</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Disbursed (Paid)</div>
            <div class="kpi-value" style="color: var(--success);">${FabUtils.formatCurrency(paidAmount)}</div>
            <div style="font-size: 0.72rem; color: var(--success);">${paidList.length} staff transferred</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Pending Authorization</div>
            <div class="kpi-value" style="color: var(--warning);">${FabUtils.formatCurrency(pendingAmount)}</div>
            <div style="font-size: 0.72rem; color: var(--warning);">${pendingList.length} staff queued</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Settlement Rate</div>
            <div class="kpi-value" style="color: var(--primary);">
              ${currentBatch.length > 0 ? ((paidList.length / currentBatch.length) * 100).toFixed(0) : 0}%
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">October processing</div>
          </div>
        </div>
      </div>

      <!-- Month Selector & Action Bar -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-4">
            <select class="form-control-erp form-select-erp" id="payrollMonthSelect" onchange="window.FabPayrollModule.onMonthChange(this.value)">
              <option value="October 2026" ${selectedMonth === 'October 2026' ? 'selected' : ''}>October 2026 (Active Run)</option>
              <option value="November 2026" ${selectedMonth === 'November 2026' ? 'selected' : ''}>November 2026 (Upcoming)</option>
              <option value="September 2026" ${selectedMonth === 'September 2026' ? 'selected' : ''}>September 2026 (Archived)</option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-control-erp form-select-erp" onchange="window.FabPayrollModule.onStatusFilter(this.value)">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All Payment Statuses</option>
              <option value="Paid" ${statusFilter === 'Paid' ? 'selected' : ''}>Disbursed (Paid)</option>
              <option value="Pending" ${statusFilter === 'Pending' ? 'selected' : ''}>Pending Authorization</option>
            </select>
          </div>
          <div class="col-md-4 text-end">
            <button type="button" class="btn-erp btn-erp-success btn-erp-sm" onclick="window.FabPayrollModule.markAllPaid()">
              <i data-lucide="check-check" style="width: 14px; height: 14px;"></i> Mark All Pending as Paid
            </button>
          </div>
        </div>
      </div>

      <!-- Payroll Run Table -->
      <div class="card-trading">
        <div id="payrollTableWrapper">
          ${renderTableContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredBatch() {
    let list = (FabStorage.get(FabStorage.KEYS.PAYROLL, []) || []).filter(p => p.payrollMonth === selectedMonth);

    if (statusFilter !== 'all') {
      list = list.filter(p => (p.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    return list;
  }

  function renderTableContent() {
    const list = getFilteredBatch();

    if (list.length === 0) {
      return `
        <div style="padding: 3.5rem 1rem; text-align: center; color: var(--text-muted);">
          No payroll entries found for <strong>${FabUtils.escapeHtml(selectedMonth)}</strong>.<br>
          <button type="button" class="btn-erp btn-erp-primary mt-3" onclick="window.FabPayrollModule.generatePayrollBatch()">
            Generate Payroll Batch from Salary Structures
          </button>
        </div>
      `;
    }

    return `
      <div class="table-responsive-wrapper">
        <table class="table-erp">
          <thead>
            <tr>
              <th>Payroll Ref</th>
              <th>Emp ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Basic ($)</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Payable</th>
              <th>Bank Ref / Date</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(p => `
              <tr>
                <td class="font-mono" style="font-weight: 700; color: var(--primary);">
                  ${p.id}
                </td>
                <td class="font-mono">${p.employeeId}</td>
                <td style="font-weight: 700;">
                  ${FabUtils.escapeHtml(p.employeeName)}
                </td>
                <td>
                  <span class="badge-status" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); font-size: 0.72rem;">
                    ${FabUtils.escapeHtml(p.department)}
                  </span>
                </td>
                <td class="font-mono">${FabUtils.formatCurrency(p.basicSalary)}</td>
                <td class="font-mono">${FabUtils.formatCurrency(p.allowances)}</td>
                <td class="font-mono" style="color: var(--danger);">- ${FabUtils.formatCurrency(p.deductions)}</td>
                <td class="font-mono" style="font-weight: 800; color: var(--success); font-size: 0.95rem;">
                  ${FabUtils.formatCurrency(p.netPayable)}
                </td>
                <td class="font-mono" style="font-size: 0.75rem;">
                  ${p.paymentReference ? `<div style="color: var(--text-primary); font-weight: 600;">${p.paymentReference}</div><div style="color: var(--text-muted);">${FabUtils.formatDate(p.paymentDate)}</div>` : '<span style="color: var(--text-muted);">Pending Wire</span>'}
                </td>
                <td>
                  <span class="badge-status badge-${(p.status || '').toLowerCase()}">
                    <span class="badge-status-dot"></span>
                    ${p.status}
                  </span>
                </td>
                <td style="text-align: right;">
                  <div style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    ${p.status !== 'Paid' ? `
                      <button type="button" class="btn-erp btn-erp-success btn-erp-sm" onclick="window.FabPayrollModule.markIndividualPaid('${p.id}')" title="Disburse Wire">
                        Pay
                      </button>
                    ` : `
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabSalaryModule.viewSalarySlip('${p.employeeId}')" title="Print Slip">
                        <i data-lucide="receipt" style="width: 14px; height: 14px;"></i>
                      </button>
                    `}
                    <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm text-danger" onclick="window.FabPayrollModule.deleteEntry('${p.id}')" title="Delete">
                      <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function onMonthChange(val) {
    selectedMonth = val;
    render();
  }

  function onStatusFilter(val) {
    statusFilter = val;
    const w = document.getElementById('payrollTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // Generate Batch from active Salary structures with duplicate check
  function generatePayrollBatch() {
    const allPayroll = FabStorage.get(FabStorage.KEYS.PAYROLL, []) || [];
    const existingForMonth = allPayroll.filter(p => p.payrollMonth === selectedMonth);

    if (existingForMonth.length > 0) {
      if (!confirm(`A payroll batch for ${selectedMonth} already exists (${existingForMonth.length} entries). Regenerate batch?`)) {
        return;
      }
    }

    const salaryList = FabStorage.get(FabStorage.KEYS.SALARY, []) || [];
    if (salaryList.length === 0) {
      FabUtils.showToast('No salary structures configured yet.', 'warning');
      return;
    }

    // Filter out previous entries for selectedMonth if replacing
    const remaining = allPayroll.filter(p => p.payrollMonth !== selectedMonth);

    const newEntries = salaryList.map((s, idx) => {
      return {
        id: `PR-${selectedMonth.split(' ')[0].slice(0, 3).toUpperCase()}-${String(idx + 1).padStart(3, '0')}`,
        payrollMonth: selectedMonth,
        employeeId: s.employeeId,
        employeeName: s.employeeName,
        department: s.department,
        basicSalary: s.basicSalary,
        allowances: (Number(s.hra) || 0) + (Number(s.allowances) || 0) + (Number(s.bonus) || 0) + (Number(s.overtime) || 0),
        deductions: (Number(s.deductions) || 0) + (Number(s.advance) || 0) + (Number(s.otherDeductions) || 0),
        netPayable: s.netSalary,
        status: 'Pending',
        paymentDate: null,
        paymentReference: null,
        paymentMethod: 'Direct Bank Wire (ACH/NEFT)',
        generatedDate: new Date().toISOString().split('T')[0]
      };
    });

    FabStorage.set(FabStorage.KEYS.PAYROLL, [...newEntries, ...remaining]);
    FabStorage.logActivity('CREATE', 'Payroll', `Generated payroll run for ${selectedMonth} (${newEntries.length} employees)`);
    FabNotifications.addNotification('payroll', `Payroll Generated: ${selectedMonth}`, `${newEntries.length} employee compensation records generated.`, '#payroll');
    FabUtils.showToast(`Generated ${newEntries.length} payroll records for ${selectedMonth}`, 'success');
    render();
  }

  // Mark single entry as Paid
  function markIndividualPaid(id) {
    const list = FabStorage.get(FabStorage.KEYS.PAYROLL, []) || [];
    const entry = list.find(p => p.id === id);
    if (!entry) return;

    const utr = `UTR-SCB-${Date.now().toString().slice(-6)}`;
    entry.status = 'Paid';
    entry.paymentDate = new Date().toISOString().split('T')[0];
    entry.paymentReference = utr;

    FabStorage.set(FabStorage.KEYS.PAYROLL, list);
    FabStorage.logActivity('UPDATE', 'Payroll', `Disbursed payroll ${id} to ${entry.employeeName} (${utr})`);
    FabUtils.showToast(`Paid ${entry.employeeName} (${utr})`, 'success');
    render();
  }

  // Mark All Pending in current month as Paid
  function markAllPaid() {
    const list = FabStorage.get(FabStorage.KEYS.PAYROLL, []) || [];
    let count = 0;
    const nowStr = new Date().toISOString().split('T')[0];

    list.forEach(p => {
      if (p.payrollMonth === selectedMonth && p.status !== 'Paid') {
        p.status = 'Paid';
        p.paymentDate = nowStr;
        p.paymentReference = `BATCH-ACH-${Date.now().toString().slice(-4)}${count + 1}`;
        count++;
      }
    });

    if (count === 0) {
      FabUtils.showToast('No pending payroll entries to disburse', 'info');
      return;
    }

    FabStorage.set(FabStorage.KEYS.PAYROLL, list);
    FabStorage.logActivity('UPDATE', 'Payroll', `Authorized batch disbursement for ${count} staff in ${selectedMonth}`);
    FabUtils.showToast(`Disbursed payroll to ${count} personnel`, 'success');
    render();
  }

  function deleteEntry(id) {
    if (confirm(`Remove payroll entry ${id}?`)) {
      FabStorage.delete(FabStorage.KEYS.PAYROLL, id, 'Payroll', `Deleted payroll entry ${id}`);
      FabUtils.showToast('Payroll entry deleted', 'danger');
      render();
    }
  }

  function exportPayrollCSV() {
    const list = getFilteredBatch();
    const headers = {
      id: 'Payroll ID',
      payrollMonth: 'Payroll Month',
      employeeId: 'Employee ID',
      employeeName: 'Employee Name',
      department: 'Department',
      basicSalary: 'Basic',
      allowances: 'Allowances',
      deductions: 'Deductions',
      netPayable: 'Net Payable',
      status: 'Status',
      paymentReference: 'Payment Ref',
      paymentDate: 'Payment Date'
    };
    FabUtils.exportToCSV(`fab-steel-payroll-${selectedMonth.replace(' ', '-')}`, list, headers);
  }

  return {
    render,
    onMonthChange,
    onStatusFilter,
    generatePayrollBatch,
    markIndividualPaid,
    markAllPaid,
    deleteEntry,
    exportPayrollCSV
  };
})();

