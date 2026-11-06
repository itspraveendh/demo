/**
 * FAB STEEL CONSULTANCY ERP - INVOICE MANAGEMENT MODULE
 * Dynamic multi-row calculations, partial payment ledger, PDF downloads, printable templates, and CSV export
 */

window.FabInvoicesModule = (function () {
  'use strict';

  let statusFilter = 'all';
  let searchQuery = '';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const invoices = FabStorage.get(FabStorage.KEYS.INVOICES, []) || [];

    // Financial KPI aggregation
    const totalCount = invoices.length;
    let totalValue = 0;
    let paidValue = 0;
    let pendingValue = 0;
    let overdueValue = 0;

    invoices.forEach(inv => {
      const tot = Number(inv.totalAmount) || 0;
      const pd = Number(inv.paidAmount) || 0;
      totalValue += tot;
      paidValue += pd;

      const st = (inv.status || '').toLowerCase();
      if (st === 'pending') {
        pendingValue += (tot - pd);
      } else if (st === 'overdue') {
        overdueValue += (tot - pd);
      }
    });

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Project Invoicing & Commercial Billing</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Track milestone billing, steel fabrication tonnage fees, PE connection stamping invoices, and wire settlements.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button type="button" class="btn-erp btn-erp-secondary" onclick="window.FabInvoicesModule.exportInvoicesCSV()">
            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export CSV
          </button>
          <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabInvoicesModule.openCreateModal()">
            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> + Create Invoice
          </button>
        </div>
      </div>

      <!-- Financial Metrics Header Ribbon -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Total Invoiced</div>
            <div class="kpi-value">${FabUtils.formatCurrency(totalValue)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${totalCount} billing documents</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Settled Receipts</div>
            <div class="kpi-value" style="color: var(--success);">${FabUtils.formatCurrency(paidValue)}</div>
            <div style="font-size: 0.75rem; color: var(--success);"><i data-lucide="check-circle" style="width: 12px; height: 12px; display: inline;"></i> Verified wire transfers</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Pending Receivables</div>
            <div class="kpi-value" style="color: var(--warning);">${FabUtils.formatCurrency(pendingValue)}</div>
            <div style="font-size: 0.75rem; color: var(--warning);">Awaiting client approval</div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card-trading">
            <div class="kpi-title">Overdue Receivables</div>
            <div class="kpi-value" style="color: var(--danger);">${FabUtils.formatCurrency(overdueValue)}</div>
            <div style="font-size: 0.75rem; color: var(--danger);">Escalations dispatched</div>
          </div>
        </div>
      </div>

      <!-- Toolbar & Filters -->
      <div class="card-trading mb-3" style="padding: 1rem;">
        <div class="row g-2 align-items-center">
          <div class="col-md-6">
            <div style="position: relative;">
              <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
              <input type="text" class="form-control-erp" placeholder="Search invoices by number, partner, description, or amount..." style="padding-left: 36px;" value="${FabUtils.escapeHtml(searchQuery)}" oninput="window.FabInvoicesModule.handleSearch(this.value)">
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-control-erp form-select-erp" onchange="window.FabInvoicesModule.handleStatusFilter(this.value)">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All Payment Statuses</option>
              <option value="Paid" ${statusFilter === 'Paid' ? 'selected' : ''}>Paid</option>
              <option value="Pending" ${statusFilter === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Overdue" ${statusFilter === 'Overdue' ? 'selected' : ''}>Overdue</option>
              <option value="Draft" ${statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabInvoicesModule.resetFilters()">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Invoices Table Container -->
      <div class="card-trading">
        <div id="invoicesTableWrapper">
          ${renderTableContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function getFilteredInvoices() {
    let list = FabStorage.get(FabStorage.KEYS.INVOICES, []) || [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(i =>
        (i.id && i.id.toLowerCase().includes(q)) ||
        (i.partnerName && i.partnerName.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        String(i.totalAmount).includes(q)
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter(i => (i.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    return list;
  }

  function renderTableContent() {
    const list = getFilteredInvoices();

    if (list.length === 0) {
      return `
        <div style="padding: 3.5rem 1rem; text-align: center; color: var(--text-muted);">
          No invoices match your search or filter settings.
        </div>
      `;
    }

    return `
      <div class="table-responsive-wrapper">
        <table class="table-erp">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Partner Client</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Total Amount</th>
              <th>Settled / Bal</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(inv => {
              const total = Number(inv.totalAmount) || 0;
              const paid = Number(inv.paidAmount) || 0;
              const balance = Math.max(0, total - paid);

              return `
                <tr>
                  <td class="font-mono" style="font-weight: 700; color: var(--primary);">
                    ${inv.id}
                  </td>
                  <td>
                    <div style="font-weight: 700; color: var(--text-primary);">${FabUtils.escapeHtml(inv.partnerName)}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                      ${FabUtils.escapeHtml(inv.description)}
                    </div>
                  </td>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">
                    ${FabUtils.formatDate(inv.date)}
                  </td>
                  <td style="color: ${inv.status === 'Overdue' ? 'var(--danger)' : 'var(--text-muted)'}; font-size: 0.8rem; font-weight: ${inv.status === 'Overdue' ? '700' : 'normal'};">
                    ${FabUtils.formatDate(inv.dueDate)}
                  </td>
                  <td class="font-mono" style="font-weight: 800; font-size: 0.925rem;">
                    ${FabUtils.formatCurrency(total)}
                  </td>
                  <td class="font-mono" style="font-size: 0.8rem;">
                    <div style="color: var(--success); font-weight: 600;">${FabUtils.formatCurrency(paid)}</div>
                    ${balance > 0 ? `<div style="color: var(--warning); font-size: 0.7rem;">Bal: ${FabUtils.formatCurrency(balance)}</div>` : ''}
                  </td>
                  <td>
                    <span class="badge-status badge-${(inv.status || '').toLowerCase()}">
                      <span class="badge-status-dot"></span>
                      ${inv.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; align-items: center; gap: 0.35rem;">
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabInvoicesModule.viewInvoice('${inv.id}')" title="View / Print Branded Invoice">
                        <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                      </button>
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabInvoicesModule.openPaymentModal('${inv.id}')" title="Log Payment">
                        <i data-lucide="credit-card" style="width: 14px; height: 14px; color: var(--success);"></i>
                      </button>
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabInvoicesModule.duplicateInvoice('${inv.id}')" title="Duplicate Invoice">
                        <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
                      </button>
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabInvoicesModule.openEditModal('${inv.id}')" title="Edit Invoice">
                        <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                      </button>
                      <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" style="color: var(--danger);" onclick="window.FabInvoicesModule.deleteInvoice('${inv.id}')" title="Delete">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                      </button>
                    </div>
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
    const wrapper = document.getElementById('invoicesTableWrapper');
    if (wrapper) {
      wrapper.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function handleStatusFilter(val) {
    statusFilter = val;
    const wrapper = document.getElementById('invoicesTableWrapper');
    if (wrapper) {
      wrapper.innerHTML = renderTableContent();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function resetFilters() {
    searchQuery = '';
    statusFilter = 'all';
    render();
  }

  // =========================================================================
  // VIEW / PRINT / DOWNLOAD PDF MODAL
  // =========================================================================
  function viewInvoice(id) {
    const inv = FabStorage.findById(FabStorage.KEYS.INVOICES, id);
    if (!inv) return;

    const existing = document.getElementById('invoiceViewModal');
    if (existing) existing.remove();

    const company = FabStorage.get(FabStorage.KEYS.SETTINGS, {}) || {};

    const modalHtml = `
      <div id="invoiceViewModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-xl" style="background-color: var(--bg-surface);">
          <div class="modal-header-erp no-print">
            <h3 class="modal-title-erp">
              <i data-lucide="file-text" style="color: var(--primary);"></i>
              Invoice Document &middot; ${inv.id}
            </h3>
            <div style="display: flex; gap: 0.65rem;">
              <button type="button" class="btn-erp btn-erp-secondary btn-erp-sm" onclick="window.print()">
                <i data-lucide="printer" style="width: 14px; height: 14px;"></i> Print
              </button>
              <button type="button" class="btn-erp btn-erp-primary btn-erp-sm" onclick="window.FabUtils.downloadPDF('printableInvoiceSheet', '${inv.id}')">
                <i data-lucide="download" style="width: 14px; height: 14px;"></i> Download PDF
              </button>
              <button class="modal-close-btn" onclick="document.getElementById('invoiceViewModal').remove()">&times;</button>
            </div>
          </div>
          <div class="modal-body-erp" style="background-color: #ffffff; color: #0f172a; padding: 2.5rem;" id="printableInvoiceSheet">
            <!-- Professional Branded Invoice Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 2rem; border-bottom: 2px solid #e2e8f0; margin-bottom: 2rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 1.25rem;">
                    FSC
                  </div>
                  <div>
                    <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2;">Fab Steel Consultancy</h2>
                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase;">Global Structural Steel Detailing & BIM</div>
                  </div>
                </div>
                <div style="font-size: 0.8rem; color: #475569; line-height: 1.5;">
                  Suite 1800, Steel Tower, 500 Enterprise Way, Houston TX 77002<br>
                  GSTIN / Tax ID: <strong>${company.gstin || 'US-TX-88392019-STEEL'}</strong> &middot; Tel: +1 (555) 783-3500<br>
                  Email: billing@fabsteel.demo &middot; Web: fabsteelconsultancy.demo
                </div>
              </div>

              <div style="text-align: right;">
                <div style="font-size: 2rem; font-weight: 900; color: #1e3a8a; letter-spacing: -0.03em; margin-bottom: 0.25rem;">INVOICE</div>
                <div style="font-family: monospace; font-size: 1.15rem; font-weight: 800; color: #2563eb; margin-bottom: 0.5rem;">${inv.id}</div>
                <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; background: ${inv.status === 'Paid' ? '#dcfce7; color: #15803d;' : '#fef3c7; color: #b45309;'}">
                  ${inv.status}
                </div>
              </div>
            </div>

            <!-- Bill To & Invoice Info Matrix -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-size: 0.85rem;">
              <div style="width: 50%;">
                <div style="font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">BILL TO CLIENT / PARTNER</div>
                <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">${FabUtils.escapeHtml(inv.partnerName)}</div>
                <div style="color: #475569; line-height: 1.5;">
                  ${FabUtils.escapeHtml(inv.address || 'Commercial Fabrication Yard')}<br>
                  Email: ${FabUtils.escapeHtml(inv.email || 'billing@partner.com')}<br>
                  Client Tax / GST: <strong>${FabUtils.escapeHtml(inv.gstNumber || 'VAT-UNSPECIFIED')}</strong>
                </div>
              </div>

              <div style="width: 35%; text-align: right;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.825rem;">
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Invoice Date:</td>
                    <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">${FabUtils.formatDate(inv.date)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Due Date:</td>
                    <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">${FabUtils.formatDate(inv.dueDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Payment Terms:</td>
                    <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">Net 30 Days</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Settled Amount:</td>
                    <td style="padding: 4px 0; font-weight: 700; color: #15803d; font-family: monospace;">${FabUtils.formatCurrency(inv.paidAmount || 0)}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Description Banner -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.75rem 1rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
              <strong style="color: #1e3a8a;">Project Scope:</strong> ${FabUtils.escapeHtml(inv.description)}
            </div>

            <!-- Line Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 0.85rem;">
              <thead>
                <tr style="background-color: #1e293b; color: #ffffff; text-align: left;">
                  <th style="padding: 10px 14px; border-radius: 6px 0 0 0;">Item & Specification</th>
                  <th style="padding: 10px 14px; text-align: center;">Qty / Unit</th>
                  <th style="padding: 10px 14px; text-align: right;">Unit Price</th>
                  <th style="padding: 10px 14px; text-align: center;">Tax %</th>
                  <th style="padding: 10px 14px; text-align: right; border-radius: 0 6px 0 0;">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                ${(inv.items || []).map((item, idx) => `
                  <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                    <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${FabUtils.escapeHtml(item.name)}</td>
                    <td style="padding: 10px 14px; text-align: center; color: #475569;">${item.qty}</td>
                    <td style="padding: 10px 14px; text-align: right; font-family: monospace; color: #0f172a;">${FabUtils.formatCurrency(item.unitPrice)}</td>
                    <td style="padding: 10px 14px; text-align: center; color: #475569;">${item.tax || 18}%</td>
                    <td style="padding: 10px 14px; text-align: right; font-family: monospace; font-weight: 700; color: #0f172a;">${FabUtils.formatCurrency(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <!-- Totals & Banking Details -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem;">
              <div style="width: 50%; font-size: 0.8rem; background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 8px;">
                <div style="font-weight: 700; color: #1e3a8a; margin-bottom: 0.5rem; text-transform: uppercase;">Wire Transfer Instructions</div>
                <div style="color: #475569; line-height: 1.6;">
                  Bank Name: <strong>Standard Chartered Bank USA</strong><br>
                  Account Name: <strong>Fab Steel Consultancy Global Corp.</strong><br>
                  Account Number: <strong>99882201948271</strong><br>
                  SWIFT/BIC: <strong>SCBLUS33XXX</strong> &middot; Routing: <strong>026002574</strong>
                </div>
              </div>

              <div style="width: 40%;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Subtotal:</td>
                    <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 600;">${FabUtils.formatCurrency(inv.subtotal)}</td>
                  </tr>
                  ${inv.discountAmount > 0 ? `
                    <tr>
                      <td style="padding: 6px 0; color: #dc2626;">Discount (${inv.discountPercent}%):</td>
                      <td style="padding: 6px 0; text-align: right; font-family: monospace; color: #dc2626;">- ${FabUtils.formatCurrency(inv.discountAmount)}</td>
                    </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Tax / GST (${inv.taxPercent || 18}%):</td>
                    <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 600;">${FabUtils.formatCurrency(inv.taxAmount)}</td>
                  </tr>
                  <tr style="border-top: 2px solid #0f172a;">
                    <td style="padding: 10px 0; font-weight: 800; font-size: 1.15rem; color: #0f172a;">Grand Total:</td>
                    <td style="padding: 10px 0; text-align: right; font-family: monospace; font-weight: 900; font-size: 1.35rem; color: #1e3a8a;">${FabUtils.formatCurrency(inv.totalAmount)}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 2rem; border-top: 1px dashed #cbd5e1; font-size: 0.75rem; color: #64748b;">
              <div>
                <p style="margin: 0;">Thank you for partnering with Fab Steel Consultancy.</p>
                <p style="margin: 0;">For billing questions, email: billing@fabsteel.demo</p>
              </div>
              <div style="text-align: center;">
                <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 1.6rem; color: #1e3a8a; line-height: 1;">Alexander Wright</div>
                <div style="border-top: 1px solid #94a3b8; width: 180px; padding-top: 4px; margin-top: 4px;">Authorized Financial Controller</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // LOG PAYMENT MODAL
  // =========================================================================
  function openPaymentModal(id) {
    const inv = FabStorage.findById(FabStorage.KEYS.INVOICES, id);
    if (!inv) return;

    const existing = document.getElementById('paymentLogModal');
    if (existing) existing.remove();

    const remaining = Math.max(0, (Number(inv.totalAmount) || 0) - (Number(inv.paidAmount) || 0));

    const modalHtml = `
      <div id="paymentLogModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="credit-card" style="color: var(--success);"></i>
              Record Payment Receipt &middot; ${inv.id}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('paymentLogModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabInvoicesModule.handlePaymentSubmit(event, '${inv.id}')">
            <div class="modal-body-erp">
              <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem;">
                  <span style="color: var(--text-muted);">Total Invoice:</span>
                  <span class="font-mono" style="font-weight: 700;">${FabUtils.formatCurrency(inv.totalAmount)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.85rem;">
                  <span style="color: var(--text-muted);">Already Paid:</span>
                  <span class="font-mono" style="color: var(--success); font-weight: 700;">${FabUtils.formatCurrency(inv.paidAmount || 0)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                  <span style="color: var(--text-muted); font-weight: 700;">Outstanding Balance:</span>
                  <span class="font-mono" style="color: var(--warning); font-weight: 800;">${FabUtils.formatCurrency(remaining)}</span>
                </div>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Payment Amount ($) <span class="required">*</span></label>
                <input type="number" step="0.01" name="amount" class="form-control-erp font-mono" value="${remaining}" max="${remaining}" required>
              </div>

              <div class="row g-2">
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Payment Date <span class="required">*</span></label>
                    <input type="date" name="paymentDate" class="form-control-erp" value="${new Date().toISOString().split('T')[0]}" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Payment Mode</label>
                    <select name="method" class="form-control-erp form-select-erp">
                      <option value="Wire Transfer (SWIFT)">Wire Transfer (SWIFT)</option>
                      <option value="NEFT / RTGS">NEFT / RTGS</option>
                      <option value="ACH Direct Deposit">ACH Direct Deposit</option>
                      <option value="Commercial Check">Commercial Check</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Transaction / UTR Reference <span class="required">*</span></label>
                <input type="text" name="reference" class="form-control-erp font-mono" placeholder="e.g. WIRE-US-9988210" required>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Internal Accounting Notes</label>
                <textarea name="notes" class="form-control-erp" placeholder="Verified by treasury desk..."></textarea>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('paymentLogModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-success">
                <i data-lucide="check" style="width: 16px; height: 16px;"></i> Confirm Receipt
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();
  }

  function handlePaymentSubmit(event, id) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const inv = FabStorage.findById(FabStorage.KEYS.INVOICES, id);
    if (!inv) return;

    const amount = Number(formData.get('amount')) || 0;
    const currentPaid = Number(inv.paidAmount) || 0;
    const total = Number(inv.totalAmount) || 0;
    const newPaid = currentPaid + amount;

    const newStatus = newPaid >= total ? 'Paid' : 'Pending';

    FabStorage.update(FabStorage.KEYS.INVOICES, id, {
      paidAmount: newPaid,
      status: newStatus,
      paymentDate: formData.get('paymentDate'),
      paymentReference: formData.get('reference'),
      notes: `${inv.notes || ''} | Payment of ${FabUtils.formatCurrency(amount)} recorded (${formData.get('reference')})`
    }, 'Invoices', `Recorded payment receipt of ${FabUtils.formatCurrency(amount)} for Invoice ${id}`);

    FabNotifications.addNotification('invoice', `Payment Logged (${FabUtils.formatCurrency(amount)})`, `Invoice ${id} settled partially or in full.`, '#invoices');
    FabUtils.showToast(`Recorded payment of ${FabUtils.formatCurrency(amount)}`, 'success');

    document.getElementById('paymentLogModal').remove();
    render();
  }

  // =========================================================================
  // CREATE / EDIT INVOICE MODAL
  // =========================================================================
  function openCreateModal() {
    openInvoiceFormModal();
  }

  function openEditModal(id) {
    const inv = FabStorage.findById(FabStorage.KEYS.INVOICES, id);
    if (inv) openInvoiceFormModal(inv);
  }

  function openInvoiceFormModal(invoice = null) {
    const existing = document.getElementById('invoiceFormModal');
    if (existing) existing.remove();

    const isEdit = !!invoice;
    const autoId = isEdit ? invoice.id : FabUtils.generateId('INV');
    const partners = FabStorage.get(FabStorage.KEYS.PARTNERS, []) || [];

    const defaultItems = isEdit ? invoice.items : [
      { name: 'Tekla 3D LOD 400 Steel Detailing (MT)', qty: 1200, unitPrice: 14.00, tax: 18, total: 16800 },
      { name: 'Licensed Connection PE Stamped Calculations', qty: 1, unitPrice: 6500.00, tax: 18, total: 6500 }
    ];

    const modalHtml = `
      <div id="invoiceFormModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp modal-xl">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="${isEdit ? 'edit-3' : 'plus-circle'}" style="color: var(--primary);"></i>
              ${isEdit ? 'Modify Invoice ' + invoice.id : 'Create New Project Invoice'}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('invoiceFormModal').remove()">&times;</button>
          </div>
          <form id="invoiceForm" onsubmit="window.FabInvoicesModule.handleInvoiceFormSubmit(event, ${isEdit ? `'${invoice.id}'` : 'null'})">
            <div class="modal-body-erp">
              <!-- Invoice Details Header Grid -->
              <div class="row g-3 mb-3">
                <div class="col-md-3">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Invoice Number</label>
                    <input type="text" name="id" class="form-control-erp font-mono" value="${autoId}" readonly style="background-color: var(--bg-surface-hover);">
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Select Partner / Client <span class="required">*</span></label>
                    <select name="partnerId" class="form-control-erp form-select-erp" onchange="window.FabInvoicesModule.onPartnerSelect(this.value)" required>
                      <option value="">-- Choose Client --</option>
                      ${partners.map(p => `
                        <option value="${p.id}" ${isEdit && (invoice.partnerId === p.id || invoice.partnerName === p.companyName) ? 'selected' : ''}>
                          ${FabUtils.escapeHtml(p.companyName)} (${p.id})
                        </option>
                      `).join('')}
                    </select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Invoice Date <span class="required">*</span></label>
                    <input type="date" name="date" class="form-control-erp" value="${isEdit ? invoice.date : new Date().toISOString().split('T')[0]}" required>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Due Date <span class="required">*</span></label>
                    <input type="date" name="dueDate" class="form-control-erp" value="${isEdit ? invoice.dueDate : new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}" required>
                  </div>
                </div>

                <div class="col-md-8">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Project / Contract Description <span class="required">*</span></label>
                    <input type="text" name="description" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(invoice.description) : 'High-Precision Steel Detailing & Connection Engineering Deliverables'}" required>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Payment Status</label>
                    <select name="status" class="form-control-erp form-select-erp">
                      <option value="Pending" ${isEdit && invoice.status === 'Pending' ? 'selected' : ''}>Pending</option>
                      <option value="Paid" ${isEdit && invoice.status === 'Paid' ? 'selected' : ''}>Paid</option>
                      <option value="Overdue" ${isEdit && invoice.status === 'Overdue' ? 'selected' : ''}>Overdue</option>
                      <option value="Draft" ${isEdit && invoice.status === 'Draft' ? 'selected' : ''}>Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Dynamic Line Items Builder -->
              <div style="background-color: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0; color: var(--text-primary);">
                    Deliverable Items & Services
                  </h4>
                  <button type="button" class="btn-erp btn-erp-outline-cyan btn-erp-sm" onclick="window.FabInvoicesModule.addItemRow()">
                    <i data-lucide="plus" style="width: 14px; height: 14px;"></i> + Add Item
                  </button>
                </div>

                <div class="table-responsive-wrapper">
                  <table class="table-erp" id="invoiceItemsTable">
                    <thead>
                      <tr>
                        <th style="min-width: 250px;">Item / Service Description</th>
                        <th style="width: 100px;">Quantity</th>
                        <th style="width: 140px;">Unit Price ($)</th>
                        <th style="width: 100px;">Tax (%)</th>
                        <th style="width: 140px; text-align: right;">Total ($)</th>
                        <th style="width: 60px; text-align: center;">Del</th>
                      </tr>
                    </thead>
                    <tbody id="invoiceItemsTbody">
                      ${defaultItems.map((item, idx) => `
                        <tr class="item-row">
                          <td>
                            <input type="text" class="form-control-erp item-name" value="${FabUtils.escapeHtml(item.name)}" placeholder="Item title..." required>
                          </td>
                          <td>
                            <input type="number" class="form-control-erp font-mono item-qty" value="${item.qty}" min="1" step="any" oninput="window.FabInvoicesModule.recalculateTotals()" required>
                          </td>
                          <td>
                            <input type="number" class="form-control-erp font-mono item-price" value="${item.unitPrice}" min="0" step="any" oninput="window.FabInvoicesModule.recalculateTotals()" required>
                          </td>
                          <td>
                            <input type="number" class="form-control-erp font-mono item-tax" value="${item.tax !== undefined ? item.tax : 18}" min="0" max="100" oninput="window.FabInvoicesModule.recalculateTotals()">
                          </td>
                          <td style="text-align: right; font-weight: 700;" class="font-mono item-total-display">
                            ${FabUtils.formatCurrency(item.total)}
                          </td>
                          <td style="text-align: center;">
                            <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm text-danger" onclick="this.closest('tr').remove(); window.FabInvoicesModule.recalculateTotals();">&times;</button>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Financial Summary Calculation Box -->
              <div class="row justify-content-end">
                <div class="col-md-5">
                  <div style="background-color: var(--bg-surface-elevated); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 1.25rem; font-size: 0.85rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                      <span style="color: var(--text-muted);">Subtotal:</span>
                      <span class="font-mono" style="font-weight: 700;" id="calcSubtotal">$0.00</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span style="color: var(--text-muted);">Discount (%):</span>
                      <input type="number" id="calcDiscountPercent" class="form-control-erp font-mono" style="width: 80px; padding: 2px 6px; font-size: 0.8rem; text-align: right;" value="${isEdit ? (invoice.discountPercent || 0) : 0}" min="0" max="100" oninput="window.FabInvoicesModule.recalculateTotals()">
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                      <span style="color: var(--text-muted);">Estimated Tax / GST:</span>
                      <span class="font-mono" style="font-weight: 700;" id="calcTax">$0.00</span>
                    </div>
                    <hr style="border-color: var(--border-subtle); margin: 0.75rem 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--primary);">
                      <span>Grand Total:</span>
                      <span class="font-mono" id="calcGrandTotal">$0.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('invoiceFormModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">
                <i data-lucide="check" style="width: 16px; height: 16px;"></i> ${isEdit ? 'Save Changes' : 'Issue Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) window.lucide.createIcons();

    recalculateTotals();
  }

  function addItemRow() {
    const tbody = document.getElementById('invoiceItemsTbody');
    if (!tbody) return;

    const tr = document.createElement('tr');
    tr.className = 'item-row';
    tr.innerHTML = `
      <td><input type="text" class="form-control-erp item-name" placeholder="Item / service title..." required></td>
      <td><input type="number" class="form-control-erp font-mono item-qty" value="1" min="1" step="any" oninput="window.FabInvoicesModule.recalculateTotals()" required></td>
      <td><input type="number" class="form-control-erp font-mono item-price" value="1000" min="0" step="any" oninput="window.FabInvoicesModule.recalculateTotals()" required></td>
      <td><input type="number" class="form-control-erp font-mono item-tax" value="18" min="0" max="100" oninput="window.FabInvoicesModule.recalculateTotals()"></td>
      <td style="text-align: right; font-weight: 700;" class="font-mono item-total-display">$1,180.00</td>
      <td style="text-align: center;"><button type="button" class="btn-erp btn-erp-ghost btn-erp-sm text-danger" onclick="this.closest('tr').remove(); window.FabInvoicesModule.recalculateTotals();">&times;</button></td>
    `;
    tbody.appendChild(tr);
    recalculateTotals();
  }

  function recalculateTotals() {
    const rows = document.querySelectorAll('#invoiceItemsTbody .item-row');
    let subtotal = 0;
    let totalTax = 0;

    rows.forEach(r => {
      const qty = parseFloat(r.querySelector('.item-qty').value) || 0;
      const price = parseFloat(r.querySelector('.item-price').value) || 0;
      const taxRate = parseFloat(r.querySelector('.item-tax').value) || 0;

      const lineNet = qty * price;
      const lineTax = (lineNet * taxRate) / 100;
      const lineGross = lineNet + lineTax;

      subtotal += lineNet;
      totalTax += lineTax;

      const display = r.querySelector('.item-total-display');
      if (display) display.innerText = FabUtils.formatCurrency(lineGross);
    });

    const discInput = document.getElementById('calcDiscountPercent');
    const discountPercent = discInput ? (parseFloat(discInput.value) || 0) : 0;
    const discountAmount = (subtotal * discountPercent) / 100;

    const grandTotal = Math.max(0, subtotal - discountAmount + totalTax);

    const subEl = document.getElementById('calcSubtotal');
    if (subEl) subEl.innerText = FabUtils.formatCurrency(subtotal);

    const taxEl = document.getElementById('calcTax');
    if (taxEl) taxEl.innerText = FabUtils.formatCurrency(totalTax);

    const grandEl = document.getElementById('calcGrandTotal');
    if (grandEl) grandEl.innerText = FabUtils.formatCurrency(grandTotal);

    return { subtotal, discountPercent, discountAmount, totalTax, grandTotal };
  }

  function onPartnerSelect(partnerId) {
    // optional autofill
  }

  function handleInvoiceFormSubmit(event, editId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const partnerId = formData.get('partnerId');
    const partner = FabStorage.findById(FabStorage.KEYS.PARTNERS, partnerId) || { companyName: 'Client Partner', address: '', email: '', gstNumber: '' };

    const totals = recalculateTotals();

    // Collect items
    const items = [];
    document.querySelectorAll('#invoiceItemsTbody .item-row').forEach(r => {
      const name = r.querySelector('.item-name').value.trim();
      const qty = parseFloat(r.querySelector('.item-qty').value) || 1;
      const unitPrice = parseFloat(r.querySelector('.item-price').value) || 0;
      const tax = parseFloat(r.querySelector('.item-tax').value) || 18;
      const lineNet = qty * unitPrice;
      const total = lineNet + (lineNet * tax) / 100;

      items.push({ name, qty, unitPrice, tax, total });
    });

    if (items.length === 0) {
      FabUtils.showToast('Please add at least one line item', 'warning');
      return;
    }

    const data = {
      id: formData.get('id'),
      date: formData.get('date'),
      dueDate: formData.get('dueDate'),
      partnerId: partnerId,
      partnerName: partner.companyName,
      email: partner.email,
      address: partner.address,
      gstNumber: partner.gstNumber,
      description: formData.get('description'),
      status: formData.get('status'),
      items: items,
      subtotal: totals.subtotal,
      discountPercent: totals.discountPercent,
      discountAmount: totals.discountAmount,
      taxPercent: 18,
      taxAmount: totals.totalTax,
      totalAmount: totals.grandTotal,
      paidAmount: (editId ? (FabStorage.findById(FabStorage.KEYS.INVOICES, editId).paidAmount || 0) : 0),
      notes: 'Issued via Fab Steel ERP Billing Engine'
    };

    if (editId) {
      FabStorage.update(FabStorage.KEYS.INVOICES, editId, data, 'Invoices', `Updated Invoice ${data.id} for ${data.partnerName}`);
      FabUtils.showToast(`Updated Invoice ${data.id}`, 'success');
    } else {
      FabStorage.add(FabStorage.KEYS.INVOICES, data, 'Invoices', `Created Invoice ${data.id} for ${data.partnerName} (${FabUtils.formatCurrency(data.totalAmount)})`);
      FabNotifications.addNotification('invoice', `New Invoice Generated (${data.id})`, `${data.partnerName} billed ${FabUtils.formatCurrency(data.totalAmount)}`, '#invoices');
      FabUtils.showToast(`Invoice ${data.id} generated`, 'success');
    }

    document.getElementById('invoiceFormModal').remove();
    render();
  }

  // Duplicate Invoice
  function duplicateInvoice(id) {
    const inv = FabStorage.findById(FabStorage.KEYS.INVOICES, id);
    if (!inv) return;

    const cloned = JSON.parse(JSON.stringify(inv));
    cloned.id = FabUtils.generateId('INV');
    cloned.date = new Date().toISOString().split('T')[0];
    cloned.dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    cloned.status = 'Draft';
    cloned.paidAmount = 0;
    cloned.paymentDate = null;
    cloned.paymentReference = null;
    cloned.notes = `Cloned from ${id}`;

    FabStorage.add(FabStorage.KEYS.INVOICES, cloned, 'Invoices', `Duplicated Invoice ${id} to ${cloned.id}`);
    FabUtils.showToast(`Cloned to ${cloned.id}`, 'success');
    render();
  }

  // Delete Invoice
  function deleteInvoice(id) {
    if (confirm(`Are you sure you want to delete invoice ${id}?`)) {
      FabStorage.delete(FabStorage.KEYS.INVOICES, id, 'Invoices', `Deleted Invoice ${id}`);
      FabUtils.showToast(`Invoice ${id} deleted`, 'danger');
      render();
    }
  }

  function exportInvoicesCSV() {
    const list = getFilteredInvoices();
    const headers = {
      id: 'Invoice #',
      partnerName: 'Partner Client',
      date: 'Date',
      dueDate: 'Due Date',
      subtotal: 'Subtotal',
      taxAmount: 'Tax Amount',
      totalAmount: 'Total Amount',
      paidAmount: 'Paid Amount',
      status: 'Status',
      description: 'Scope Description'
    };
    FabUtils.exportToCSV(`fab-steel-invoices-${new Date().toISOString().split('T')[0]}`, list, headers);
  }

  return {
    render,
    handleSearch,
    handleStatusFilter,
    resetFilters,
    viewInvoice,
    openPaymentModal,
    handlePaymentSubmit,
    openCreateModal,
    openEditModal,
    addItemRow,
    recalculateTotals,
    onPartnerSelect,
    handleInvoiceFormSubmit,
    duplicateInvoice,
    deleteInvoice,
    exportInvoicesCSV
  };
})();

