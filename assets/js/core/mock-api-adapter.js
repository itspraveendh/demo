/**
 * FAB STEEL CONSULTANCY ERP - MOCK REST API ADAPTER
 * Simulates a full enterprise PHP 8.x + MySQL REST API in Phase 1
 * Emits uniform JSON response envelopes:
 *   Success: { success: true, status: 200, data: ..., message: "...", meta: {...} }
 *   Error:   { success: false, status: 4xx, data: null, message: "...", errors: {...} }
 */

(function () {
  'use strict';

  class MockApiAdapter {
    constructor() {
      this.storage = window.FabStorageAdapter;
    }

    /**
     * Entrypoint for simulated HTTP requests
     * @param {string} method - 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
     * @param {string} endpoint - e.g. '/employees', '/invoices/INV-2025-001'
     * @param {Object} [payload] - query params for GET, request body for POST/PUT
     * @param {Object} [headers]
     * @returns {Promise<Object>} Standard API Response Envelope
     */
    async request(method, endpoint, payload = null, headers = {}) {
      const delay = (window.FabConfig && window.FabConfig.SIMULATE_NETWORK_LATENCY_MS) || 0;
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Normalize endpoint
      const cleanUrl = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const [path, queryString] = cleanUrl.split('?');
      const segments = path.split('/').filter(Boolean); // e.g. ['employees', 'EMP-001']

      const resource = segments[0]; // e.g. 'employees'
      const id = segments[1];       // e.g. 'EMP-001' or sub-action
      const subAction = segments[2];

      const upperMethod = method.toUpperCase();

      try {
        let result;

        switch (resource) {
          case 'auth':
            result = this._handleAuth(upperMethod, id, payload);
            break;
          case 'employees':
            result = this._handleCrud('employees', upperMethod, id, payload);
            break;
          case 'attendance':
            result = this._handleAttendance(upperMethod, id, payload);
            break;
          case 'invoices':
            result = this._handleInvoices(upperMethod, id, subAction, payload);
            break;
          case 'partners':
            result = this._handleCrud('partners', upperMethod, id, payload);
            break;
          case 'salaries':
          case 'salary':
            result = this._handleCrud('salary', upperMethod, id, payload);
            break;
          case 'payroll':
            result = this._handlePayroll(upperMethod, id, subAction, payload);
            break;
          case 'website':
            result = this._handleWebsite(upperMethod, id, payload);
            break;
          case 'team':
            result = this._handleCrud('team', upperMethod, id, payload);
            break;
          case 'contacts':
            result = this._handleCrud('contacts', upperMethod, id, payload);
            break;
          case 'inquiries':
            result = this._handleCrud('inquiries', upperMethod, id, payload);
            break;
          case 'mailer':
            result = this._handleMailer(upperMethod, id, payload);
            break;
          case 'logs':
            result = this._handleLogs(upperMethod, payload);
            break;
          case 'settings':
            result = this._handleSettings(upperMethod, payload);
            break;
          case 'notifications':
            result = this._handleNotifications(upperMethod, id, payload);
            break;
          case 'reports':
            result = this._handleReports(upperMethod, id, payload);
            break;
          default:
            return this._error(`Route not found: ${upperMethod} ${cleanUrl}`, 404);
        }

        return result;
      } catch (err) {
        console.error(`[MockApiAdapter] Internal Server Simulation Error:`, err);
        return this._error(err.message || 'Internal Mock Server Error', 500);
      }
    }

    // --- Standard Response Envelopes ---
    _success(data, message = 'Operation completed successfully', meta = null, status = 200) {
      return {
        success: true,
        status,
        data,
        message,
        meta: meta || { timestamp: new Date().toISOString() }
      };
    }

    _error(message = 'An error occurred', status = 400, errors = {}) {
      return {
        success: false,
        status,
        data: null,
        message,
        errors
      };
    }

    // --- Collection Storage Key Helper ---
    _getStorageKey(resource) {
      const map = {
        users: 'users',
        employees: 'employees',
        invoices: 'invoices',
        attendance: 'attendance',
        partners: 'partners',
        salary: 'salary',
        payroll: 'payroll',
        website: 'website',
        team: 'team',
        contacts: 'contacts',
        inquiries: 'inquiries',
        logs: 'logs',
        notifications: 'notifications',
        settings: 'company_settings',
        mailer: 'mailer'
      };
      return map[resource] || resource;
    }

    _getCollection(resource) {
      const key = this._getStorageKey(resource);
      return this.storage.get(key, []) || [];
    }

    _saveCollection(resource, items) {
      const key = this._getStorageKey(resource);
      this.storage.set(key, items);
      // Synchronize with FabStorage event for backward compatibility
      if (window.FabStorage && window.FabStorage.save) {
        const legacyKey = window.FabStorage.KEYS[resource.toUpperCase()] || key;
        window.FabStorage.save(legacyKey, items);
      }
    }

    // --- Generic CRUD Handler ---
    _handleCrud(resource, method, id, payload) {
      let items = this._getCollection(resource);

      switch (method) {
        case 'GET':
          if (id) {
            const item = items.find(it => String(it.id) === String(id));
            if (!item) return this._error(`${resource} record ${id} not found`, 404);
            return this._success(item, `${resource} record retrieved`);
          }
          // Filter handling if payload has filters
          let filtered = [...items];
          if (payload && typeof payload === 'object') {
            Object.keys(payload).forEach(k => {
              if (payload[k] !== undefined && payload[k] !== '' && payload[k] !== 'all') {
                filtered = filtered.filter(item => String(item[k]).toLowerCase() === String(payload[k]).toLowerCase());
              }
            });
          }
          return this._success(filtered, `${resource} collection retrieved`, {
            total: items.length,
            filtered: filtered.length
          });

        case 'POST':
          if (!payload) return this._error('Request payload is required', 422);
          const newId = payload.id || this._generateId(resource);
          const newItem = {
            ...payload,
            id: newId,
            createdAt: payload.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          items.unshift(newItem);
          this._saveCollection(resource, items);
          this._logActivity('CREATE', `${resource.toUpperCase()}`, `Created record ${newId}`);
          return this._success(newItem, `${resource} record created successfully`, null, 201);

        case 'PUT':
        case 'PATCH':
          if (!id) return this._error('Record ID is required for update', 400);
          const index = items.findIndex(it => String(it.id) === String(id));
          if (index === -1) return this._error(`${resource} record ${id} not found`, 404);

          const updatedItem = {
            ...items[index],
            ...payload,
            id: items[index].id, // preserve immutable ID
            updatedAt: new Date().toISOString()
          };
          items[index] = updatedItem;
          this._saveCollection(resource, items);
          this._logActivity('UPDATE', `${resource.toUpperCase()}`, `Updated record ${id}`);
          return this._success(updatedItem, `${resource} record updated successfully`);

        case 'DELETE':
          if (!id) return this._error('Record ID is required for deletion', 400);
          const initialLen = items.length;
          items = items.filter(it => String(it.id) !== String(id));
          if (items.length === initialLen) return this._error(`${resource} record ${id} not found`, 404);

          this._saveCollection(resource, items);
          this._logActivity('DELETE', `${resource.toUpperCase()}`, `Deleted record ${id}`);
          return this._success({ id }, `${resource} record deleted successfully`);

        default:
          return this._error(`Method ${method} not allowed for ${resource}`, 405);
      }
    }

    // --- Auth Routing ---
    _handleAuth(method, action, payload) {
      if (action === 'login' && method === 'POST') {
        const { email, password } = payload || {};
        if (!email || !password) {
          return this._error('Email and password are required', 422, {
            email: !email ? 'Email is required' : null,
            password: !password ? 'Password is required' : null
          });
        }
        const users = this._getCollection('users');
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user || user.password !== password) {
          return this._error('Invalid email or password credentials', 401);
        }
        if (user.status && user.status !== 'Active') {
          return this._error('Account is inactive. Contact Super Admin.', 403);
        }

        // Return user with simulated JWT token
        const token = 'mock-jwt-' + btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }));
        const sessionData = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            department: user.department || 'Management'
          },
          token,
          expiresAt: new Date(Date.now() + 86400000).toISOString()
        };

        this._logActivity('LOGIN', 'AUTH', `User ${user.email} signed in successfully`);
        return this._success(sessionData, 'Login successful');
      }

      if (action === 'logout' && method === 'POST') {
        this._logActivity('LOGOUT', 'AUTH', 'User signed out');
        return this._success(null, 'Logged out successfully');
      }

      if (action === 'forgot-password' && method === 'POST') {
        const { email } = payload || {};
        const users = this._getCollection('users');
        const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
        if (!user) {
          return this._error('No account registered with this email address', 404);
        }
        // Simulated OTP
        return this._success({ otp: '849201', email: user.email }, 'Verification OTP dispatched to registered email');
      }

      if (action === 'reset-password' && method === 'POST') {
        const { email, newPassword, otp } = payload || {};
        if (otp !== '849201') {
          return this._error('Invalid or expired OTP code', 422);
        }
        const users = this._getCollection('users');
        const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
        if (!user) return this._error('User not found', 404);

        user.password = newPassword;
        this._saveCollection('users', users);
        this._logActivity('SECURITY', 'AUTH', `Password reset completed for ${email}`);
        return this._success(null, 'Password has been successfully updated');
      }

      return this._error(`Unsupported auth action: ${action}`, 400);
    }

    // --- Specialized Invoices Handler ---
    _handleInvoices(method, id, subAction, payload) {
      if (subAction === 'payment' && method === 'POST') {
        // Record payment against an invoice
        const invoices = this._getCollection('invoices');
        const inv = invoices.find(i => String(i.id) === String(id));
        if (!inv) return this._error(`Invoice ${id} not found`, 404);

        const amountPaid = parseFloat(payload.amount || inv.total || 0);
        inv.status = 'Paid';
        inv.paymentDate = payload.paymentDate || new Date().toISOString().split('T')[0];
        inv.paymentMethod = payload.paymentMethod || 'Bank Wire';
        inv.notes = (inv.notes ? inv.notes + '\n' : '') + `Payment received: $${amountPaid.toLocaleString()} via ${inv.paymentMethod}`;
        inv.updatedAt = new Date().toISOString();

        this._saveCollection('invoices', invoices);
        this._logActivity('PAYMENT', 'INVOICES', `Payment recorded for ${id} ($${amountPaid})`);
        return this._success(inv, `Payment of $${amountPaid.toFixed(2)} recorded successfully`);
      }

      return this._handleCrud('invoices', method, id, payload);
    }

    // --- Specialized Attendance Handler ---
    _handleAttendance(method, id, payload) {
      if (id === 'punch' && method === 'POST') {
        const { employeeId, employeeName, type } = payload || {};
        const attendance = this._getCollection('attendance');
        const today = new Date().toISOString().split('T')[0];
        const nowTime = new Date().toTimeString().slice(0, 5);

        let record = attendance.find(a => a.employeeId === employeeId && a.date === today);

        if (type === 'IN') {
          if (record && record.checkIn) {
            return this._error('Already checked in today', 400);
          }
          if (!record) {
            record = {
              id: 'ATT-' + Date.now().toString(36).toUpperCase(),
              employeeId,
              employeeName,
              date: today,
              checkIn: nowTime,
              checkOut: '',
              status: nowTime > '09:15' ? 'Late' : 'Present',
              overtimeHours: 0,
              shift: 'General'
            };
            attendance.unshift(record);
          } else {
            record.checkIn = nowTime;
            record.status = nowTime > '09:15' ? 'Late' : 'Present';
          }
        } else if (type === 'OUT') {
          if (!record || !record.checkIn) {
            return this._error('Must check in before checking out', 400);
          }
          record.checkOut = nowTime;
          // Calculate overtime if past 18:00
          if (nowTime > '18:00') {
            const [outH, outM] = nowTime.split(':').map(Number);
            const extraH = Math.max(0, outH - 18 + (outM / 60));
            record.overtimeHours = parseFloat(extraH.toFixed(1));
          }
        }

        this._saveCollection('attendance', attendance);
        this._logActivity('ATTENDANCE', 'HR', `Employee ${employeeName} punched ${type} at ${nowTime}`);
        return this._success(record, `Punch ${type} recorded successfully at ${nowTime}`);
      }

      return this._handleCrud('attendance', method, id, payload);
    }

    // --- Specialized Payroll Handler ---
    _handlePayroll(method, id, subAction, payload) {
      if (id === 'generate-month' && method === 'POST') {
        const { month, year } = payload || {};
        const employees = this._getCollection('employees').filter(e => e.status === 'Active');
        const salaries = this._getCollection('salary');
        let payrollList = this._getCollection('payroll');

        const periodKey = `${month} ${year}`;
        const newRecords = [];

        employees.forEach(emp => {
          const sal = salaries.find(s => s.employeeId === emp.id) || {
            basicSalary: 3500,
            allowances: { housing: 500, transport: 300, meal: 200, special: 0 },
            deductions: { tax: 350, socialSecurity: 200, medicalInsurance: 100, loanDeduction: 0 }
          };

          const totalAllowances = Object.values(sal.allowances || {}).reduce((a, b) => a + Number(b), 0);
          const totalDeductions = Object.values(sal.deductions || {}).reduce((a, b) => a + Number(b), 0);
          const netSalary = sal.basicSalary + totalAllowances - totalDeductions;

          const rec = {
            id: `PAY-${year}-${month.slice(0, 3).toUpperCase()}-${emp.id}`,
            employeeId: emp.id,
            employeeName: emp.name,
            department: emp.department,
            month: periodKey,
            basicSalary: sal.basicSalary,
            allowances: totalAllowances,
            deductions: totalDeductions,
            bonus: 0,
            netSalary: Math.round(netSalary),
            status: 'Pending',
            paymentDate: '',
            paymentMethod: 'Direct Deposit',
            notes: `Auto-generated payroll batch for ${periodKey}`
          };
          newRecords.push(rec);
        });

        // Filter out existing duplicates for that month
        payrollList = payrollList.filter(p => p.month !== periodKey).concat(newRecords);
        this._saveCollection('payroll', payrollList);
        this._logActivity('PAYROLL', 'FINANCE', `Generated monthly payroll for ${periodKey} (${newRecords.length} records)`);
        return this._success(newRecords, `Generated ${newRecords.length} payroll records for ${periodKey}`);
      }

      return this._handleCrud('payroll', method, id, payload);
    }

    // --- Specialized Mailer Handler ---
    _handleMailer(method, id, payload) {
      if (id === 'send' && method === 'POST') {
        const { to, subject, body, template } = payload || {};
        if (!to || !subject) {
          return this._error('Recipient email and subject are required', 422);
        }

        const history = this.storage.get('mailer_history', []) || [];
        const mailLog = {
          id: 'MAIL-' + Date.now().toString(36).toUpperCase(),
          to,
          subject,
          template: template || 'Custom Email',
          status: 'Delivered',
          sentAt: new Date().toISOString(),
          responseCode: '250 2.0.0 OK (Simulated SMTP Handshake)'
        };
        history.unshift(mailLog);
        this.storage.set('mailer_history', history);

        this._logActivity('EMAIL', 'COMMUNICATION', `Dispatched email to ${to}: "${subject}"`);
        return this._success(mailLog, `Email successfully queued and delivered to ${to}`);
      }

      if (id === 'history' && method === 'GET') {
        const history = this.storage.get('mailer_history', []) || [];
        return this._success(history, 'Mail dispatch logs retrieved');
      }

      if (id === 'test-smtp' && method === 'POST') {
        return this._success({
          server: 'smtp.gmail.com',
          port: 587,
          encryption: 'TLS',
          status: 'CONNECTED',
          latencyMs: 142
        }, 'SMTP server connection test successful. Handshake verified.');
      }

      return this._error(`Unsupported mailer action: ${id}`, 400);
    }

    // --- Website Content Handler ---
    _handleWebsite(method, id, payload) {
      let web = this.storage.get('website', null);
      if (!web) {
        web = (window.FabSeedData && window.FabSeedData.website) || {};
      }

      if (method === 'GET') {
        return this._success(web, 'Website configuration loaded');
      }

      if (method === 'PUT' || method === 'POST') {
        const updated = { ...web, ...payload, updatedAt: new Date().toISOString() };
        this.storage.set('website', updated);
        this._logActivity('WEBSITE', 'CMS', 'Updated public website content & SEO settings');
        return this._success(updated, 'Website settings published successfully');
      }

      return this._error(`Method ${method} not allowed for website`, 405);
    }

    // --- Logs Handler ---
    _handleLogs(method, payload) {
      let logs = this._getCollection('logs');
      if (method === 'GET') {
        return this._success(logs, 'Activity logs retrieved', { total: logs.length });
      }
      if (method === 'POST') {
        const newLog = {
          id: 'LOG-' + Date.now(),
          timestamp: new Date().toISOString(),
          user: payload.user || 'System',
          action: payload.action || 'ACTION',
          module: payload.module || 'SYSTEM',
          details: payload.details || '',
          ipAddress: '127.0.0.1'
        };
        logs.unshift(newLog);
        this._saveCollection('logs', logs);
        return this._success(newLog, 'Log created');
      }
      return this._error(`Method ${method} not allowed for logs`, 405);
    }

    // --- Settings Handler ---
    _handleSettings(method, payload) {
      let settings = this.storage.get('company_settings', null);
      if (!settings) {
        settings = (window.FabSeedData && window.FabSeedData.companySettings) || {};
      }

      if (method === 'GET') {
        return this._success(settings, 'Company settings retrieved');
      }

      if (method === 'PUT' || method === 'POST') {
        const merged = { ...settings, ...payload, updatedAt: new Date().toISOString() };
        this.storage.set('company_settings', merged);
        this._logActivity('SETTINGS', 'SYSTEM', 'Company system preferences updated');
        return this._success(merged, 'System settings updated successfully');
      }

      return this._error(`Method ${method} not allowed for settings`, 405);
    }

    // --- Notifications Handler ---
    _handleNotifications(method, id, payload) {
      let notifs = this._getCollection('notifications');

      if (method === 'GET') {
        return this._success(notifs, 'Notifications retrieved');
      }

      if (id === 'mark-all-read' && method === 'POST') {
        notifs.forEach(n => n.read = true);
        this._saveCollection('notifications', notifs);
        return this._success(null, 'All notifications marked as read');
      }

      if (method === 'PUT' && id) {
        const notif = notifs.find(n => String(n.id) === String(id));
        if (notif) {
          notif.read = true;
          this._saveCollection('notifications', notifs);
          return this._success(notif, 'Notification marked read');
        }
        return this._error('Notification not found', 404);
      }

      return this._error('Unsupported notification route', 400);
    }

    // --- Reports & Analytics Engine ---
    _handleReports(method, type, payload) {
      const invoices = this._getCollection('invoices');
      const employees = this._getCollection('employees');
      const payroll = this._getCollection('payroll');
      const attendance = this._getCollection('attendance');
      const partners = this._getCollection('partners');

      const totalRevenue = invoices
        .filter(i => i.status === 'Paid')
        .reduce((sum, i) => sum + (Number(i.total) || 0), 0);

      const totalReceivables = invoices
        .filter(i => i.status !== 'Paid' && i.status !== 'Cancelled')
        .reduce((sum, i) => sum + (Number(i.total) || 0), 0);

      const totalPayrollPaid = payroll
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + (Number(p.netSalary) || 0), 0);

      const activeEmployees = employees.filter(e => e.status === 'Active').length;

      const reportData = {
        summary: {
          totalRevenue,
          totalReceivables,
          totalPayrollPaid,
          netOperationalProfit: totalRevenue - totalPayrollPaid,
          activeEmployees,
          totalPartners: partners.length,
          invoiceCount: invoices.length
        },
        revenueByMonth: this._aggregateRevenueByMonth(invoices),
        payrollByDepartment: this._aggregatePayrollByDept(payroll),
        attendanceRate: this._calculateAttendanceRate(attendance),
        topPartners: partners.slice(0, 5).map(p => ({
          name: p.companyName,
          tier: p.tier,
          totalBilled: invoices
            .filter(inv => inv.partnerName === p.companyName)
            .reduce((s, inv) => s + (Number(inv.total) || 0), 0)
        }))
      };

      return this._success(reportData, 'Consolidated executive reports generated');
    }

    _aggregateRevenueByMonth(invoices) {
      const monthly = new Array(12).fill(0);
      invoices.forEach(inv => {
        if (inv.date) {
          const m = new Date(inv.date).getMonth();
          if (m >= 0 && m < 12) {
            monthly[m] += Number(inv.total) || 0;
          }
        }
      });
      return monthly;
    }

    _aggregatePayrollByDept(payroll) {
      const depts = {};
      payroll.forEach(p => {
        const d = p.department || 'Other';
        depts[d] = (depts[d] || 0) + (Number(p.netSalary) || 0);
      });
      return depts;
    }

    _calculateAttendanceRate(attendance) {
      if (!attendance.length) return 100;
      const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
      return Math.round((presentCount / attendance.length) * 100);
    }

    _generateId(resource) {
      const prefixMap = {
        employees: 'EMP',
        invoices: 'INV',
        partners: 'PRT',
        salary: 'SAL',
        payroll: 'PAY',
        team: 'TM',
        contacts: 'MSG',
        inquiries: 'INQ',
        users: 'USR'
      };
      const p = prefixMap[resource] || 'REC';
      return `${p}-${Date.now().toString(36).toUpperCase()}`;
    }

    _logActivity(action, module, details) {
      try {
        const logs = this.storage.get('logs', []) || [];
        const currentUser = (window.FabAuth && window.FabAuth.getCurrentUser()) || { name: 'Super Admin' };
        logs.unshift({
          id: 'LOG-' + Date.now(),
          timestamp: new Date().toISOString(),
          user: currentUser.name,
          action,
          module,
          details,
          ipAddress: '127.0.0.1'
        });
        if (logs.length > 500) logs.pop();
        this.storage.set('logs', logs);
      } catch (e) {
        // quiet fail for audit logs
      }
    }
  }

  window.FabMockApiAdapter = new MockApiAdapter();
})();

