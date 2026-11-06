# Fab Steel Consultancy — Enterprise ERP Management System Demo

An enterprise-grade, production-quality **Fab Steel Consultancy ERP Management System** engineered with a clean, modern SaaS design system and a decoupled layered architecture prepared for immediate or future migration to **PHP 8.x + MySQL 8.x**.

---

## 1. Executive Summary & Design System

* **Default Theme: Clean Light Mode (`#F5F7FA`)** with high-contrast readable typography (`#172033`), subtle gray cards (`#FFFFFF`), border definition (`#E5E7EB`), and primary enterprise blue (`#2563EB`).
* **Optional Theme: Dark Mode (`#0B1220`)** with elevated dark midnight navy panels (`#182235`), neon-accented charts, and high-contrast telemetry text.
* **Theme Persistence:** Stored in `localStorage` (`fab_erp_theme`). An inline script executed in `<head>` ensures **zero theme flash** on page load.
* **Fully Responsive Mobile-First Architecture:**
  - **Desktop ($\ge 1440$px):** Multi-column analytics grid with 250px persistent sidebar.
  - **Laptop ($1024$px–$1439$px):** Compact fluid navigation and optimized card heights.
  - **Tablet ($768$px–$1023$px):** 2-column cards, responsive collapsible navigation.
  - **Mobile ($320$px–$767$px):** Off-canvas slide-out drawer with touch backdrop, 1-column responsive cards, touch-optimized button targets, and scrollable data tables.

---

## 2. Decoupled Two-Phase Architecture

```
[UI Layer (15 Modules)]
       │
       ▼
[Services Layer (Auth, Employee, Invoice, Payroll, Attendance, etc.)]
       │
       ▼
[Repository Layer (FabBaseRepository)]
       │
       ▼
[Unified API Client (FabApiClient)]
       ├── (API_MODE === 'mock') ──► [FabMockApiAdapter] ──► [FabStorageAdapter] (LocalStorage)
       └── (API_MODE === 'php')  ──► [PHP 8.2+ REST API] ──► [MySQL 8.0 Database]
```

To migrate the entire application from Phase 1 (Frontend Demo) to Phase 2 (PHP/MySQL), change a single configuration value in `assets/js/core/app-config.js`:
```javascript
API_MODE: 'php',
API_BASE_URL: 'https://api.fabsteel.com/api/v1',
```
**Zero UI components or business modules need to be rewritten.**

---

## 3. Technology Stack

- **HTML5:** Semantic, accessible component markup.
- **CSS3 Design System:** Custom properties (`--bg-app`, `--bg-surface`, `--primary`, `--text-primary`), zero bloated libraries, smooth transitions.
- **JavaScript (ES6+):** Modular services, pub/sub event bus, typed models.
- **Bootstrap 5 (Grid & Layout):** Responsive column system.
- **Chart.js (v4.4.6):** 7+ theme-adaptive interactive analytics charts.
- **Lucide Icons:** Crisp vector icons across navigation, action bars, and modal buttons.
- **Google Fonts:** Plus Jakarta Sans & JetBrains Mono typography.
- **html2pdf.js:** High-resolution in-browser PDF generation for invoices and payslips.
- **LocalStorage & SessionStorage:** Encapsulated persistence with automated seed data generation and JSON snapshot backup/restore.

---

## 4. Demo User Accounts & Roles

The system enforces strict Role-Based Access Control (RBAC). Log in manually or click any **1-Click Persona Card** on the login screen:

| Role | Demo Email | Password | Primary Scope & Access |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@fabsteel.demo` | `Admin@123` | **Full system control**: All 15 modules, financial ledger, security, and settings. |
| **HR Staff** | `hr@fabsteel.demo` | `Hr@123` | **Workforce operations**: Employees, attendance, salary views, team, activity logs. |
| **Finance Staff** | `finance@fabsteel.demo` | `Finance@123` | **Financial management**: Invoices, payments, salary structure, monthly payroll, reports. |
| **Partner Client** | `partner@fabsteel.demo` | `Partner@123` | **Dedicated Client Portal**: View assigned invoices, download PDFs, submit inquiries. |
| **Employee** | `employee@fabsteel.demo` | `Employee@123` | **Self-Service**: Biometric punch clock, monthly attendance, download salary slip. |
| **Site Manager** | `manager@fabsteel.demo` | `Manager@123` | **Site Operations**: Mark field crew attendance, manage roster, site safety logs. |

---

## 5. Complete 15-Module Enterprise Suite

1. **Executive Operations Terminal (Dashboard):** 6+ KPI cards, 6 interactive Chart.js visualizations, role-tailored views.
2. **Employee Management:** Complete workforce CRUD, department allocation, active status toggle, CSV export.
3. **Attendance Management:** Biometric punch simulator (IN/OUT), late arrival detection ($> 09:15$), overtime calculation, calendar matrix.
4. **Project Invoices & Billing:** Itemized bill builder, automatic 10% tax and discount calculation, payment recording, printable PDF invoices.
5. **Partner Management:** Client & contractor directory, tier classification (Platinum, Gold, Silver, Standard), billing ledger.
6. **Salary Management:** Compensation structures (basic + housing + transport + meal - tax - social security - medical), net salary calculator.
7. **Monthly Payroll:** Batch payroll execution from salary structures, disbursement approval, branded printable payslips.
8. **Website CMS:** Public landing page management (hero, stats, service cards, contact info).
9. **Team Management:** Public leadership and engineering directory.
10. **Contact Messages:** Public website inbound message manager with status workflows.
11. **Partner Inquiries:** Client ticket management with priority levels and response logging.
12. **Email Center (SMTP):** Simulated SMTP handshake (`smtp.gmail.com:587`), template selection, dispatch history audit.
13. **Activity Audit Logs:** Filterable system security trail tracking user actions, timestamps, and IP addresses.
14. **Reports & Analytics:** Executive BI tabs (Financial Summary, Workforce, Compensation, Partner Portfolios), Chart.js trends, CSV export, print layout.
15. **System Settings:** Company metadata, theme defaults, backup JSON export/import, role permissions overview.

---

## 6. Directory Structure

```
├── index.html                    # Smart entrypoint router
├── login.html                    # Enterprise login portal with forgot-password modal
├── dashboard.html                # Main responsive ERP shell
├── public-preview/               # Public marketing website
│   └── index.html
├── assets/
│   ├── css/
│   │   ├── themes.css            # Default Light Mode & Dark Mode variables
│   │   ├── style.css             # Layout, navigation drawer, typography
│   │   ├── components.css        # Enterprise cards, tables, forms, modals
│   │   └── responsive.css        # 320px - 1920px mobile breakpoints
│   └── js/
│       ├── core/                 # Layered architecture core
│       │   ├── app-config.js     # API mode toggle & business constants
│       │   ├── event-bus.js      # Decoupled Pub/Sub messaging bus
│       │   ├── storage-adapter.js# LocalStorage / memory abstraction
│       │   ├── mock-api-adapter.js# Simulated REST API with standard envelopes
│       │   ├── api-client.js     # Unified HTTP client (Mock / PHP fetch)
│       │   └── repository.js     # Base CRUD repository
│       ├── services/             # Enterprise business services
│       │   ├── auth-service.js
│       │   ├── employee-service.js
│       │   ├── attendance-service.js
│       │   ├── invoice-service.js
│       │   ├── partner-service.js
│       │   ├── salary-service.js
│       │   ├── payroll-service.js
│       │   ├── website-service.js
│       │   ├── notification-service.js
│       │   ├── mail-service.js
│       │   └── activity-service.js
│       ├── modules/              # 15 Business UI Modules
│       │   ├── dashboard.js
│       │   ├── employees.js
│       │   ├── attendance.js
│       │   ├── invoices.js
│       │   ├── partners.js
│       │   ├── salary.js
│       │   ├── payroll.js
│       │   ├── website.js
│       │   ├── team.js
│       │   ├── contacts.js
│       │   ├── inquiries.js
│       │   ├── mailer.js
│       │   ├── logs.js
│       │   ├── reports.js        # Module 14: Reports & Analytics
│       │   └── settings.js
│       ├── app.js                # Shell router & orchestrator
│       ├── auth.js               # Auth helper wrapper
│       ├── charts.js             # Chart.js analytics engine
│       ├── notifications.js      # Toast & dropdown notification engine
│       ├── permissions.js        # RBAC rule matrix
│       ├── seed-data.js          # Realistic demo dataset (25 employees, 20 invoices, etc.)
│       ├── storage.js            # Central LocalStorage engine
│       ├── utils.js              # Formatting & helper utilities
│       └── validation.js         # Input validation rules
└── docs/                         # Production PHP Migration Blueprint Suite
    ├── SYSTEM_ARCHITECTURE.md    # Architecture diagram & layer breakdown
    ├── DATABASE_SCHEMA.md        # 15+ MySQL tables with complete DDL & seed queries
    ├── API_ENDPOINTS.md          # OpenAPI / Swagger REST API specifications
    ├── PHP_MIGRATION_GUIDE.md    # PHP 8.x + PDO + JWT backend implementation guide
    ├── ROLE_PERMISSIONS.md       # Detailed 6-role permission matrix
    └── BUSINESS_LOGIC.md         # Formulae (Tax, Overtime, Net Salary, Payroll)
```

---

## 7. Quickstart Instructions

1. **Option 1: Open Directly in Browser**
   Double-click `index.html` or open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

2. **Option 2: Using Any Static Server**
   ```bash
   # Python 3
   python3 -m http.server 8080

   # Node.js npx serve
   npx serve .
   ```
   Open `http://localhost:8080/index.html`.

3. **Resetting Demo Data:**
   Navigate to **Settings** $\rightarrow$ **Data Management** $\rightarrow$ Click **"Reset to Demo Factory Data"** at any time to restore the initial state.
