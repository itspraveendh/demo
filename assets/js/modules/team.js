/**
 * FAB STEEL CONSULTANCY ERP - TEAM MANAGEMENT MODULE
 * Public Leadership & Engineering Roster with direct sync to Public Website
 */

window.FabTeamModule = (function () {
  'use strict';

  function render(containerId = 'mainAppContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const team = FabStorage.get(FabStorage.KEYS.TEAM, []) || [];
    team.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="page-title">Public Leadership & Engineering Team</h1>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
            Manage executive profiles, biographies, and structural engineering leaders displayed on the public website.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <a href="public-preview/index.html#team" target="_blank" class="btn-erp btn-erp-secondary">
            <i data-lucide="eye" style="width: 16px; height: 16px;"></i> Preview Public Team Section
          </a>
          <button type="button" class="btn-erp btn-erp-primary" onclick="window.FabTeamModule.openAddModal()">
            <i data-lucide="user-plus" style="width: 16px; height: 16px;"></i> + Add Team Leader
          </button>
        </div>
      </div>

      <!-- Team Grid Cards -->
      <div class="row g-3">
        ${team.map(m => `
          <div class="col-lg-3 col-md-6">
            <div class="card-trading h-100" style="display: flex; flex-direction: column; justify-content: space-between; text-align: center; padding: 1.5rem 1rem;">
              <div>
                <div style="position: relative; width: 84px; height: 84px; margin: 0 auto 1rem;">
                  <img src="${m.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); box-shadow: 0 0 16px rgba(59, 130, 246, 0.3);" alt="${m.name}">
                  <span class="badge-status badge-active" style="position: absolute; bottom: 0; right: 0; padding: 2px 5px; font-size: 0.6rem;">#${m.displayOrder || 1}</span>
                </div>
                <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.25rem;">${FabUtils.escapeHtml(m.name)}</h3>
                <div style="color: var(--secondary); font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;">${FabUtils.escapeHtml(m.designation)}</div>
                <div class="badge-status" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); font-size: 0.7rem; margin-bottom: 0.75rem;">
                  ${FabUtils.escapeHtml(m.department)}
                </div>
                <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  ${FabUtils.escapeHtml(m.bio)}
                </p>
              </div>

              <div style="padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <span class="badge-status ${m.status === 'Active' ? 'badge-active' : 'badge-draft'}">${m.status}</span>
                <div style="display: flex; gap: 0.35rem;">
                  <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm" onclick="window.FabTeamModule.openEditModal('${m.id}')">
                    <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
                  </button>
                  <button type="button" class="btn-erp btn-erp-ghost btn-erp-sm text-danger" onclick="window.FabTeamModule.deleteMember('${m.id}')">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  function openAddModal() {
    openFormModal();
  }

  function openEditModal(id) {
    const m = FabStorage.findById(FabStorage.KEYS.TEAM, id);
    if (m) openFormModal(m);
  }

  function openFormModal(member = null) {
    const existing = document.getElementById('teamFormModal');
    if (existing) existing.remove();

    const isEdit = !!member;
    const autoId = isEdit ? member.id : `TM-${Math.floor(10 + Math.random() * 90)}`;

    const modalHtml = `
      <div id="teamFormModal" class="modal-backdrop-erp active">
        <div class="modal-window-erp">
          <div class="modal-header-erp">
            <h3 class="modal-title-erp">
              <i data-lucide="${isEdit ? 'edit-3' : 'user-plus'}" style="color: var(--primary);"></i>
              ${isEdit ? 'Modify Team Leader' : 'Add Public Leadership Profile'}
            </h3>
            <button class="modal-close-btn" onclick="document.getElementById('teamFormModal').remove()">&times;</button>
          </div>
          <form onsubmit="window.FabTeamModule.handleFormSubmit(event, ${isEdit ? `'${member.id}'` : 'null'})">
            <div class="modal-body-erp">
              <div class="row g-3">
                <div class="col-md-8">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Full Name & Credentials <span class="required">*</span></label>
                    <input type="text" name="name" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(member.name) : ''}" placeholder="e.g. Elena Rostova, PE" required>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Display Order</label>
                    <input type="number" name="displayOrder" class="form-control-erp font-mono" value="${isEdit ? (member.displayOrder || 1) : 1}" min="1">
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Title / Designation <span class="required">*</span></label>
                    <input type="text" name="designation" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(member.designation) : ''}" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Department</label>
                    <input type="text" name="department" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(member.department) : 'Structural Engineering'}">
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Short Biography (Displayed on public site)</label>
                    <textarea name="bio" class="form-control-erp" rows="3" required>${isEdit ? FabUtils.escapeHtml(member.bio) : ''}</textarea>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">Profile Photo URL</label>
                    <input type="url" name="photo" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(member.photo) : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group-erp">
                    <label class="form-label-erp">LinkedIn Profile URL</label>
                    <input type="url" name="linkedin" class="form-control-erp" value="${isEdit ? FabUtils.escapeHtml(member.linkedin) : 'https://linkedin.com'}">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer-erp">
              <button type="button" class="btn-erp btn-erp-secondary" onclick="document.getElementById('teamFormModal').remove()">Cancel</button>
              <button type="submit" class="btn-erp btn-erp-primary">Save Member</button>
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

    const data = {
      name: formData.get('name').trim(),
      designation: formData.get('designation').trim(),
      department: formData.get('department').trim(),
      bio: formData.get('bio').trim(),
      photo: formData.get('photo') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      linkedin: formData.get('linkedin'),
      displayOrder: parseInt(formData.get('displayOrder'), 10) || 1,
      status: 'Active'
    };

    if (editId) {
      FabStorage.update(FabStorage.KEYS.TEAM, editId, data, 'Team Management', `Updated public profile for ${data.name}`);
      FabUtils.showToast(`Updated team member ${data.name}`, 'success');
    } else {
      FabStorage.add(FabStorage.KEYS.TEAM, data, 'Team Management', `Added public team leader ${data.name}`);
      FabUtils.showToast(`Added team leader ${data.name}`, 'success');
    }

    document.getElementById('teamFormModal').remove();
    render();
  }

  function deleteMember(id) {
    const m = FabStorage.findById(FabStorage.KEYS.TEAM, id);
    if (!m) return;

    if (confirm(`Remove ${m.name} from public executive team?`)) {
      FabStorage.delete(FabStorage.KEYS.TEAM, id, 'Team Management', `Removed ${m.name} from team`);
      FabUtils.showToast(`Removed ${m.name}`, 'danger');
      render();
    }
  }

  return {
    render,
    openAddModal,
    openEditModal,
    handleFormSubmit,
    deleteMember
  };
})();

