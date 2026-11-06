/**
 * FAB STEEL CONSULTANCY ERP - CENTRAL LOCALSTORAGE ENGINE
 * Robust, schema-safe data persistence with reactivity and audit logging
 */

window.FabStorage = (function () {
  'use strict';

  const STORAGE_PREFIX = 'fab_erp_';

  const KEYS = {
    USERS: `${STORAGE_PREFIX}users`,
    EMPLOYEES: `${STORAGE_PREFIX}employees`,
    PARTNERS: `${STORAGE_PREFIX}partners`,
    INVOICES: `${STORAGE_PREFIX}invoices`,
    ATTENDANCE: `${STORAGE_PREFIX}attendance`,
    SALARY: `${STORAGE_PREFIX}salary`,
    PAYROLL: `${STORAGE_PREFIX}payroll`,
    TEAM: `${STORAGE_PREFIX}team`,
    CONTACTS: `${STORAGE_PREFIX}contacts`,
    INQUIRIES: `${STORAGE_PREFIX}inquiries`,
    LOGS: `${STORAGE_PREFIX}logs`,
    NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
    SETTINGS: `${STORAGE_PREFIX}company_settings`,
    WEBSITE: `${STORAGE_PREFIX}website`,
    MAILER: `${STORAGE_PREFIX}mailer`,
    THEME: `${STORAGE_PREFIX}theme`,
    SESSION: `${STORAGE_PREFIX}session`
  };

  // Safe read from LocalStorage
  function get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.warn(`[FabStorage] Error reading key "${key}":`, err);
      return defaultValue;
    }
  }

  // Safe write to LocalStorage
  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      notifyChange(key, 'SET');
      return true;
    } catch (err) {
      console.error(`[FabStorage] Error writing key "${key}":`, err);
      return false;
    }
  }

  // Notify listeners across app of data changes
  function notifyChange(key, action, id = null) {
    const event = new CustomEvent('fab_storage_changed', {
      detail: { key, action, id, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
  }

  // Record an audit trail log
  function logActivity(action, module, description) {
    try {
      const logs = get(KEYS.LOGS, []) || [];
      const session = get(KEYS.SESSION, null) || { name: 'System Admin', role: 'SUPER_ADMIN' };
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0];

      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`,
        user: session.name || 'System User',
        role: session.role || 'SUPER_ADMIN',
        action: action.toUpperCase(),
        module: module,
        date: dateStr,
        time: timeStr,
        description: description
      };

      logs.unshift(newLog);
      // Keep recent 200 logs
      if (logs.length > 200) logs.pop();
      set(KEYS.LOGS, logs);
    } catch (err) {
      console.warn('Logging error:', err);
    }
  }

  // Collection CRUD Helpers
  function add(key, item, logModule = null, logDesc = null) {
    const list = get(key, []) || [];
    if (!item.id) {
      item.id = FabUtils.generateId(key.replace(STORAGE_PREFIX, '').slice(0, 3).toUpperCase());
    }
    item.createdAt = item.createdAt || new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    list.unshift(item);
    set(key, list);
    notifyChange(key, 'ADD', item.id);

    if (logModule && logDesc) {
      logActivity('CREATE', logModule, logDesc);
    }
    return item;
  }

  function update(key, id, changes, logModule = null, logDesc = null) {
    const list = get(key, []) || [];
    const index = list.findIndex(entry => String(entry.id) === String(id));
    if (index === -1) {
      console.warn(`[FabStorage] Record with id "${id}" not found in "${key}"`);
      return null;
    }

    const updatedItem = {
      ...list[index],
      ...changes,
      id: list[index].id, // protect id
      updatedAt: new Date().toISOString()
    };

    list[index] = updatedItem;
    set(key, list);
    notifyChange(key, 'UPDATE', id);

    if (logModule && logDesc) {
      logActivity('UPDATE', logModule, logDesc);
    }
    return updatedItem;
  }

  function deleteRecord(key, id, logModule = null, logDesc = null) {
    const list = get(key, []) || [];
    const initialLen = list.length;
    const filtered = list.filter(entry => String(entry.id) !== String(id));
    if (filtered.length === initialLen) {
      return false;
    }

    set(key, filtered);
    notifyChange(key, 'DELETE', id);

    if (logModule && logDesc) {
      logActivity('DELETE', logModule, logDesc);
    }
    return true;
  }

  function findById(key, id) {
    const list = get(key, []) || [];
    return list.find(entry => String(entry.id) === String(id)) || null;
  }

  // Backup & Restore
  function exportAll() {
    const backup = {
      exportDate: new Date().toISOString(),
      version: '2.4.0',
      system: 'Fab Steel Consultancy ERP',
      data: {}
    };

    for (const [name, key] of Object.entries(KEYS)) {
      if (key !== KEYS.SESSION) {
        backup.data[name] = get(key);
      }
    }

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fab-steel-erp-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logActivity('EXPORT', 'Data Management', 'Exported full ERP database JSON backup.');
  }

  function importAll(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) {
        throw new Error('Invalid backup file format: missing data container');
      }

      for (const [name, key] of Object.entries(KEYS)) {
        if (parsed.data[name] !== undefined && key !== KEYS.SESSION) {
          localStorage.setItem(key, JSON.stringify(parsed.data[name]));
        }
      }

      logActivity('IMPORT', 'Data Management', 'Restored ERP database from external JSON file.');
      notifyChange(KEYS.EMPLOYEES, 'RESTORE');
      return { success: true };
    } catch (err) {
      console.error('Import failed', err);
      return { success: false, error: err.message };
    }
  }

  // Initialize demo data if not already present
  function initDemoData(force = false) {
    if (!window.FabSeedData) {
      console.error('[FabStorage] FabSeedData engine is missing');
      return;
    }

    const isInitialized = localStorage.getItem(KEYS.EMPLOYEES);
    if (!isInitialized || force) {
      console.info('[FabStorage] Initializing fresh Fab Steel demo database...');
      localStorage.setItem(KEYS.USERS, JSON.stringify(FabSeedData.users));
      localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(FabSeedData.employees));
      localStorage.setItem(KEYS.PARTNERS, JSON.stringify(FabSeedData.partners));
      localStorage.setItem(KEYS.INVOICES, JSON.stringify(FabSeedData.invoices));
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(FabSeedData.attendance));
      localStorage.setItem(KEYS.SALARY, JSON.stringify(FabSeedData.salaryStructures));
      localStorage.setItem(KEYS.PAYROLL, JSON.stringify(FabSeedData.payrollRecords));
      localStorage.setItem(KEYS.TEAM, JSON.stringify(FabSeedData.teamMembers));
      localStorage.setItem(KEYS.CONTACTS, JSON.stringify(FabSeedData.contactMessages));
      localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(FabSeedData.partnerInquiries));
      localStorage.setItem(KEYS.LOGS, JSON.stringify(FabSeedData.activityLogs));
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(FabSeedData.notifications));
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(FabSeedData.companySettings));
      localStorage.setItem(KEYS.WEBSITE, JSON.stringify(FabSeedData.websiteContent));
      localStorage.setItem(KEYS.MAILER, JSON.stringify(FabSeedData.mailerSettings));

      if (!localStorage.getItem(KEYS.THEME)) {
        localStorage.setItem(KEYS.THEME, 'dark');
      }

      notifyChange(KEYS.EMPLOYEES, 'RESET');
    }
  }

  function resetDemoData() {
    initDemoData(true);
    logActivity('RESET', 'Data Management', 'Reset entire ERP database to pristine demo state.');
  }

  function clearAll() {
    const session = get(KEYS.SESSION);
    const theme = get(KEYS.THEME);
    localStorage.clear();
    if (session) set(KEYS.SESSION, session);
    if (theme) set(KEYS.THEME, theme);
    logActivity('CLEAR', 'Data Management', 'Cleared all user-generated LocalStorage tables.');
  }

  // Auto initialize on load
  initDemoData(false);

  return {
    KEYS,
    get,
    set,
    add,
    update,
    delete: deleteRecord,
    findById,
    logActivity,
    exportAll,
    importAll,
    resetDemoData,
    clearAll,
    notifyChange
  };
})();

