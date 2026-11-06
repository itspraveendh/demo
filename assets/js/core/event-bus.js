/**
 * FAB STEEL CONSULTANCY ERP - CENTRAL EVENT BUS
 * Pub/Sub communication bus to decouple UI components, services, and modules
 */

(function () {
  'use strict';

  class EventBus {
    constructor() {
      this.listeners = new Map();
    }

    /**
     * Subscribe to an event
     * @param {string} event 
     * @param {Function} callback 
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('Listener must be a function');
      }
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);

      return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event once
     * @param {string} event 
     * @param {Function} callback 
     */
    once(event, callback) {
      const wrapper = (...args) => {
        this.off(event, wrapper);
        callback(...args);
      };
      return this.on(event, wrapper);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event 
     * @param {Function} callback 
     */
    off(event, callback) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
        if (this.listeners.get(event).size === 0) {
          this.listeners.delete(event);
        }
      }
    }

    /**
     * Emit an event to all subscribers
     * @param {string} event 
     * @param {*} data 
     */
    emit(event, data) {
      if (window.FabConfig && window.FabConfig.FEATURES.ENABLE_EVENT_LOGGING) {
        // Optional quiet debug log for developers
        // console.debug(`[EventBus] ${event}`, data);
      }

      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach(cb => {
          try {
            cb(data);
          } catch (err) {
            console.error(`[EventBus] Error executing listener for event '${event}':`, err);
          }
        });
      }

      // Also trigger a DOM CustomEvent for interoperability
      try {
        const domEvent = new CustomEvent(`fab:${event}`, { detail: data });
        window.dispatchEvent(domEvent);
      } catch (e) {
        // Ignore fallback errors in non-browser environments
      }
    }

    /**
     * Clear all listeners for an event or all events
     * @param {string} [event] 
     */
    clear(event) {
      if (event) {
        this.listeners.delete(event);
      } else {
        this.listeners.clear();
      }
    }
  }

  window.FabEventBus = new EventBus();
})();

