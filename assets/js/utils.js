/**
 * FAB STEEL CONSULTANCY ERP - UTILITIES & HELPERS
 */

window.FabUtils = (function () {
  'use strict';

  // HTML Entity escape to protect against XSS
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Currency formatter
  function formatCurrency(amount, currency = 'USD') {
    const num = Number(amount) || 0;
    if (currency === 'INR') {
      return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Date formatter
  function formatDate(dateInput) {
    if (!dateInput) return '—';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }

  // Time formatter
  function formatTime(timeInput) {
    if (!timeInput) return '—';
    if (timeInput.includes(':') && !timeInput.includes('T')) {
      const parts = timeInput.split(':');
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1] || '00';
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    const d = new Date(timeInput);
    if (isNaN(d.getTime())) return timeInput;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  // Relative time formatter ("10 mins ago", "2 hours ago")
  function timeAgo(dateInput) {
    if (!dateInput) return '—';
    const date = new Date(dateInput);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return formatDate(dateInput);
  }

  // Unique ID generator with prefix
  function generateId(prefix = 'ID') {
    const random = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    if (prefix === 'INV') {
      return `INV-${year}-${random}`;
    }
    if (prefix === 'EMP') {
      return `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    if (prefix === 'PR') {
      return `PAY-${year}-${Math.floor(100 + Math.random() * 900)}`;
    }
    if (prefix === 'PART') {
      return `PART-${random}`;
    }
    return `${prefix}-${Date.now().toString().slice(-4)}${random}`;
  }

  // Toast Notification System
  function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container-erp';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-erp toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    if (type === 'danger') iconName = 'alert-triangle';
    if (type === 'warning') iconName = 'alert-circle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i>
      <div style="flex: 1; font-weight: 500;">${escapeHtml(message)}</div>
      <button type="button" style="background:none; border:none; color:inherit; cursor:pointer; opacity:0.6;" onclick="this.parentElement.remove()">
        &times;
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // CSV Export utility
  function exportToCSV(filename, dataRows, headerMapping) {
    if (!dataRows || !dataRows.length) {
      showToast('No records available to export', 'warning');
      return;
    }

    const keys = Object.keys(headerMapping);
    const headers = Object.values(headerMapping);

    const csvContent = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...dataRows.map(row => {
        return keys.map(k => {
          let val = row[k];
          if (val === null || val === undefined) val = '';
          if (typeof val === 'object') val = JSON.stringify(val);
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',');
      })
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${dataRows.length} records to ${filename}.csv`, 'success');
  }

  // PDF Generator helper using html2pdf if loaded or fallback to window.print
  function downloadPDF(elementId, filename = 'document') {
    const element = document.getElementById(elementId);
    if (!element) {
      showToast('Document not found for PDF generation', 'danger');
      return;
    }

    if (window.html2pdf) {
      showToast('Generating high-resolution PDF...', 'info');
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save().then(() => {
        showToast('PDF download completed successfully', 'success');
      }).catch(err => {
        console.error('PDF error', err);
        window.print();
      });
    } else {
      window.print();
    }
  }

  // Debounce for search inputs
  function debounce(func, wait = 250) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  return {
    escapeHtml,
    formatCurrency,
    formatDate,
    formatTime,
    timeAgo,
    generateId,
    showToast,
    exportToCSV,
    downloadPDF,
    debounce
  };
})();

