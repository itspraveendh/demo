/**
 * FAB STEEL CONSULTANCY ERP - CORE APPLICATION CONFIGURATION
 * Phase 1 (Frontend Mock) / Phase 2 (PHP/Node REST API) Toggle & Global Settings
 */

(function () {
  'use strict';

  const FabConfig = {
    // Application Identity
    APP_NAME: 'Fab Steel Consultancy ERP',
    APP_VERSION: '2.5.0-ENTERPRISE',
    RELEASE_PHASE: 'PHASE_1_FRONTEND_DEMO', // 'PHASE_1_FRONTEND_DEMO' | 'PHASE_2_PHP_MYSQL'

    // API Execution Mode:
    // 'mock' = Client-side simulated REST API using LocalStorage
    // 'php'  = Real PHP 8.x + MySQL REST endpoints
    API_MODE: 'mock',

    // API Base URL (used when API_MODE === 'php')
    API_BASE_URL: '/api/v1',
    API_TIMEOUT_MS: 5000,
    SIMULATE_NETWORK_LATENCY_MS: 40, // realistic feedback delay for mock calls (0 for instant)

    // Storage Configuration
    STORAGE_PREFIX: 'fab_erp_',
    STORAGE_ENGINE: 'localStorage', // 'localStorage' | 'sessionStorage' | 'memory'

    // Default Theme Configuration
    DEFAULT_THEME: 'light', // Enterprise requirement: Light mode by default
    AVAILABLE_THEMES: ['light', 'dark'],

    // Currency & Localization
    LOCALE: 'en-US',
    CURRENCY: {
      CODE: 'USD',
      SYMBOL: '$',
      POSITION: 'prefix' // 'prefix' | 'suffix'
    },
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm:ss',

    // Pagination Defaults
    PAGINATION: {
      DEFAULT_PAGE_SIZE: 10,
      PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
    },

    // Business Rules Default Constants
    BUSINESS: {
      TAX_RATE_DEFAULT: 0.10, // 10% standard VAT / Service tax
      OVERTIME_RATE_MULTIPLIER: 1.5,
      STANDARD_WORKING_HOURS_PER_DAY: 8,
      STANDARD_WORKING_DAYS_PER_MONTH: 22,
      MAX_FILE_UPLOAD_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
      ALLOWED_FILE_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword']
    },

    // Feature Flags for Seamless Transition
    FEATURES: {
      ENABLE_MOCK_DELAY: true,
      ENABLE_EVENT_LOGGING: true,
      ENABLE_LIVE_TICKER: true,
      ENABLE_PDF_EXPORT: true,
      ENABLE_CSV_EXPORT: true
    },

    // Method to switch API mode at runtime (useful for demonstration and tests)
    setApiMode(mode) {
      if (['mock', 'php', 'node'].includes(mode)) {
        this.API_MODE = mode;
        console.info(`[FabConfig] API Mode switched to: ${mode.toUpperCase()}`);
        if (window.FabEventBus) {
          window.FabEventBus.emit('config:apiModeChanged', { mode });
        }
      } else {
        console.warn(`[FabConfig] Invalid API mode: ${mode}`);
      }
    }
  };

  window.FabConfig = FabConfig;
})();

