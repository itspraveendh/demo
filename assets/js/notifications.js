/**
 * FAB STEEL CONSULTANCY ERP - NOTIFICATION CENTER SERVICE
 * Real-time alert dispatching, unread counter, dropdown manager, and module navigation
 */

window.FabNotifications = (function () {
  'use strict';

  const STORAGE_KEY = FabStorage.KEYS.NOTIFICATIONS;

  function getAll() {
    return FabStorage.get(STORAGE_KEY, []) || [];
  }

  function getUnreadCount() {
    const list = getAll();
    return list.filter(n => n.unread).length;
  }

  function updateBadge() {
    const count = getUnreadCount();
    const badges = document.querySelectorAll('.notification-unread-count');
    const dots = document.querySelectorAll('.notification-dot');

    badges.forEach(b => {
      b.innerText = count > 99 ? '99+' : count;
      b.style.display = count > 0 ? 'inline-block' : 'none';
    });

    dots.forEach(d => {
      d.style.display = count > 0 ? 'block' : 'none';
    });
  }

  function markAsRead(id) {
    const list = getAll();
    const item = list.find(n => n.id === id);
    if (item) {
      item.unread = false;
      FabStorage.set(STORAGE_KEY, list);
      updateBadge();
    }
  }

  function markAllAsRead() {
    const list = getAll();
    list.forEach(n => n.unread = false);
    FabStorage.set(STORAGE_KEY, list);
    updateBadge();
    FabUtils.showToast('All notifications marked as read', 'info');
  }

  function deleteNotification(id) {
    const list = getAll();
    const filtered = list.filter(n => n.id !== id);
    FabStorage.set(STORAGE_KEY, filtered);
    updateBadge();
  }

  function addNotification(type, title, message, link = '#dashboard') {
    const list = getAll();
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`,
      type: type,
      title: title,
      message: message,
      link: link,
      unread: true,
      timestamp: new Date().toISOString()
    };
    list.unshift(newNotif);
    if (list.length > 50) list.pop();
    FabStorage.set(STORAGE_KEY, list);
    updateBadge();
    return newNotif;
  }

  // Render notification dropdown content
  function renderDropdown() {
    const list = getAll();
    const unread = list.filter(n => n.unread);

    return `
      <div class="dropdown-header-erp">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span>Notifications</span>
          <span class="badge-status badge-active" style="font-size: 0.65rem; padding: 1px 6px;">
            ${unread.length} New
          </span>
        </div>
        ${unread.length > 0 ? `
          <button type="button" style="background:none; border:none; color:var(--primary); font-size:0.75rem; cursor:pointer; font-weight:600;" onclick="window.FabNotifications.markAllAsRead(); window.FabNotifications.toggleDropdown(true);">
            Mark all read
          </button>
        ` : ''}
      </div>
      <div style="max-height: 380px; overflow-y: auto;">
        ${list.length === 0 ? `
          <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.825rem;">
            No notifications available
          </div>
        ` : list.map(n => {
          let iconColor = 'var(--primary)';
          let iconName = 'bell';
          if (n.type === 'invoice') { iconColor = 'var(--success)'; iconName = 'file-text'; }
          if (n.type === 'partner') { iconColor = 'var(--secondary)'; iconName = 'briefcase'; }
          if (n.type === 'attendance') { iconColor = 'var(--warning)'; iconName = 'clock'; }
          if (n.type === 'employee') { iconColor = 'var(--info)'; iconName = 'user-check'; }
          if (n.type === 'payroll') { iconColor = 'var(--accent)'; iconName = 'credit-card'; }

          return `
            <div class="dropdown-item-erp" style="position: relative; background-color: ${n.unread ? 'var(--bg-surface-elevated)' : 'transparent'}; border-bottom: 1px solid var(--border-subtle);" onclick="window.FabNotifications.handleItemClick('${n.id}', '${n.link}')">
              <div style="width: 32px; height: 32px; min-width: 32px; border-radius: var(--radius-sm); background: var(--bg-surface-hover); display: flex; align-items: center; justify-content: center; color: ${iconColor};">
                <i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 0.8rem; font-weight: ${n.unread ? '700' : '500'}; color: var(--text-primary); margin-bottom: 2px;">
                  ${FabUtils.escapeHtml(n.title)}
                </div>
                <div style="font-size: 0.725rem; color: var(--text-secondary); line-height: 1.3; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                  ${FabUtils.escapeHtml(n.message)}
                </div>
                <div style="font-size: 0.65rem; color: var(--text-muted); font-family: var(--font-mono);">
                  ${FabUtils.timeAgo(n.timestamp)}
                </div>
              </div>
              ${n.unread ? `
                <div style="width: 6px; height: 6px; border-radius: 50%; background-color: var(--primary);"></div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
      <div style="padding: 0.65rem 1rem; text-align: center; background-color: var(--bg-surface-elevated); border-top: 1px solid var(--border-subtle);">
        <a href="#logs" style="font-size: 0.75rem; font-weight: 600; color: var(--primary);" onclick="window.FabNotifications.toggleDropdown(false)">
          View Audit Logs &rarr;
        </a>
      </div>
    `;
  }

  function handleItemClick(id, link) {
    markAsRead(id);
    toggleDropdown(false);
    if (link) {
      window.location.hash = link;
    }
  }

  function toggleDropdown(forceState = null) {
    const dropdown = document.getElementById('notificationDropdownMenu');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('show');
    const newState = forceState !== null ? forceState : !isOpen;

    if (newState) {
      dropdown.innerHTML = renderDropdown();
      dropdown.classList.add('show');
      if (window.lucide) window.lucide.createIcons();
    } else {
      dropdown.classList.remove('show');
    }
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notificationDropdownMenu');
    const btn = document.getElementById('notifDropdownBtn');
    if (!dropdown || !btn) return;
    if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  return {
    getAll,
    getUnreadCount,
    updateBadge,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    renderDropdown,
    toggleDropdown,
    handleItemClick
  };
})();

