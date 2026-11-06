/**
 * FAB STEEL CONSULTANCY ERP - ACTIVITY LOGS & AUDIT TRAIL MODULE
 * Immutable enterprise operational audit trail, search, user/module filters, and CSV export
 */

window.FabLogsModule = (function () {
  'use strict';

  let searchQuery = '';
  let moduleFilter = 'all';
  let userFilter = 'all';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const logs = FabStorage.get(FabStorage.KEYS.LOGS, []) || [];
    const users = Array.from(new Set(logs.map(l => l.user).filter(Boolean)));
    const modules = Array.from(new Set(logs.map(l => l.module).filter(Boolean)));

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Enterprise System Audit & Activity Logs</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Real-time compliance record of all ERP user operations, billing dispatches, and credential modifications.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabLogsModule.exportLogsCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          <button type="button" class="btn-erp btn-erp-ghost text-danger" onclick="window.FabLogsModule.clearLogs()">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i> Clear Logs
          </button>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-5">
            <div style="position: relative;">
              <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
              <input type="text" class="form-control-erp" placeholder="Search audit trail by description or ID..." style="padding-left: 36px;" value="${FabUtils.escapeHtml(searchQuery)}" oninput="window.FabLogsModule.handleSearch(this.value)">
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-control-erp form-select-erp" onchange="window.FabLogsModule.handleModuleFilter(this.value)">
              <option value="all">All Modules</option>
              ${modules.map(m => `<option value="${FabUtils.escapeHtml(m)}" ${moduleFilter === m ? 'selected' : ''}>${FabUtils.escapeHtml(m)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-control-erp form-select-erp" onchange="window.FabLogsModule.handleUserFilter(this.value)">
              <option value="all">All Users</option>
              ${users.map(u => `<option value="${FabUtils.escapeHtml(u)}" ${userFilter === u ? 'selected' : ''}>${FabUtils.escapeHtml(u)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabLogsModule.resetFilters()">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="card-trading">
        <div id="logsTableWrapper">
          ${renderTableContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredLogs() {
    let list = FabStorage.get(FabStorage.KEYS.LOGS, []) || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(l =>
        (l.id && l.id.toLowerCase().includes(q)) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.user && l.user.toLowerCase().includes(q))
      );
    }

    if (moduleFilter !== 'all') {
      list = list.filter(l => l.module === moduleFilter);
    }

    if (userFilter !== 'all') {
      list = list.filter(l => l.user === userFilter);
    }

    return list;
  }

  function renderTableContent() {
    const list = getFilteredLogs();

    if (list.length === 0) {
      return `
        <div style="padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
          No audit records found matching your query.
        </div>
      `;
    }

    return `
      <div class="table-responsive-wrapper">
        <table class="table-erp">
          <thead>
            <tr>
              <th>Log Ref</th>
              <th>Action Type</th>
              <th>Target Module</th>
              <th>Description / Payload</th>
              <th>Operator</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(l => {
              let actionBadge = 'badge-draft';
              if (l.action === 'CREATE' || l.action === 'LOGIN') actionBadge = 'badge-active';
              if (l.action === 'UPDATE') actionBadge = 'badge-late';
              if (l.action === 'DELETE' || l.action === 'LOGOUT') actionBadge = 'badge-inactive';

              return `
                <tr>
                  <td class="font-mono" style="font-weight: 700; color: var(--primary); font-size: 0.8rem;">
                    ${l.id}
                  </td>
                  <td>
                    <span class="badge-status ${actionBadge}" style="font-size: 0.68rem;">
                      ${l.action}
                    </span>
                  </td>
                  <td style="font-weight: 600; color: var(--secondary); font-size: 0.825rem;">
                    ${FabUtils.escapeHtml(l.module)}
                  </td>
                  <td style="font-size: 0.825rem; color: var(--text-primary);">
                    ${FabUtils.escapeHtml(l.description)}
                  </td>
                  <td>
                    <div style="font-weight: 700; font-size: 0.8rem;">${FabUtils.escapeHtml(l.user)}</div>
                    <div style="font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-mono);">${FabUtils.escapeHtml(l.role)}</div>
                  </td>
                  <td class="font-mono" style="color: var(--text-muted); font-size: 0.775rem;">
                    ${l.date} ${l.time || ''}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function handleSearch(val) {
    searchQuery = val;
    const w = document.getElementById('logsTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function handleModuleFilter(val) {
    moduleFilter = val;
    const w = document.getElementById('logsTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function handleUserFilter(val) {
    userFilter = val;
    const w = document.getElementById('logsTableWrapper');
    if (w) {
      w.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function resetFilters() {
    searchQuery = '';
    moduleFilter = 'all';
    userFilter = 'all';
    render();
  }

  function clearLogs() {
    if (confirm('Clear audit activity logs from local storage? This action is logged.')) {
      FabStorage.set(FabStorage.KEYS.LOGS, []);
      FabStorage.logActivity('DELETE', 'Activity Logs', 'Audit logs flushed by user request');
      FabUtils.showToast('Audit trail cleared', 'info');
      render();
    }
  }

  function exportLogsCSV() {
    const list = getFilteredLogs();
    const headers = {
      id: 'Log ID',
      user: 'User',
      role: 'Role',
      action: 'Action',
      module: 'Module',
      date: 'Date',
      time: 'Time',
      description: 'Audit Description'
    };
    FabUtils.exportToCSV(`fab-steel-audit-logs-${new Date().toISOString().split('T')[0]}`, list, headers);
  }

  return {
    render,
    handleSearch,
    handleModuleFilter,
    handleUserFilter,
    resetFilters,
    clearLogs,
    exportLogsCSV
  };
})();

