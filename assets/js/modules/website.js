/**
 * FAB STEEL CONSULTANCY ERP - WEBSITE MANAGEMENT (FRONTEND CMS)
 * Manage public website settings, landing page hero headlines, services catalog, and SEO meta tags
 */

window.FabWebsiteModule = (function () {
  'use strict';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cms = FabStorage.get(FabStorage.KEYS.WEBSITE, {}) || {};
    const hero = cms.hero || {};
    const about = cms.about || {};
    const pages = cms.pages || [];
    const services = cms.services || [];
    const company = FabStorage.get(FabStorage.KEYS.SETTINGS, {}) || {};

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Website Content Management System (CMS)</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Edit live public web pages, structural engineering service showcases, and corporate SEO metadata.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <a href="public-preview/index.html" target="_blank" class="btn-erp btn-erp-primary">
            <i data-lucide="external-link" style="width: 16px; height: 16px;"></i> Launch Live Public Website
          </a>
        </div>
      </div>

      <!-- CMS Tabs -->
      <div class="row g-3">
        <!-- Hero & Public Taglines -->
        <div class="col-lg-7">
          <div class="card-trading mb-3">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="layout" style="color: var(--primary);"></i>
                Public Homepage Hero Configuration
              </h3>
              <span class="badge-status badge-active" style="font-size: 0.65rem;">Active on Preview</span>
            </div>
            <form onsubmit="window.FabWebsiteModule.saveHeroContent(event)">
              <div class="form-group-erp">
                <label class="form-label-erp">Hero Main Headline <span class="required">*</span></label>
                <input type="text" name="heroTitle" class="form-control-erp" value="${FabUtils.escapeHtml(hero.title || '')}" required>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Hero Subtitle & Capability Description <span class="required">*</span></label>
                <textarea name="heroSubtitle" class="form-control-erp" rows="3" required>${FabUtils.escapeHtml(hero.subtitle || '')}</textarea>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-md-3 col-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Metric 1</label>
                    <input type="text" name="stat1Val" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(hero.stat1Val || '145,000+')}">
                    <input type="text" name="stat1Label" class="form-control-erp mt-1" style="font-size: 0.75rem;" value="${FabUtils.escapeHtml(hero.stat1Label || 'MT Detailed')}">
                  </div>
                </div>
                <div class="col-md-3 col-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Metric 2</label>
                    <input type="text" name="stat2Val" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(hero.stat2Val || '280+')}">
                    <input type="text" name="stat2Label" class="form-control-erp mt-1" style="font-size: 0.75rem;" value="${FabUtils.escapeHtml(hero.stat2Label || 'Mega Projects')}">
                  </div>
                </div>
                <div class="col-md-3 col-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Metric 3</label>
                    <input type="text" name="stat3Val" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(hero.stat3Val || '99.9%')}">
                    <input type="text" name="stat3Label" class="form-control-erp mt-1" style="font-size: 0.75rem;" value="${FabUtils.escapeHtml(hero.stat3Label || 'Erection Accuracy')}">
                  </div>
                </div>
                <div class="col-md-3 col-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Metric 4</label>
                    <input type="text" name="stat4Val" class="form-control-erp font-mono" value="${FabUtils.escapeHtml(hero.stat4Val || '18+')}">
                    <input type="text" name="stat4Label" class="form-control-erp mt-1" style="font-size: 0.75rem;" value="${FabUtils.escapeHtml(hero.stat4Label || 'Countries Served')}">
                  </div>
                </div>
              </div>

              <div class="text-end">
                <button type="submit" class="btn-erp btn-erp-primary">
                  <i data-lucide="check" style="width: 14px; height: 14px;"></i> Save Hero Changes
                </button>
              </div>
            </form>
          </div>

          <!-- Public Pages Overview -->
          <div class="card-trading">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="file-code" style="color: var(--secondary);"></i>
                Public Site Pages & SEO Meta
              </h3>
            </div>
            <div class="table-responsive-wrapper">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th>Page Title</th>
                    <th>Route Slug</th>
                    <th>Meta Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${pages.map(p => `
                    <tr>
                      <td style="font-weight: 700;">${FabUtils.escapeHtml(p.title)}</td>
                      <td class="font-mono" style="color: var(--primary);">/${p.slug}</td>
                      <td style="color: var(--text-muted); font-size: 0.75rem; max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        ${FabUtils.escapeHtml(p.metaDesc)}
                      </td>
                      <td>
                        <span class="badge-status ${p.published ? 'badge-active' : 'badge-draft'}">
                          ${p.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabWebsiteModule.togglePublish('${p.slug}')">
                          ${p.published ? 'Unpublish' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Global Web Metadata & Company Branding -->
        <div class="col-lg-5">
          <div class="card-trading mb-3">
            <div class="card-header-clean">
              <h3 class="card-title-main">
                <i data-lucide="settings" style="color: var(--info);"></i>
                Public Metadata & Contact Channels
              </h3>
            </div>
            <form onsubmit="window.FabWebsiteModule.saveSiteSettings(event)">
              <div class="form-group-erp">
                <label class="form-label-erp">Brand / Website Title</label>
                <input type="text" name="companyName" class="form-control-erp" value="${FabUtils.escapeHtml(company.companyName || 'Fab Steel Consultancy')}" required>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Tagline / Mission</label>
                <input type="text" name="tagline" class="form-control-erp" value="${FabUtils.escapeHtml(company.tagline || '')}">
              </div>

              <div class="row g-2">
                <div class="col-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Inquiry Email</label>
                    <input type="email" name="email" class="form-control-erp" value="${FabUtils.escapeHtml(company.email || 'contact@fabsteel.demo')}">
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Direct Line</label>
                    <input type="text" name="phone" class="form-control-erp" value="${FabUtils.escapeHtml(company.phone || '+1 (555) 783-3500')}">
                  </div>
                </div>
              </div>

              <div class="form-group-erp">
                <label class="form-label-erp">Global Headquarters Address</label>
                <textarea name="address" class="form-control-erp" rows="2">${FabUtils.escapeHtml(company.address || '')}</textarea>
              </div>

              <div class="text-end">
                <button type="submit" class="btn-erp btn-erp-primary">
                  <i data-lucide="check" style="width: 14px; height: 14px;"></i> Update Public Info
                </button>
              </div>
            </form>
          </div>

          <!-- Live Preview Integration Card -->
          <div class="card-trading" style="background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent), var(--bg-surface);">
            <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem;">
              <i data-lucide="globe" style="width: 28px; height: 28px; color: var(--primary);"></i>
              <div>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0;">Instant Two-Way Synchronization</h4>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Changes save directly to LocalStorage</div>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
              The public marketing portal (<code class="font-mono">public-preview/index.html</code>) immediately reads and displays all updates to hero copy, team members, and service offerings. Inbound submissions from public visitors flow straight into Contact Messages and Partner Inquiries.
            </p>
            <a href="public-preview/index.html" target="_blank" class="btn-erp btn-erp-primary w-100">
              <i data-lucide="external-link" style="width: 14px; height: 14px;"></i> Open Public Portal Preview &rarr;
            </a>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function saveHeroContent(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const cms = FabStorage.get(FabStorage.KEYS.WEBSITE, {}) || {};
    cms.hero = {
      title: formData.get('heroTitle'),
      subtitle: formData.get('heroSubtitle'),
      ctaText: 'Explore Our Engineering Capabilities',
      ctaLink: '#services',
      stat1Val: formData.get('stat1Val'),
      stat1Label: formData.get('stat1Label'),
      stat2Val: formData.get('stat2Val'),
      stat2Label: formData.get('stat2Label'),
      stat3Val: formData.get('stat3Val'),
      stat3Label: formData.get('stat3Label'),
      stat4Val: formData.get('stat4Val'),
      stat4Label: formData.get('stat4Label')
    };

    FabStorage.set(FabStorage.KEYS.WEBSITE, cms);
    FabStorage.logActivity('UPDATE', 'Website CMS', 'Updated public website hero section copy');
    FabUtils.showToast('Hero section updated! Check public preview.', 'success');
  }

  function saveSiteSettings(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const comp = FabStorage.get(FabStorage.KEYS.SETTINGS, {}) || {};
    comp.companyName = formData.get('companyName');
    comp.tagline = formData.get('tagline');
    comp.email = formData.get('email');
    comp.phone = formData.get('phone');
    comp.address = formData.get('address');

    FabStorage.set(FabStorage.KEYS.SETTINGS, comp);
    FabStorage.logActivity('UPDATE', 'Website CMS', 'Updated public contact and company information');
    FabUtils.showToast('Site contact settings saved', 'success');
  }

  function togglePublish(slug) {
    const cms = FabStorage.get(FabStorage.KEYS.WEBSITE, {}) || {};
    const page = (cms.pages || []).find(p => p.slug === slug);
    if (page) {
      page.published = !page.published;
      FabStorage.set(FabStorage.KEYS.WEBSITE, cms);
      FabUtils.showToast(`Page /${slug} is now ${page.published ? 'Published' : 'Draft'}`, 'info');
      render();
    }
  }

  return {
    render,
    saveHeroContent,
    saveSiteSettings,
    togglePublish
  };
})();

