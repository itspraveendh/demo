/**
 * FAB STEEL CONSULTANCY ERP - EMPLOYEE MANAGEMENT MODULE
 * Full CRUD, search, department & status filters, column sorting, pagination, profile view modal, CSV export
 */

window.FabEmployeesModule = (function () {
  'use strict';

  let currentPage = 1;
  const pageSize = 8;
  let currentSort = { column: 'id', direction: 'asc' };
  let currentFilter = { search: '', department: 'all', status: 'all' };

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = FabAuth.getCurrentUser();
    const canCreate = FabPermissions.canPerformAction(user ? user.role : '', 'create', 'employees');

    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];
    
    // Extract unique departments for filter dropdown
    const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Engineering & Corporate Personnel</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Manage structural detailers, connection PEs, certified welding inspectors, and field staff.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabEmployeesModule.exportEmployeesCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          ${canCreate ? `
            <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabEmployeesModule.openAddModal()">
              <i data-lucide="user-plus" style="width: 16px; height: 16px;"></i> + Add Employee
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-5">
            <div style="position: relative;">
              <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
              <input type="text" id="empSearchInput" class="form-control-erp" placeholder="Search by ID, name, designation, or email..." style="padding-left: 36px;" value="${FabUtils.escapeHtml(currentFilter.search)}" oninput="window.FabEmployeesModule.handleSearch(this.value)">
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-control-erp form-select-erp" id="empDeptFilter" onchange="window.FabEmployeesModule.handleDeptFilter(this.value)">
              <option value="all">All Departments</option>
              ${departments.map(d => `<option value="${FabUtils.escapeHtml(d)}" ${currentFilter.department === d ? 'selected' : ''}>${FabUtils.escapeHtml(d)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-control-erp form-select-erp" id="empStatusFilter" onchange="window.FabEmployeesModule.handleStatusFilter(this.value)">
              <option value="all">All Statuses</option>
              <option value="Active" ${currentFilter.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="On Leave" ${currentFilter.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
              <option value="Inactive" ${currentFilter.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabEmployeesModule.resetFilters()">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="card-trading">
        <div id="employeesTableWrapper">
          ${renderTableContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredData() {
    let list = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];

    // Search filter
    if (currentFilter.search) {
      const q = currentFilter.search.toLowerCase().trim();
      list = list.filter(e =>
        (e.id && e.id.toLowerCase().includes(q)) ||
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.designation && e.designation.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q))
      );
    }

    // Dept filter
    if (currentFilter.department !== 'all') {
      list = list.filter(e => e.department === currentFilter.department);
    }

    // Status filter
    if (currentFilter.status !== 'all') {
      list = list.filter(e => (e.status || '').toLowerCase() === currentFilter.status.toLowerCase());
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[currentSort.column] || '';
      let valB = b[currentSort.column] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }

  function renderTableContent() {
    const list = getFilteredData();
    const totalRecords = list.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * pageSize;
    const paginatedList = list.slice(startIdx, startIdx + pageSize);

    const user = FabAuth.getCurrentUser();
    const canEdit = FabPermissions.canPerformAction(user ? user.role : '', 'update', 'employees');
    const canDelete = FabPermissions.canPerformAction(user ? user.role : '', 'delete', 'employees');

    if (totalRecords === 0) {
      return `
        <div style="padding: 3.5rem 1rem; text-align: center;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--bg-surface-elevated); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: var(--text-muted);">
            <i data-lucide="user-x" style="width: 28px; height: 28px;"></i>
          </div>
          <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">No employees found</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 360px; margin: 0 auto 1.25rem;">
            No personnel match your search criteria. Try modifying your filters or add a new team member.
          </p>
          <button type="button" class="btn-erp btn-erp-secondary btn-erp-sm" onclick="window.FabEmployeesModule.resetFilters()">
            Clear Filters
          </button>
        </div>
      `;
    }

    return `
      <div class="table-responsive-wrapper">
        <table class="table-erp">
          <thead>
            <tr>
              <th class="sortable" onclick="window.FabEmployeesModule.handleSort('id')">
                Employee ID ${getSortIcon('id')}
              </th>
              <th class="sortable" onclick="window.FabEmployeesModule.handleSort('name')">
                Name & Trade ${getSortIcon('name')}
              </th>
              <th class="sortable" onclick="window.FabEmployeesModule.handleSort('department')">
                Department ${getSortIcon('department')}
              </th>
              <th class="sortable" onclick="window.FabEmployeesModule.handleSort('assignedSite')">
                Assigned Site ${getSortIcon('assignedSite')}
              </th>
              <th class="sortable" onclick="window.FabEmployeesModule.handleSort('joiningDate')">
                Joined ${getSortIcon('joiningDate')}
              </th>
              <th>Basic Salary</th>
              <th class="sortable" onclick="window.FabEmployeesModule.handleSort('status')">
                Status ${getSortIcon('status')}
              </th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedList.map(emp => `
              <tr>
                <td class="font-mono" style="font-weight: 700; color: var(--primary);">
                  ${emp.id}
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-medium);" alt="${emp.name}">
                    <div>
                      <div style="font-weight: 700; color: var(--text-primary);">${FabUtils.escapeHtml(emp.name)}</div>
                      <div style="font-size: 0.725rem; color: var(--text-secondary);">${FabUtils.escapeHtml(emp.designation)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge-status" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 0.72rem;">
                    ${FabUtils.escapeHtml(emp.department)}
                  </span>
                </td>
                <td style="color: var(--secondary); font-size: 0.8rem; font-weight: 500;">
                  ${FabUtils.escapeHtml(emp.assignedSite || 'Main Engineering Center')}
                </td>
                <td style="color: var(--text-muted); font-size: 0.8rem;">
                  ${FabUtils.formatDate(emp.joiningDate)}
                </td>
                <td class="font-mono" style="font-weight: 700;">
                  ${FabUtils.formatCurrency(emp.basicSalary)}
                </td>
                <td>
                  <span class="badge-status badge-${(emp.status || '').toLowerCase() === 'active' ? 'active' : ((emp.status || '').toLowerCase() === 'on leave' ? 'late' : 'inactive')}">
                    <span class="badge-status-dot"></span>
                    ${emp.status}
                  </span>
                </td>
                <td style="text-align: right;">
                  <div style="display: inline-flex; align-items: center; gap: 0.35rem;">
                    <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabEmployeesModule.viewProfile('${emp.id}')" title="Inspect Profile">
                      <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                    </button>
                    ${canEdit ? `
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabEmployeesModule.openEditModal('${emp.id}')" title="Edit Employee">
                        <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                      </button>
                    ` : ''}
                    ${canDelete ? `
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" style="color: var(--danger);" onclick="window.FabEmployeesModule.deleteEmployee('${emp.id}')" title="Archive / Delete">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-erp">
        <div>
          Showing <strong>${startIdx + 1}</strong> to <strong>${Math.min(startIdx + pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> personnel
        </div>
        <div class="pagination-pages">
          <button type="button" class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="window.FabEmployeesModule.goToPage(${currentPage - 1})">
            &lt;
          </button>
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
            <button type="button" class="page-btn ${p === currentPage ? 'active' : ''}" onclick="window.FabEmployeesModule.goToPage(${p})">
              ${p}
            </button>
          `).join('')}
          <button type="button" class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="window.FabEmployeesModule.goToPage(${currentPage + 1})">
            &gt;
          </button>
        </div>
      </div>
    `;
  }

  function getSortIcon(col) {
    if (currentSort.column !== col) return '';
    return currentSort.direction === 'asc' ? '▲' : '▼';
  }

  function handleSort(col) {
    if (currentSort.column === col) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = col;
      currentSort.direction = 'asc';
    }
    refreshTable();
  }

  function handleSearch(val) {
    currentFilter.search = val;
    currentPage = 1;
    refreshTable();
  }

  function handleDeptFilter(val) {
    currentFilter.department = val;
    currentPage = 1;
    refreshTable();
  }

  function handleStatusFilter(val) {
    currentFilter.status = val;
    currentPage = 1;
    refreshTable();
  }

  function resetFilters() {
    currentFilter = { search: '', department: 'all', status: 'all' };
    currentPage = 1;
    const sInput = document.getElementById('empSearchInput');
    if (sInput) sInput.value = '';
    const dFilter = document.getElementById('empDeptFilter');
    if (dFilter) dFilter.value = 'all';
    const stFilter = document.getElementById('empStatusFilter');
    if (stFilter) stFilter.value = 'all';
    refreshTable();
  }

  function goToPage(page) {
    currentPage = page;
    refreshTable();
  }

  function refreshTable() {
    const wrapper = document.getElementById('employeesTableWrapper');
    if (wrapper) {
      wrapper.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // =========================================================================
  // VIEW PROFILE MODAL
  // =========================================================================
  function viewProfile(id) {
    const emp = FabStorage.findById(FabStorage.KEYS.EMPLOYEES, id);
    if (!emp) return;

    const existing = document.getElementById('employeeProfileModal');
    if (existing) existing.remove();

    const attendance = FabStorage.get(FabStorage.KEYS.ATTENDANCE, []).filter(a => a.employeeId === id);
    const salary = FabStorage.get(FabStorage.KEYS.SALARY, []).find(s => s.employeeId === id);

    const modalHtml = `
      <div id="employeeProfileModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="user-check" style="color: var(--primary);"></i>
              Employee Dossier &middot; ${FabUtils.escapeHtml(emp.name)}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('employeeProfileModal').remove()">&times;</button>
          </div>
          <div class="modal-body-erp">
            <div style="display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap;">
              <img src="${emp.avatar}" style="width: 90px; height: 90px; border-radius: var(--radius-lg); object-fit: cover; border: 2px solid var(--primary); box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);" alt="${emp.name}">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.25rem;">${FabUtils.escapeHtml(emp.name)}</h2>
                  <span class="badge-status badge-active">${emp.status}</span>
                </div>
                <div style="color: var(--secondary); font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem;">${FabUtils.escapeHtml(emp.designation)}</div>
                <div style="display: flex; gap: 1rem; font-size: 0.775rem; color: var(--text-muted); flex-wrap: wrap;">
                  <span><strong>ID:</strong> <code class="font-mono" style="color: var(--primary);">${emp.id}</code></span>
                  <span><strong>Department:</strong> ${FabUtils.escapeHtml(emp.department)}</span>
                  <span><strong>Site:</strong> ${FabUtils.escapeHtml(emp.assignedSite)}</span>
                  <span><strong>Joined:</strong> ${FabUtils.formatDate(emp.joiningDate)}</span>
                </div>
              </div>
            </div>

            <!-- Tabbed information panels -->
            <div class="row g-3">
              <div class="col-md-6">
                <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); height: 100%;">
                  <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                    Contact & Personal Info
                  </h4>
                  <div style="font-size: 0.8rem; line-height: 1.8; color: var(--text-secondary);">
                    <div><strong>Email:</strong> ${FabUtils.escapeHtml(emp.email)}</div>
                    <div><strong>Phone:</strong> ${FabUtils.escapeHtml(emp.phone)}</div>
                    <div><strong>Address:</strong> ${FabUtils.escapeHtml(emp.address || 'Houston Engineering Hub')}</div>
                    <div><strong>Emergency Contact:</strong> ${FabUtils.escapeHtml(emp.emergencyContact || 'Family Member')}</div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); height: 100%;">
                  <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                    Compensation Structure
                  </h4>
                  <div style="font-size: 0.8rem; line-height: 1.8; color: var(--text-secondary);">
                    <div><strong>Base Pay:</strong> ${FabUtils.formatCurrency(emp.basicSalary)} / month</div>
                    <div><strong>Net Monthly:</strong> <span class="font-mono" style="color: var(--success); font-weight: 700;">${FabUtils.formatCurrency(salary ? salary.netSalary : emp.basicSalary * 1.35)}</span></div>
                    <div><strong>Bank Reference:</strong> ${salary ? salary.bankName : 'Standard Chartered'}</div>
                    <div><strong>Tax/PAN:</strong> ${salary ? salary.panNumber : 'FABST8829L'}</div>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                    Certified Credentials & Documents
                  </h4>
                  <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
                    ${(emp.documents && emp.documents.length) ? emp.documents.map(doc => `
                      <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.75rem; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-subtle); font-size: 0.75rem;">
                        <i data-lucide="file-check" style="width: 14px; height: 14px; color: var(--success);"></i>
                        ${FabUtils.escapeHtml(doc)}
                      </div>
                    `).join('') : '<span style="color: var(--text-muted); font-size: 0.75rem;">No documents attached.</span>'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer-erp">
            <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('employeeProfileModal').remove()">Close</button>
            <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabSalaryModule.viewSalarySlip('${emp.id}')">
              <i data-lucide="receipt" style="width: 14px; height: 14px;"></i> View Salary Slip
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // ADD / EDIT EMPLOYEE MODAL
  // =========================================================================
  function openAddModal() {
    openFormModal();
  }

  function openEditModal(id) {
    const emp = FabStorage.findById(FabStorage.KEYS.EMPLOYEES, id);
    if (emp) openFormModal(emp);
  }

  function openFormModal(employee = null) {
    const existing = document.getElementById('employeeFormModal');
    if (existing) existing.remove();

    const isEdit = !!employee;
    const autoId = isEdit ? employee.id : FabUtils.generateId('EMP');

    const modalHtml = `
      <div id="employeeFormModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-lg">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="${isEdit ? 'edit-3' : 'user-plus'}" style="color: var(--primary);"></i>
              ${isEdit ? 'Modify Employee Profile' : 'Register New Personnel'}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('employeeFormModal').remove()">&times;</button>
          </div>
          <form id="employeeForm" onsubmit="window.FabEmployeesModule.handleFormSubmit(event, ${isEdit ? `'${employee.id}'` : 'null'})">
            <div class="modal-body-erp">
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Employee ID</label>
                    <input type="text" name="id" class="form-control-erp font-mono" value="${autoId}" readonly style="background-color: var(--bg-surface-hover);">
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Full Name <span class="required">*</span></label>
                    <input type="text" name="name" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(employee.name) : ''}" placeholder="e.g. Elena Rostova" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Email Address <span class="required">*</span></label>
                    <input type="email" name="email" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(employee.email) : ''}" placeholder="user@fabsteel.demo" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Phone Number <span class="required">*</span></label>
                    <input type="text" name="phone" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(employee.phone) : ''}" placeholder="+1 (555) 000-0000" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Department <span class="required">*</span></label>
                    <select name="department" class="form-control-erp form-select-erp" required>
                      <option value="Tekla & BIM Detailing" ${isEdit && employee.department === 'Tekla & BIM Detailing' ? 'selected' : ''}>Tekla & BIM Detailing</option>
                      <option value="Structural Engineering" ${isEdit && employee.department === 'Structural Engineering' ? 'selected' : ''}>Structural Engineering</option>
                      <option value="Field Operations" ${isEdit && employee.department === 'Field Operations' ? 'selected' : ''}>Field Operations</option>
                      <option value="Quality Assurance & QC" ${isEdit && employee.department === 'Quality Assurance & QC' ? 'selected' : ''}>Quality Assurance & QC</option>
                      <option value="Project Management" ${isEdit && employee.department === 'Project Management' ? 'selected' : ''}>Project Management</option>
                      <option value="Human Resources" ${isEdit && employee.department === 'Human Resources' ? 'selected' : ''}>Human Resources</option>
                      <option value="Finance & Accounts" ${isEdit && employee.department === 'Finance & Accounts' ? 'selected' : ''}>Finance & Accounts</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Designation / Title <span class="required">*</span></label>
                    <input type="text" name="designation" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(employee.designation) : ''}" placeholder="e.g. Lead Tekla Modeler" required>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Joining Date <span class="required">*</span></label>
                    <input type="date" name="joiningDate" class="form-control-erp" value="${isEdit ? employee.joiningDate : new Date().toISOString().split('T')[0]}" required>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Monthly Basic Salary ($) <span class="required">*</span></label>
                    <input type="number" name="basicSalary" class="form-control-erp font-mono" value="${isEdit ? employee.basicSalary : 6000}" min="1000" step="100" required>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Status</label>
                    <select name="status" class="form-control-erp form-select-erp">
                      <option value="Active" ${isEdit && employee.status === 'Active' ? 'selected' : ''}>Active</option>
                      <option value="On Leave" ${isEdit && employee.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                      <option value="Inactive" ${isEdit && employee.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Assigned Site</label>
                    <select name="assignedSite" class="form-control-erp form-select-erp">
                      <option value="Main Engineering Center" ${isEdit && employee.assignedSite === 'Main Engineering Center' ? 'selected' : ''}>Main Engineering Center</option>
                      <option value="Apex Industrial Plant - Site A" ${isEdit && employee.assignedSite === 'Apex Industrial Plant - Site A' ? 'selected' : ''}>Apex Industrial Plant - Site A</option>
                      <option value="Global Headquarters - Tower 1" ${isEdit && employee.assignedSite === 'Global Headquarters - Tower 1' ? 'selected' : ''}>Global Headquarters - Tower 1</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Profile Avatar URL</label>
                    <input type="url" name="avatar" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(employee.avatar) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" placeholder="https://...">
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Emergency Contact</label>
                    <input type="text" name="emergencyContact" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(empEmergency(employee)) : ''}" placeholder="Contact Name (+1 555-...)">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Residential Address</label>
                    <input type="text" name="address" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(employee.address || '') : ''}" placeholder="City, Street, Suite">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('employeeFormModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">
                <i data-lucide="check" style="width: 16px; height: 16px;"></i> ${isEdit ? 'Save Changes' : 'Create Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function empEmergency(e) {
    return e && e.emergencyContact ? e.emergencyContact : '';
  }

  function handleFormSubmit(event, editId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const data = {
      id: formData.get('id'),
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      department: formData.get('department'),
      designation: formData.get('designation').trim(),
      joiningDate: formData.get('joiningDate'),
      basicSalary: Number(formData.get('basicSalary')) || 5000,
      status: formData.get('status'),
      assignedSite: formData.get('assignedSite'),
      avatar: formData.get('avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      emergencyContact: formData.get('emergencyContact'),
      address: formData.get('address'),
      documents: ['Verified_Identification.pdf', 'Engineering_Credentials.pdf']
    };

    if (editId) {
      FabStorage.update(FabStorage.KEYS.EMPLOYEES, editId, data, 'Employees', `Updated profile of ${data.name} (${editId})`);
      FabUtils.showToast(`Updated employee ${data.name}`, 'success');
    } else {
      FabStorage.add(FabStorage.KEYS.EMPLOYEES, data, 'Employees', `Onboarded new personnel ${data.name} (${data.id})`);
      
      // Auto-create matching Salary Structure
      const basic = data.basicSalary;
      const salRecord = {
        id: `SAL-${data.id}`,
        employeeId: data.id,
        employeeName: data.name,
        department: data.department,
        designation: data.designation,
        basicSalary: basic,
        hra: Math.round(basic * 0.30),
        allowances: Math.round(basic * 0.15),
        bonus: Math.round(basic * 0.05),
        overtime: 200,
        deductions: Math.round(basic * 0.10),
        advance: 0,
        otherDeductions: 50,
        netSalary: Math.round(basic * 1.40) - 50,
        effectiveDate: data.joiningDate,
        bankName: 'Standard Chartered Bank',
        accountNumber: '**** **** 8821',
        panNumber: 'FABST9920L'
      };
      FabStorage.add(FabStorage.KEYS.SALARY, salRecord, 'Salary Management', `Created baseline salary structure for ${data.name}`);
      
      FabNotifications.addNotification('employee', 'New Employee Registered', `${data.name} joined as ${data.designation}`, '#employees');
      FabUtils.showToast(`Created employee ${data.name}`, 'success');
    }

    document.getElementById('employeeFormModal').remove();
    refreshTable();
  }

  // Delete employee with confirmation dialog
  function deleteEmployee(id) {
    const emp = FabStorage.findById(FabStorage.KEYS.EMPLOYEES, id);
    if (!emp) return;

    if (confirm(`Are you sure you want to remove employee ${emp.name} (${id}) from the active roster?`)) {
      FabStorage.delete(FabStorage.KEYS.EMPLOYEES, id, 'Employees', `Deleted employee ${emp.name} (${id})`);
      FabUtils.showToast(`Deleted employee ${emp.name}`, 'danger');
      refreshTable();
    }
  }

  // Export CSV
  function exportEmployeesCSV() {
    const list = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];
    const headers = {
      id: 'Employee ID',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      department: 'Department',
      designation: 'Designation',
      joiningDate: 'Joining Date',
      basicSalary: 'Basic Salary',
      status: 'Status',
      assignedSite: 'Assigned Site'
    };
    FabUtils.exportToCSV(`fab-steel-employees-${new Date().toISOString().split('T')[0]}`, list, headers);
  }

  return {
    render,
    handleSort,
    handleSearch,
    handleDeptFilter,
    handleStatusFilter,
    resetFilters,
    goToPage,
    viewProfile,
    openAddModal,
    openEditModal,
    handleFormSubmit,
    deleteEmployee,
    exportEmployeesCSV
  };
})();

