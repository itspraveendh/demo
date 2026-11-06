/**
 * FAB STEEL CONSULTANCY ERP - SALARY MANAGEMENT MODULE
 * Compensation structures, live net salary formula calculations, official payslip generation, PDF/Print
 */

window.FabSalaryModule = (function () {
  'use strict';

  let searchQuery = '';
  let deptFilter = 'all';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const salaryList = FabStorage.get(FabStorage.KEYS.SALARY, []) || [];
    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];
    const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

    const totalBasic = salaryList.reduce((sum, s) => sum + (Number(s.basicSalary) || 0), 0);
    const totalNet = salaryList.reduce((sum, s) => sum + (Number(s.netSalary) || 0), 0);
    const totalDeductions = salaryList.reduce((sum, s) => sum + (Number(s.deductions) || 0) + (Number(s.otherDeductions) || 0), 0);

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Salary Structures & Compensation Engineering</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Define baseline pay scales, HRA, certified overtime tariffs, and statutory withholding calculations.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabSalaryModule.exportSalaryCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabSalaryModule.openAddModal()">
            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> + Create Salary Structure
          </button>
        </div>
      </div>

      <!-- Salary KPI Overview -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Configured Structures</div>
            <div class="kpi-value">${salaryList.length}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Active salary grades</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Monthly Basic Pool</div>
            <div class="kpi-value">${FabUtils.formatCurrency(totalBasic)}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Base salary allocation</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Total Monthly Net</div>
            <div class="kpi-value" style="color: var(--success);">${FabUtils.formatCurrency(totalNet)}</div>
            <div style="font-size: 0.72rem; color: var(--success);">Net payable commitment</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Total Withholding</div>
            <div class="kpi-value" style="color: var(--warning);">${FabUtils.formatCurrency(totalDeductions)}</div>
            <div style="font-size: 0.72rem; color: var(--warning);">Tax / PF deductions</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-6">
            <div style="position: relative;">
              <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
              <input type="text" class="form-control-erp" placeholder="Search by employee name or ID..." style="padding-left: 36px;" value="${FabUtils.escapeHtml(searchQuery)}" oninput="window.FabSalaryModule.handleSearch(this.value)">
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-control-erp form-select-erp" onchange="window.FabSalaryModule.handleDeptFilter(this.value)">
              <option value="all">All Departments</option>
              ${departments.map(d => `<option value="${FabUtils.escapeHtml(d)}" ${deptFilter === d ? 'selected' : ''}>${FabUtils.escapeHtml(d)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabSalaryModule.resetFilters()">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Salary Structures Table -->
      <div class="card-trading">
        <div id="salaryTableWrapper">
          ${renderTableContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredSalary() {
    let list = FabStorage.get(FabStorage.KEYS.SALARY, []) || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        (s.employeeName && s.employeeName.toLowerCase().includes(q)) ||
        (s.employeeId && s.employeeId.toLowerCase().includes(q))
      );
    }

    if (deptFilter !== 'all') {
      list = list.filter(s => s.department === deptFilter);
    }

    return list;
  }

  function renderTableContent() {
    const list = getFilteredSalary();

    if (list.length === 0) {
      return `
        <div style="padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
          No salary structures matching your filter.
        </div>
      `;
    }

    return `
      <div class="table-responsive-wrapper">
        <table class="table-erp">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Basic ($)</th>
              <th>HRA ($)</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(s => `
              <tr>
                <td class="font-mono" style="font-weight: 700; color: var(--primary);">
                  ${s.employeeId}
                </td>
                <td style="font-weight: 700;">
                  ${FabUtils.escapeHtml(s.employeeName)}
                  <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">${FabUtils.escapeHtml(s.designation)}</div>
                </td>
                <td>
                  <span class="badge-status" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); font-size: 0.72rem;">
                    ${FabUtils.escapeHtml(s.department)}
                  </span>
                </td>
                <td class="font-mono">${FabUtils.formatCurrency(s.basicSalary)}</td>
                <td class="font-mono">${FabUtils.formatCurrency(s.hra)}</td>
                <td class="font-mono">${FabUtils.formatCurrency((Number(s.allowances) || 0) + (Number(s.bonus) || 0) + (Number(s.overtime) || 0))}</td>
                <td class="font-mono" style="color: var(--danger);">- ${FabUtils.formatCurrency((Number(s.deductions) || 0) + (Number(s.otherDeductions) || 0))}</td>
                <td class="font-mono" style="font-weight: 800; color: var(--success); font-size: 0.95rem;">
                  ${FabUtils.formatCurrency(s.netSalary)}
                </td>
                <td style="text-align: right;">
                  <button type="button" class="btn-erp btn-erp-primary btn-erp-sm" onclick="window.FabSalaryModule.viewSalarySlip('${s.employeeId}')" title="Generate / Print Official Pay Slip">
                    <i data-lucide="receipt" style="width: 14px; height: 14px;"></i> Pay Slip
                  </button>
                  <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabSalaryModule.openEditModal('${s.id}')" title="Edit Structure">
                    <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                  </button>
                  <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm text-danger" onclick="window.FabSalaryModule.deleteStructure('${s.id}')" title="Delete">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function handleSearch(val) {
    searchQuery = val;
    const w = document.getElementById('salaryTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function handleDeptFilter(val) {
    deptFilter = val;
    const w = document.getElementById('salaryTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function resetFilters() {
    searchQuery = '';
    deptFilter = 'all';
    render();
  }

  // =========================================================================
  // VIEW & PRINT OFFICIAL SALARY SLIP MODAL
  // =========================================================================
  function viewSalarySlip(empId) {
    const salaryList = FabStorage.get(FabStorage.KEYS.SALARY, []) || [];
    let s = salaryList.find(item => item.employeeId === empId);
    if (!s && salaryList.length > 0) s = salaryList[0];
    if (!s) return;

    const existing = document.getElementById('salarySlipModal');
    if (existing) existing.remove();

    const company = FabStorage.get(FabStorage.KEYS.SETTINGS, {}) || {};

    const grossEarnings = Number(s.basicSalary) + Number(s.hra) + Number(s.allowances) + Number(s.bonus) + Number(s.overtime);
    const totalDeductions = Number(s.deductions) + Number(s.advance) + Number(s.otherDeductions);

    const modalHtml = `
      <div id="salarySlipModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg" style="background-color: var(--bg-surface);">
          <div class="modal-header-erp no-print">
            <h3 class="modal-title-erp">
              <i data-lucide="receipt" style="color: var(--primary);"></i>
              Salary Slip &middot; ${FabUtils.escapeHtml(s.employeeName)} (${s.employeeId})
            </h3>
            <div style="display: flex; gap: 0.65rem;">
              <button type="button" class="btn-erp btn-erp-secondary btn-erp-sm" onclick="window.print()">
                <i data-lucide="printer" style="width: 14px; height: 14px;"></i> Print
              </button>
              <button type="button" class="btn-erp btn-erp-primary btn-erp-sm" onclick="window.FabUtils.downloadPDF('printableSalarySlipSheet', 'SalarySlip-${s.employeeId}')">
                <i data-lucide="download" style="width: 14px; height: 14px;"></i> Download PDF
              </button>
              <button class="modal-close-btn" onclick="document.getElementById('salarySlipModal').remove()">&times;</button>
            </div>
          </div>
          <div class="modal-body-erp" style="background-color: #ffffff; color: #0f172a; padding: 2.5rem;" id="printableSalarySlipSheet">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
              <h2 style="font-size: 1.45rem; font-weight: 800; color: #1e3a8a; margin: 0;">Fab Steel Consultancy</h2>
              <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Global Structural Engineering & Detailing Operations</div>
              <div style="font-size: 0.75rem; color: #475569; margin-top: 4px;">Suite 1800, Steel Tower, 500 Enterprise Way, Houston TX 77002 &middot; Tax ID: ${company.gstin || 'US-TX-88392019-STEEL'}</div>
              <div style="display: inline-block; background-color: #f1f5f9; padding: 4px 16px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; color: #1e293b; margin-top: 10px;">
                CONFIDENTIAL PAYSLIP &middot; OCTOBER 2026
              </div>
            </div>

            <!-- Employee Info Matrix -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; font-size: 0.825rem;">
              <div class="row">
                <div class="col-6" style="line-height: 1.8;">
                  <div>Employee Name: <strong>${FabUtils.escapeHtml(s.employeeName)}</strong></div>
                  <div>Employee ID: <strong style="font-family: monospace;">${s.employeeId}</strong></div>
                  <div>Department: <strong>${FabUtils.escapeHtml(s.department)}</strong></div>
                  <div>Designation: <strong>${FabUtils.escapeHtml(s.designation)}</strong></div>
                </div>
                <div class="col-6" style="line-height: 1.8; text-align: right;">
                  <div>Bank Name: <strong>${FabUtils.escapeHtml(s.bankName || 'Standard Chartered')}</strong></div>
                  <div>Account No: <strong style="font-family: monospace;">${FabUtils.escapeHtml(s.accountNumber || '**** **** 9912')}</strong></div>
                  <div>PAN / Tax Identifier: <strong style="font-family: monospace;">${FabUtils.escapeHtml(s.panNumber || 'FABST9920L')}</strong></div>
                  <div>Payment Mode: <strong>Direct Bank Credit</strong></div>
                </div>
              </div>
            </div>

            <!-- Earnings vs Deductions Table -->
            <div class="row g-3 mb-4" style="font-size: 0.85rem;">
              <div class="col-6">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
                  <thead>
                    <tr style="background: #1e293b; color: #ffffff;">
                      <th style="padding: 8px 12px; text-align: left;">Earnings Components</th>
                      <th style="padding: 8px 12px; text-align: right;">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px;">Basic Salary</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(s.basicSalary)}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px;">House Rent Allowance (HRA)</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(s.hra)}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px;">Special Engineering Allowance</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(s.allowances)}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px;">Performance Bonus</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(s.bonus)}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px;">Overtime Compensation</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(s.overtime)}</td></tr>
                    <tr style="background: #f1f5f9; font-weight: 700;"><td style="padding: 8px 12px;">Total Gross Earnings</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(grossEarnings)}</td></tr>
                  </tbody>
                </table>
              </div>

              <div class="col-6">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
                  <thead>
                    <tr style="background: #1e293b; color: #ffffff;">
                      <th style="padding: 8px 12px; text-align: left;">Deductions & Withholdings</th>
                      <th style="padding: 8px 12px; text-align: right;">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px;">Provident Fund / 401(k)</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(s.deductions)}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px;">Salary Advance Recoveries</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(s.advance || 0)}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px;">Professional Tax & Health Plan</td><td style="padding: 8px 12px; text-align: right; font-family: monospace;">${FabUtils.formatCurrency(s.otherDeductions)}</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; color: #94a3b8;">—</td><td style="padding: 8px 12px; text-align: right; color: #94a3b8;">$0.00</td></tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; color: #94a3b8;">—</td><td style="padding: 8px 12px; text-align: right; color: #94a3b8;">$0.00</td></tr>
                    <tr style="background: #f1f5f9; font-weight: 700;"><td style="padding: 8px 12px;">Total Deductions</td><td style="padding: 8px 12px; text-align: right; font-family: monospace; color: #dc2626;">- ${FabUtils.formatCurrency(totalDeductions)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Net Payable Banner -->
            <div style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: #166534; text-transform: uppercase;">Net Disbursed Take-Home Pay</div>
                <div style="font-size: 0.75rem; color: #15803d;">Gross Earnings minus Authorized Statutory Deductions</div>
              </div>
              <div style="font-size: 1.75rem; font-weight: 900; font-family: monospace; color: #15803d;">
                ${FabUtils.formatCurrency(s.netSalary)}
              </div>
            </div>

            <!-- Footer & Signatures -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 1.5rem; border-top: 1px dashed #cbd5e1; font-size: 0.75rem; color: #64748b;">
              <div>This is a system-generated advice requiring no physical signature.</div>
              <div style="text-align: right;">
                <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 1.4rem; color: #1e3a8a;">Marcus Sterling</div>
                <div style="border-top: 1px solid #94a3b8; width: 140px; text-align: center; margin-top: 4px;">Head of Payroll</div>
              </div>
            </div>
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
    const s = FabStorage.findById(FabStorage.KEYS.SALARY, id);
    if (s) openFormModal(s);
  }

  function openFormModal(salary = null) {
    const existing = document.getElementById('salaryFormModal');
    if (existing) existing.remove();

    const isEdit = !!salary;
    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];

    const defaultBasic = isEdit ? salary.basicSalary : 6000;
    const defaultHra = isEdit ? salary.hra : Math.round(defaultBasic * 0.30);
    const defaultAllowances = isEdit ? salary.allowances : Math.round(defaultBasic * 0.15);
    const defaultBonus = isEdit ? salary.bonus : Math.round(defaultBasic * 0.05);
    const defaultOvertime = isEdit ? salary.overtime : 200;
    const defaultDeductions = isEdit ? salary.deductions : Math.round(defaultBasic * 0.10);
    const defaultAdvance = isEdit ? salary.advance : 0;
    const defaultOther = isEdit ? salary.otherDeductions : 50;

    const modalHtml = `
      <div id="salaryFormModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="${isEdit ? 'edit-3' : 'plus-circle'}" style="color: var(--primary);"></i>
              ${isEdit ? 'Modify Salary Structure' : 'Create Salary Structure'}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('salaryFormModal').remove()">&times;</button>
          </div>
          <form id="salaryForm" onsubmit="window.FabSalaryModule.handleFormSubmit(event, ${isEdit ? `'${salary.id}'` : 'null'})">
            <div class="modal-body-erp">
              <div class="row g-3 mb-3">
                <div class="col-md-8">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Select Employee <span class="required">*</span></label>
                    <select name="employeeId" class="form-control-erp form-select-erp" onchange="window.FabSalaryModule.onEmployeeSelect(this.value)" ${isEdit ? 'disabled' : ''} required>
                      <option value="">-- Choose Employee --</option>
                      ${employees.map(e => `
                        <option value="${e.id}" ${isEdit && salary.employeeId === e.id ? 'selected' : ''}>${FabUtils.escapeHtml(e.name)} (${e.id}) &middot; ${FabUtils.escapeHtml(e.department)}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Effective Date</label>
                    <input type="date" name="effectiveDate" class="form-control-erp" value="${isEdit ? salary.effectiveDate : new Date().toISOString().split('T')[0]}">
                  </div>
                </div>
              </div>

              <!-- Earnings Elements -->
              <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--success); margin-bottom: 0.75rem; text-transform: uppercase;">
                Earnings Breakdown (+)
              </h4>
              <div class="row g-2 mb-3">
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Basic Salary ($) <span class="required">*</span></label>
                    <input type="number" id="salBasic" name="basicSalary" class="form-control-erp font-mono" value="${defaultBasic}" min="0" oninput="window.FabSalaryModule.calcNetFormula()" required>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">HRA ($)</label>
                    <input type="number" id="salHra" name="hra" class="form-control-erp font-mono" value="${defaultHra}" min="0" oninput="window.FabSalaryModule.calcNetFormula()">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Allowances ($)</label>
                    <input type="number" id="salAllowances" name="allowances" class="form-control-erp font-mono" value="${defaultAllowances}" min="0" oninput="window.FabSalaryModule.calcNetFormula()">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Bonus ($)</label>
                    <input type="number" id="salBonus" name="bonus" class="form-control-erp font-mono" value="${defaultBonus}" min="0" oninput="window.FabSalaryModule.calcNetFormula()">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Overtime Pay ($)</label>
                    <input type="number" id="salOvertime" name="overtime" class="form-control-erp font-mono" value="${defaultOvertime}" min="0" oninput="window.FabSalaryModule.calcNetFormula()">
                  </div>
                </div>
              </div>

              <!-- Deductions Elements -->
              <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--danger); margin-bottom: 0.75rem; text-transform: uppercase;">
                Deductions & Withholdings (-)
              </h4>
              <div class="row g-2 mb-3">
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">PF / Tax Deductions ($)</label>
                    <input type="number" id="salDeductions" name="deductions" class="form-control-erp font-mono" value="${defaultDeductions}" min="0" oninput="window.FabSalaryModule.calcNetFormula()">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Advance Repayment ($)</label>
                    <input type="number" id="salAdvance" name="advance" class="form-control-erp font-mono" value="${defaultAdvance}" min="0" oninput="window.FabSalaryModule.calcNetFormula()">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Other Deductions ($)</label>
                    <input type="number" id="salOther" name="otherDeductions" class="form-control-erp font-mono" value="${defaultOther}" min="0" oninput="window.FabSalaryModule.calcNetFormula()">
                  </div>
                </div>
              </div>

              <!-- Live Formula Calculation Banner -->
              <div style="background-color: var(--bg-surface-elevated); border: 2px solid var(--border-glow); border-radius: var(--radius-md); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Calculated Net Salary:</div>
                  <div style="font-size: 0.72rem; color: var(--text-secondary); font-family: monospace;">Basic + HRA + Allowances + Bonus + OT - Deductions - Advance - Other</div>
                </div>
                <div id="liveNetSalaryDisplay" class="font-mono" style="font-size: 1.75rem; font-weight: 800; color: var(--success);">$0.00</div>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('salaryFormModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">Save Structure</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();

    calcNetFormula();
  }

  function calcNetFormula() {
    const basic = parseFloat(document.getElementById('salBasic')?.value) || 0;
    const hra = parseFloat(document.getElementById('salHra')?.value) || 0;
    const allowances = parseFloat(document.getElementById('salAllowances')?.value) || 0;
    const bonus = parseFloat(document.getElementById('salBonus')?.value) || 0;
    const overtime = parseFloat(document.getElementById('salOvertime')?.value) || 0;

    const deductions = parseFloat(document.getElementById('salDeductions')?.value) || 0;
    const advance = parseFloat(document.getElementById('salAdvance')?.value) || 0;
    const other = parseFloat(document.getElementById('salOther')?.value) || 0;

    const net = (basic + hra + allowances + bonus + overtime) - (deductions + advance + other);

    const display = document.getElementById('liveNetSalaryDisplay');
    if (display) display.innerText = FabUtils.formatCurrency(net);
    return net;
  }

  function onEmployeeSelect(empId) {
    const emp = FabStorage.findById(FabStorage.KEYS.EMPLOYEES, empId);
    if (!emp) return;

    const basic = emp.basicSalary || 5000;
    document.getElementById('salBasic').value = basic;
    document.getElementById('salHra').value = Math.round(basic * 0.30);
    document.getElementById('salAllowances').value = Math.round(basic * 0.15);
    document.getElementById('salBonus').value = Math.round(basic * 0.05);
    document.getElementById('salOvertime').value = 200;
    document.getElementById('salDeductions').value = Math.round(basic * 0.10);
    document.getElementById('salAdvance').value = 0;
    document.getElementById('salOther').value = 50;

    calcNetFormula();
  }

  function handleFormSubmit(event, editId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const empId = formData.get('employeeId') || (editId ? FabStorage.findById(FabStorage.KEYS.SALARY, editId).employeeId : 'EMP-1001');
    const emp = FabStorage.findById(FabStorage.KEYS.EMPLOYEES, empId);

    const net = calcNetFormula();

    const data = {
      id: editId || `SAL-${empId}`,
      employeeId: empId,
      employeeName: emp ? emp.name : 'Employee',
      department: emp ? emp.department : 'Engineering',
      designation: emp ? emp.designation : 'Staff',
      basicSalary: parseFloat(formData.get('basicSalary')) || 0,
      hra: parseFloat(formData.get('hra')) || 0,
      allowances: parseFloat(formData.get('allowances')) || 0,
      bonus: parseFloat(formData.get('bonus')) || 0,
      overtime: parseFloat(formData.get('overtime')) || 0,
      deductions: parseFloat(formData.get('deductions')) || 0,
      advance: parseFloat(formData.get('advance')) || 0,
      otherDeductions: parseFloat(formData.get('otherDeductions')) || 0,
      netSalary: net,
      effectiveDate: formData.get('effectiveDate'),
      bankName: 'Standard Chartered Bank',
      accountNumber: '**** **** 9912',
      panNumber: 'FABST9920L'
    };

    if (editId) {
      FabStorage.update(FabStorage.KEYS.SALARY, editId, data, 'Salary Management', `Updated salary structure for ${data.employeeName}`);
      FabUtils.showToast(`Updated salary structure for ${data.employeeName}`, 'success');
    } else {
      FabStorage.add(FabStorage.KEYS.SALARY, data, 'Salary Management', `Created salary structure for ${data.employeeName}`);
      FabUtils.showToast(`Created salary structure for ${data.employeeName}`, 'success');
    }

    document.getElementById('salaryFormModal').remove();
    render();
  }

  function deleteStructure(id) {
    if (confirm('Are you sure you want to delete this salary structure?')) {
      FabStorage.delete(FabStorage.KEYS.SALARY, id, 'Salary Management', `Deleted salary structure ${id}`);
      FabUtils.showToast('Salary structure removed', 'danger');
      render();
    }
  }

  function exportSalaryCSV() {
    const list = getFilteredSalary();
    const headers = {
      employeeId: 'Employee ID',
      employeeName: 'Employee Name',
      department: 'Department',
      basicSalary: 'Basic',
      hra: 'HRA',
      allowances: 'Allowances',
      bonus: 'Bonus',
      overtime: 'Overtime',
      deductions: 'Deductions',
      netSalary: 'Net Salary',
      effectiveDate: 'Effective Date'
    };
    FabUtils.exportToCSV(`fab-steel-salary-structures-${new Date().toISOString().split('T')[0]}`, list, headers);
  }

  return {
    render,
    handleSearch,
    handleDeptFilter,
    resetFilters,
    viewSalarySlip,
    openAddModal,
    openEditModal,
    calcNetFormula,
    onEmployeeSelect,
    handleFormSubmit,
    deleteStructure,
    exportSalaryCSV
  };
})();

