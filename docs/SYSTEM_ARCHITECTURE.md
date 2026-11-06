# Fab Steel Consultancy ERP — System Architecture Specification

## 1. Executive Architectural Overview

The **Fab Steel Consultancy ERP** is architected using a decoupled **Layered Hexagonal Architecture** designed specifically for a seamless two-phase lifecycle:
* **Phase 1 (Current):** 100% Client-Side Pure Frontend Demo utilizing modern ES6+ modules, dynamic Chart.js visualizations, Bootstrap 5 responsive grid, and a simulated mock REST API adapter persisting data to `localStorage` / `sessionStorage`.
* **Phase 2 (Target):** Enterprise PHP 8.x + MySQL 8.x backend with RESTful API endpoints, JWT token authentication, PDO prepared statements, and transactional database integrity.

The frontend is intentionally designed so that **zero UI modules or business rules need to be rewritten** when switching from Phase 1 to Phase 2. The entire transition is controlled by a single configuration switch in `assets/js/core/app-config.js` (`API_MODE: 'mock'` vs `'php'`).

---

## 2. Layered Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                    PRESENTATION LAYER                                  |
|   +-------------------------------------------------------------------------------+   |
|   |  Responsive HTML5 / CSS3 (Light Mode Default #F5F7FA / Dark Mode #0B1220)       |   |
|   |  Bootstrap 5 Grid + CSS Custom Properties Design System + Lucide Vector Icons  |   |
|   +-------------------------------------------------------------------------------+   |
|   |  15 Enterprise Modules:                                                       |   |
|   |  [Dashboard]  [Employees]  [Attendance]  [Invoices]  [Partners]  [Salary]     |   |
|   |  [Payroll]    [Website]    [Team]        [Contacts]  [Inquiries] [Email]      |   |
|   |  [Logs]       [Reports & Analytics]      [Settings]                           |   |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                APPLICATION SERVICES LAYER                             |
|  [FabAuthService]     [FabEmployeeService]     [FabAttendanceService]                 |
|  [FabInvoiceService]  [FabPartnerService]      [FabSalaryService]                     |
|  [FabPayrollService]  [FabWebsiteService]      [FabNotificationService]               |
|  [FabMailService]     [FabActivityService]     [FabReportsModule Engine]              |
|                                                                                       |
|  * Dispatches async entity lifecycle events via [FabEventBus]                         |
|  * Enforces client-side validation rules & calculates mathematical totals              |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                    REPOSITORY LAYER                                   |
|   [FabBaseRepository] (Standardized CRUD abstraction: getAll, getById, create, update)|
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                                   UNIFIED API CLIENT                                  |
|   [FabApiClient] (get, post, put, patch, delete, bearer tokens, latency simulation)   |
+---------------------------------------------------------------------------------------+
                                           |
                     +---------------------+---------------------+
                     |                                           |
        (Phase 1: API_MODE === 'mock')              (Phase 2: API_MODE === 'php')
                     |                                           |
                     v                                           v
+-----------------------------------------+   +-----------------------------------------+
|           MOCK REST API ADAPTER         |   |         ENTERPRISE REST BACKEND         |
|  [FabMockApiAdapter]                    |   |  PHP 8.2+ PDO Controller / REST Router   |
|  * Generates uniform JSON envelopes     |   |  Bearer JWT Authentication Middleware   |
|  * Simulates HTTP 200, 201, 400, 422    |   |  Server-Side Input Validation           |
|  * Mock SMTP handshake & OTP generator  |   |  ACID Transactional Safety              |
+-----------------------------------------+   +-----------------------------------------+
                     |                                           |
                     v                                           v
+-----------------------------------------+   +-----------------------------------------+
|           STORAGE ADAPTER LAYER         |   |           DATABASE ENGINE LAYER         |
|  [FabStorageAdapter]                    |   |  MySQL 8.x / MariaDB                    |
|  * LocalStorage (`fab_erp_*`)           |   |  * 15+ Relational Tables with Indexes   |
|  * SessionStorage (Session State)       |   |  * Foreign Key Constraints & Cascades   |
|  * Memory Map (Fallback Engine)         |   |  * UTF8MB4 Collation                    |
+-----------------------------------------+   +-----------------------------------------+
```

---

## 3. Detailed Component Breakdown

### 3.1 Presentation & UI Layer
* **Theme System:** Default **Light Mode** (`#F5F7FA`) on initial launch, toggleable to **Dark Mode** (`#0B1220`). Implemented using CSS Custom Properties (`--bg-app`, `--bg-surface`, `--text-primary`, `--primary`). An inline execution script in `<head>` queries `localStorage` prior to DOM paint, preventing white/dark theme flash.
* **Responsive Layout:**
  - Desktop ($\ge 1440$px): Multi-column layout with 250px fixed navigation sidebar.
  - Laptop ($1024$px–$1439$px): Fluid proportional cards, optimized chart heights.
  - Tablet ($768$px–$1023$px): Two-column responsive dashboard cards, collapsible sidebar.
  - Mobile ($320$px–$767$px): Off-canvas navigation drawer with backdrop, full-width touch targets, horizontally scrollable data tables with sticky actions.
* **Iconography & Visuals:** Lucide Vector Icons (`lucide.createIcons()`) and Chart.js 4.4 canvas charts that update palettes automatically upon theme change.

### 3.2 Core Services & Business Rules Layer
Each business entity has a dedicated service class (`assets/js/services/`):
* `FabAuthService`: Manages user credentials, simulated JWT session tokens, role switching, and OTP password recovery.
* `FabEmployeeService`: Workforce CRUD, department assignments, and headcount KPIs.
* `FabAttendanceService`: Biometric punch-in / punch-out time tracking, late arrival detection ($> 09:15$), and overtime accumulation.
* `FabInvoiceService`: Billing items, subtotal calculation, automated tax computation (10%), discount handling, and payment reconciliation.
* `FabPayrollService`: Monthly batch disbursement generation, statutory deductions, net compensation calculation, and payslip printing.
* `FabMailService`: Simulated SMTP handshake (`smtp.gmail.com:587`), email templating, and dispatch history logging.

### 3.3 Event Bus Pub/Sub (`FabEventBus`)
To maintain loose coupling, modules do not communicate directly with one another. Instead, they publish and subscribe to domain events:
* `auth:login` / `auth:logout` / `auth:roleSwitched`
* `employee:created` / `employee:updated` / `employee:deleted`
* `invoice:created` / `invoice:paymentRecorded`
* `attendance:punched`
* `payroll:generated`
* `storage:changed`

### 3.4 Mock API Adapter vs. PHP API Gateway
All service operations resolve promises via `FabApiClient`.
* **Standard Response Envelope (RFC 7807 compliant):**
  ```json
  {
    "success": true,
    "status": 200,
    "data": { ... },
    "message": "Operation completed successfully",
    "meta": {
      "timestamp": "2025-11-06T10:00:00.000Z",
      "total": 25,
      "filtered": 25
    }
  }
  ```
* **Standard Error Envelope:**
  ```json
  {
    "success": false,
    "status": 422,
    "data": null,
    "message": "Validation failed for entity creation",
    "errors": {
      "email": "Email address already registered"
    }
  }
  ```

---

## 4. Phase 1 vs. Phase 2 Architectural Comparison

| Architectural Aspect | Phase 1 (Current Frontend Demo) | Phase 2 (Production PHP + MySQL) |
| :--- | :--- | :--- |
| **Hosting & Execution** | Static web server, GitHub Pages, or local browser | Apache 2.4 / Nginx + PHP-FPM 8.2+ |
| **Database** | `localStorage` JSON serialized strings | MySQL 8.0 InnoDB with foreign keys |
| **API Client Target** | `FabMockApiAdapter` internal JS dispatcher | PHP REST Controllers (`/api/v1/*`) |
| **Network Latency** | Simulated 40ms timer (`setTimeout`) | Real HTTP 1.1 / HTTP 2 TLS latency |
| **Authentication** | Simulated JWT in `sessionStorage` | Cryptographic RS256/HS256 signed JWT |
| **Password Security** | Plaintext demo seeds (`Admin@123`) | `password_hash()` with `PASSWORD_BCRYPT` |
| **File Uploads** | Base64 mock storage / Unsplash URLs | Multipart form data uploaded to `/storage/uploads/` |
| **Email Service** | Mock SMTP dispatcher with response codes | PHPMailer / Symfony Mailer via real Gmail SMTP |
| **Concurrency** | Single-user browser sandbox | Multi-user ACID database locking |

