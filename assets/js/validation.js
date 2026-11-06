/**
 * FAB STEEL CONSULTANCY ERP - FORM VALIDATION UTILITY
 */

window.FabValidation = (function () {
  'use strict';

  function isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim());
  }

  function isValidPhone(phone) {
    if (!phone) return false;
    const cleaned = String(phone).replace(/[\s\-\+\(\)]/g, '');
    return cleaned.length >= 7 && /^\d+$/.test(cleaned);
  }

  function isNotEmpty(val) {
    if (val === null || val === undefined) return false;
    return String(val).trim().length > 0;
  }

  function isPositiveNumber(val) {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  }

  function isValidGST(gst) {
    if (!gst) return true; // Optional
    // Indian GSTIN format check or generic alpha-numeric tax id
    const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return re.test(String(gst).trim().toUpperCase()) || String(gst).trim().length >= 8;
  }

  function validateForm(formElement, rules) {
    const errors = {};
    let isValid = true;

    for (const [fieldName, fieldRules] of Object.entries(rules)) {
      const input = formElement.querySelector(`[name="${fieldName}"]`);
      if (!input) continue;
      const value = input.value;

      if (fieldRules.required && !isNotEmpty(value)) {
        errors[fieldName] = `${fieldRules.label || fieldName} is required`;
        isValid = false;
        continue;
      }

      if (fieldRules.email && isNotEmpty(value) && !isValidEmail(value)) {
        errors[fieldName] = `Please enter a valid email address`;
        isValid = false;
        continue;
      }

      if (fieldRules.phone && isNotEmpty(value) && !isValidPhone(value)) {
        errors[fieldName] = `Please enter a valid phone number`;
        isValid = false;
        continue;
      }

      if (fieldRules.positiveNumber && isNotEmpty(value) && !isPositiveNumber(value)) {
        errors[fieldName] = `${fieldRules.label || fieldName} must be a valid positive number`;
        isValid = false;
        continue;
      }
    }

    // Clear previous error messages in form
    formElement.querySelectorAll('.invalid-feedback-custom').forEach(el => el.remove());
    formElement.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

    // Highlight fields and show errors
    for (const [fieldName, errorMsg] of Object.entries(errors)) {
      const input = formElement.querySelector(`[name="${fieldName}"]`);
      if (input) {
        input.classList.add('is-invalid');
        const errDiv = document.createElement('div');
        errDiv.className = 'invalid-feedback-custom';
        errDiv.style.cssText = 'color: var(--danger); font-size: 0.75rem; margin-top: 3px; font-weight: 500;';
        errDiv.innerText = errorMsg;
        input.parentNode.appendChild(errDiv);
      }
    }

    return { isValid, errors };
  }

  return {
    isValidEmail,
    isValidPhone,
    isNotEmpty,
    isPositiveNumber,
    isValidGST,
    validateForm
  };
})();

