/**
 * FAB STEEL CONSULTANCY ERP - ATTENDANCE SERVICE
 * Time-tracking, biometric punch simulation, shift scheduling, and overtime logic
 */

(function () {
  'use strict';

  class AttendanceService {
    constructor() {
      this.repo = new window.FabBaseRepository('attendance');
      this.client = window.FabApiClient;
      this.eventBus = window.FabEventBus;
    }

    async getAll(filters = null) {
      const res = await this.repo.getAll(filters);
      return res.data || [];
    }

    async getById(id) {
      const res = await this.repo.getById(id);
      return res.data || null;
    }

    async recordPunch(type, employeeId, employeeName) {
      const res = await this.client.post('/attendance/punch', {
        type,
        employeeId,
        employeeName
      });
      if (res.success && this.eventBus) {
        this.eventBus.emit('attendance:punched', res.data);
      }
      return res;
    }

    async create(data) {
      const res = await this.repo.create(data);
      if (res.success && this.eventBus) {
        this.eventBus.emit('attendance:created', res.data);
      }
      return res;
    }

    async update(id, data) {
      const res = await this.repo.update(id, data);
      if (res.success && this.eventBus) {
        this.eventBus.emit('attendance:updated', res.data);
      }
      return res;
    }

    async getStats(targetDate = null) {
      const all = await this.getAll();
      const date = targetDate || new Date().toISOString().split('T')[0];
      const todayLogs = all.filter(a => a.date === date);

      const present = todayLogs.filter(a => a.status === 'Present').length;
      const late = todayLogs.filter(a => a.status === 'Late').length;
      const onLeave = todayLogs.filter(a => a.status === 'Leave' || a.status === 'Half-Day').length;
      const totalOvertime = todayLogs.reduce((acc, curr) => acc + (Number(curr.overtimeHours) || 0), 0);

      return {
        date,
        totalLogged: todayLogs.length,
        present,
        late,
        onLeave,
        totalOvertime: parseFloat(totalOvertime.toFixed(1)),
        attendanceRate: todayLogs.length > 0 ? Math.round(((present + late) / todayLogs.length) * 100) : 100
      };
    }
  }

  window.FabAttendanceService = new AttendanceService();
})();

