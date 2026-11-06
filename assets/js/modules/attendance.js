/**
 * FAB STEEL CONSULTANCY ERP - ATTENDANCE MANAGEMENT MODULE
 * Daily workforce tracking, quick status toggling, date & employee filters, calendar view, CSV export
 */

window.FabAttendanceModule = (function () {
  'use strict';

  let currentView = 'list'; // 'list' or 'calendar'
  let dateFilter = 'all';
  let deptFilter = 'all';
  let empFilter = 'all';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];
    const attendance = FabStorage.get(FabStorage.KEYS.ATTENDANCE, []) || [];

    // Calculate metrics
    const totalWorkforce = employees.length;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let leaveCount = 0;

    attendance.forEach(a => {
      const s = (a.status || '').toLowerCase();
      if (s === 'present') presentCount++;
      else if (s === 'absent') absentCount++;
      else if (s === 'late') lateCount++;
      else if (s.includes('leave') || s === 'half-day') leaveCount++;
    });

    const totalLogs = attendance.length || 1;
    const attendancePercentage = (((presentCount + lateCount) / totalLogs) * 100).toFixed(1);

    const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Workforce Attendance & Site Timecards</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Track fabrication floor check-ins, field erection logs, and safety toolbox roll calls.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="display: flex; background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 2px;">
            <button type="button" class="btn-erp btn-erp-sm ${currentView === 'list' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabAttendanceModule.setView('list')">
              <i data-lucide="list" style="width: 14px; height: 14px;"></i> List
            </button>
            <button type="button" class="btn-erp btn-erp-sm ${currentView === 'calendar' ? 'btn-erp-primary' : 'btn-erp-ghost'}" onclick="window.FabAttendanceModule.setView('calendar')">
              <i data-lucide="calendar" style="width: 14px; height: 14px;"></i> Calendar
            </button>
          </div>
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabAttendanceModule.exportAttendanceCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabAttendanceModule.openAddModal()">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> + Log Attendance
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-2 col-6">
          <div class="card-trading">
            <div class="kpi-title">Workforce</div>
            <div class="kpi-value">${totalWorkforce}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Active staff</div>
          </div>
        </div>
        <div class="col-md-2 col-6">
          <div class="card-trading">
            <div class="kpi-title">Present</div>
            <div class="kpi-value" style="color: var(--success);">${presentCount}</div>
            <div style="font-size: 0.72rem; color: var(--success);">On duty</div>
          </div>
        </div>
        <div class="col-md-2 col-6">
          <div class="card-trading">
            <div class="kpi-title">Absent</div>
            <div class="kpi-value" style="color: var(--danger);">${absentCount}</div>
            <div style="font-size: 0.72rem; color: var(--danger);">Unexcused</div>
          </div>
        </div>
        <div class="col-md-2 col-6">
          <div class="card-trading">
            <div class="kpi-title">Late Arrivals</div>
            <div class="kpi-value" style="color: var(--warning);">${lateCount}</div>
            <div style="font-size: 0.72rem; color: var(--warning);">Grace period</div>
          </div>
        </div>
        <div class="col-md-2 col-6">
          <div class="card-trading">
            <div class="kpi-title">On Leave</div>
            <div class="kpi-value" style="color: var(--secondary);">${leaveCount}</div>
            <div style="font-size: 0.72rem; color: var(--secondary);">Approved</div>
          </div>
        </div>
        <div class="col-md-2 col-6">
          <div class="card-trading">
            <div class="kpi-title">Compliance</div>
            <div class="kpi-value" style="color: var(--primary);">${attendancePercentage}%</div>
            <div style="font-size: 0.72rem; color: var(--primary);">Avg adherence</div>
          </div>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-3">
            <input type="date" class="form-control-erp" id="attDateFilter" onchange="window.FabAttendanceModule.filterDate(this.value)">
          </div>
          <div class="col-md-3">
            <select class="form-control-erp form-select-erp" id="attDeptFilter" onchange="window.FabAttendanceModule.filterDept(this.value)">
              <option value="all">All Departments</option>
              ${departments.map(d => `<option value="${FabUtils.escapeHtml(d)}">${FabUtils.escapeHtml(d)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-control-erp form-select-erp" id="attEmpFilter" onchange="window.FabAttendanceModule.filterEmp(this.value)">
              <option value="all">All Employees</option>
              ${employees.map(e => `<option value="${e.id}">${FabUtils.escapeHtml(e.name)} (${e.id})</option>`).join('')}
            </select>
          </div>
          <div class="col-md-3 text-end">
            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabAttendanceModule.resetFilters()">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Content Area: List Table or Monthly Calendar -->
      <div class="card-trading">
        <div id="attendanceContainer">
          ${currentView === 'list' ? renderListTable() : renderCalendarView()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredAttendance() {
    let list = FabStorage.get(FabStorage.KEYS.ATTENDANCE, []) || [];
    if (dateFilter !== 'all' && dateFilter) {
      list = list.filter(a => a.date === dateFilter);
    }
    if (deptFilter !== 'all') {
      list = list.filter(a => a.department === deptFilter);
    }
    if (empFilter !== 'all') {
      list = list.filter(a => a.employeeId === empFilter);
    }
    return list;
  }

  function renderListTable() {
    const list = getFilteredAttendance();

    if (list.length === 0) {
      return `
        <div style="padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
          No attendance records match the selected date or filters.
        </div>
      `;
    }

    return `
      <div class="table-responsive-wrapper">
        <table class="table-erp">
          <thead>
            <tr>
              <th>Date</th>
              <th>Emp ID</th>
              <th>Employee Name</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Hours</th>
              <th>Site Location</th>
              <th>Status</th>
              <th>Quick Mark</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(att => `
              <tr>
                <td class="font-mono" style="color: var(--text-muted); font-size: 0.8rem;">
                  ${FabUtils.formatDate(att.date)}
                </td>
                <td class="font-mono" style="font-weight: 700; color: var(--primary);">
                  ${att.employeeId}
                </td>
                <td style="font-weight: 600;">
                  ${FabUtils.escapeHtml(att.employeeName)}
                </td>
                <td class="font-mono" style="font-size: 0.825rem;">
                  ${att.checkIn}
                </td>
                <td class="font-mono" style="font-size: 0.825rem;">
                  ${att.checkOut}
                </td>
                <td class="font-mono" style="font-weight: 700;">
                  ${att.workingHours || 8} hrs
                </td>
                <td style="color: var(--secondary); font-size: 0.8rem;">
                  ${FabUtils.escapeHtml(att.site || 'Main Engineering Center')}
                </td>
                <td>
                  <span class="badge-status badge-${(att.status || '').toLowerCase() === 'present' ? 'present' : ((att.status || '').toLowerCase() === 'late' ? 'late' : ((att.status || '').toLowerCase() === 'absent' ? 'absent' : 'leave'))}">
                    <span class="badge-status-dot"></span>
                    ${att.status}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 3px;">
                    <button type="button" class="btn-erp btn-erp-sm btn-erp-success" style="padding: 2px 6px; font-size: 0.7rem;" onclick="window.FabAttendanceModule.updateStatus('${att.id}', 'Present')">P</button>
                    <button type="button" class="btn-erp btn-erp-sm btn-erp-danger" style="padding: 2px 6px; font-size: 0.7rem;" onclick="window.FabAttendanceModule.updateStatus('${att.id}', 'Absent')">A</button>
                    <button type="button" class="btn-erp btn-erp-sm btn-erp-secondary" style="padding: 2px 6px; font-size: 0.7rem;" onclick="window.FabAttendanceModule.updateStatus('${att.id}', 'Late')">L</button>
                  </div>
                </td>
                <td style="text-align: right;">
                  <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabAttendanceModule.openEditModal('${att.id}')">
                    <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                  </button>
                  <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" style="color: var(--danger);" onclick="window.FabAttendanceModule.deleteAttendance('${att.id}')">
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

  // Monthly Calendar Matrix View
  function renderCalendarView() {
    const list = FabStorage.get(FabStorage.KEYS.ATTENDANCE, []) || [];
    const daysInMonth = 30; // November
    const sampleDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []).slice(0, 15);

    return `
      <div style="padding: 0.5rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="font-size: 1rem; font-weight: 700;">November 2026 Shift Matrix</h3>
          <div style="display: flex; gap: 1rem; font-size: 0.75rem;">
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 2px; background: var(--success);"></span> Present</span>
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 2px; background: var(--warning);"></span> Late</span>
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 2px; background: var(--danger);"></span> Absent</span>
            <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 2px; background: var(--secondary);"></span> Leave</span>
          </div>
        </div>

        <div class="table-responsive-wrapper">
          <table class="table-erp" style="text-align: center; font-size: 0.72rem;">
            <thead>
              <tr>
                <th style="text-align: left; min-width: 160px;">Employee</th>
                ${sampleDays.map(d => `<th style="padding: 4px 6px; min-width: 24px;">${d}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${employees.map((emp, idx) => `
                <tr>
                  <td style="text-align: left; font-weight: 600;">
                    ${FabUtils.escapeHtml(emp.name)}
                  </td>
                  ${sampleDays.map(d => {
                    let bg = 'rgba(16, 185, 129, 0.2)';
                    let symbol = 'P';
                    let col = 'var(--success)';
                    if (d % 7 === 0 || d % 7 === 6) {
                      bg = 'rgba(148, 163, 184, 0.1)';
                      symbol = '—';
                      col = 'var(--text-muted)';
                    } else if (idx === 1 && d === 5) {
                      bg = 'rgba(245, 158, 11, 0.2)';
                      symbol = 'L';
                      col = 'var(--warning)';
                    } else if (idx === 2 && d === 6) {
                      bg = 'rgba(239, 68, 68, 0.2)';
                      symbol = 'A';
                      col = 'var(--danger)';
                    }
                    return `<td style="background-color: ${bg}; color: ${col}; font-weight: 700; padding: 4px 0;">${symbol}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function setView(view) {
    currentView = view;
    render();
  }

  function filterDate(val) {
    dateFilter = val;
    render();
  }

  function filterDept(val) {
    deptFilter = val;
    render();
  }

  function filterEmp(val) {
    empFilter = val;
    render();
  }

  function resetFilters() {
    dateFilter = 'all';
    deptFilter = 'all';
    empFilter = 'all';
    render();
  }

  function updateStatus(id, newStatus) {
    FabStorage.update(FabStorage.KEYS.ATTENDANCE, id, { status: newStatus }, 'Attendance', `Updated attendance status to ${newStatus} for record ${id}`);
    FabUtils.showToast(`Marked as ${newStatus}`, 'success');
    render();
  }

  function quickMark(empId, status) {
    const emp = FabStorage.findById(FabStorage.KEYS.EMPLOYEES, empId);
    if (!emp) return;

    const today = new Date().toISOString().split('T')[0];
    const list = FabStorage.get(FabStorage.KEYS.ATTENDANCE, []) || [];
    const existing = list.find(a => a.employeeId === empId && a.date === today);

    if (existing) {
      existing.status = status;
      FabStorage.set(FabStorage.KEYS.ATTENDANCE, list);
    } else {
      const record = {
        id: `ATT-${Date.now().toString().slice(-4)}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        date: today,
        checkIn: status === 'Present' ? '08:45' : '—',
        checkOut: status === 'Present' ? '17:30' : '—',
        workingHours: status === 'Present' ? 8.0 : 0,
        status: status,
        site: emp.assignedSite,
        notes: 'Quick marked by Supervisor'
      };
      FabStorage.add(FabStorage.KEYS.ATTENDANCE, record);
    }
    FabUtils.showToast(`Marked ${emp.name} as ${status}`, 'success');
    render();
  }

  function openAddModal() {
    openFormModal();
  }

  function openEditModal(id) {
    const att = FabStorage.findById(FabStorage.KEYS.ATTENDANCE, id);
    if (att) openFormModal(att);
  }

  function openFormModal(record = null) {
    const existing = document.getElementById('attFormModal');
    if (existing) existing.remove();

    const isEdit = !!record;
    const employees = FabStorage.get(FabStorage.KEYS.EMPLOYEES, []) || [];

    const modalHtml = `
      <div id="attFormModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="${isEdit ? 'edit-3' : 'plus-circle'}" style="color: var(--primary);"></i>
              ${isEdit ? 'Modify Attendance Record' : 'Record Shift Attendance'}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('attFormModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabAttendanceModule.handleFormSubmit(event, ${isEdit ? `'${record.id}'` : 'null'})">
            <div class="modal-body-erp">
              <div class="row g-3">
                <div class="col-12">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Select Employee <span class="required">*</span></label>
                    <select name="employeeId" class="form-control-erp form-select-erp" required ${isEdit ? 'disabled' : ''}>
                      ${employees.map(e => `
                        <option value="${e.id}" ${isEdit && record.employeeId === e.id ? 'selected' : ''}>${FabUtils.escapeHtml(e.name)} (${e.id}) &middot; ${FabUtils.escapeHtml(e.department)}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Date <span class="required">*</span></label>
                    <input type="date" name="date" class="form-control-erp" value="${isEdit ? record.date : new Date().toISOString().split('T')[0]}" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Attendance Status</label>
                    <select name="status" class="form-control-erp form-select-erp">
                      <option value="Present" ${isEdit && record.status === 'Present' ? 'selected' : ''}>Present</option>
                      <option value="Late" ${isEdit && record.status === 'Late' ? 'selected' : ''}>Late</option>
                      <option value="Half-day" ${isEdit && record.status === 'Half-day' ? 'selected' : ''}>Half-day</option>
                      <option value="On Leave" ${isEdit && record.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                      <option value="Absent" ${isEdit && record.status === 'Absent' ? 'selected' : ''}>Absent</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Check-in Time</label>
                    <input type="time" name="checkIn" class="form-control-erp" value="${isEdit ? (record.checkIn === '—' ? '09:00' : record.checkIn) : '08:55'}">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Check-out Time</label>
                    <input type="time" name="checkOut" class="form-control-erp" value="${isEdit ? (record.checkOut === '—' ? '17:30' : record.checkOut) : '17:30'}">
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Total Hours</label>
                    <input type="number" step="0.5" name="workingHours" class="form-control-erp font-mono" value="${isEdit ? record.workingHours : 8.5}">
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Site / Center Location</label>
                    <select name="site" class="form-control-erp form-select-erp">
                      <option value="Main Engineering Center" ${isEdit && record.site === 'Main Engineering Center' ? 'selected' : ''}>Main Engineering Center</option>
                      <option value="Apex Industrial Plant - Site A" ${isEdit && record.site === 'Apex Industrial Plant - Site A' ? 'selected' : ''}>Apex Industrial Plant - Site A</option>
                      <option value="Global Headquarters - Tower 1" ${isEdit && record.site === 'Global Headquarters - Tower 1' ? 'selected' : ''}>Global Headquarters - Tower 1</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('attFormModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">Save Entry</button>
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

    const empId = formData.get('employeeId') || (editId ? FabStorage.findById(FabStorage.KEYS.ATTENDANCE, editId).employeeId : 'EMP-1001');
    const emp = FabStorage.findById(FabStorage.KEYS.EMPLOYEES, empId);

    const data = {
      employeeId: empId,
      employeeName: emp ? emp.name : 'Staff Member',
      department: emp ? emp.department : 'Engineering',
      date: formData.get('date'),
      checkIn: formData.get('checkIn') || '09:00',
      checkOut: formData.get('checkOut') || '17:30',
      workingHours: Number(formData.get('workingHours')) || 8.0,
      status: formData.get('status'),
      site: formData.get('site'),
      notes: 'Logged via Attendance System'
    };

    if (editId) {
      FabStorage.update(FabStorage.KEYS.ATTENDANCE, editId, data, 'Attendance', `Updated attendance record ${editId} for ${data.employeeName}`);
      FabUtils.showToast('Attendance updated', 'success');
    } else {
      FabStorage.add(FabStorage.KEYS.ATTENDANCE, data, 'Attendance', `Logged attendance for ${data.employeeName} on ${data.date}`);
      FabUtils.showToast('Attendance recorded', 'success');
    }

    document.getElementById('attFormModal').remove();
    render();
  }

  function deleteAttendance(id) {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      FabStorage.delete(FabStorage.KEYS.ATTENDANCE, id, 'Attendance', `Deleted attendance record ${id}`);
      FabUtils.showToast('Attendance record deleted', 'danger');
      render();
    }
  }

  function exportAttendanceCSV() {
    const list = getFilteredAttendance();
    const headers = {
      date: 'Date',
      employeeId: 'Employee ID',
      employeeName: 'Employee Name',
      department: 'Department',
      checkIn: 'Check-In',
      checkOut: 'Check-Out',
      workingHours: 'Working Hours',
      status: 'Status',
      site: 'Site Location'
    };
    FabUtils.exportToCSV(`fab-steel-attendance-${new Date().toISOString().split('T')[0]}`, list, headers);
  }

  return {
    render,
    setView,
    filterDate,
    filterDept,
    filterEmp,
    resetFilters,
    updateStatus,
    quickMark,
    openAddModal,
    openEditModal,
    handleFormSubmit,
    deleteAttendance,
    exportAttendanceCSV
  };
})();

