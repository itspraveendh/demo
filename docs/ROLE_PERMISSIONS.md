# Fab Steel Consultancy ERP — Role-Based Access Control (RBAC) Specification

This document details the enterprise permissions matrix, persona profiles, and authorization enforcement rules across all modules of the Fab Steel Consultancy ERP.

---

## 1. Demo Persona Accounts

| Persona / Role | Email | Password | Primary Scope & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@fabsteel.demo` | `Admin@123` | Unrestricted global access, financial ledger, security & settings |
| **HR Staff** | `hr@fabsteel.demo` | `Hr@123` | Employee management, biometric attendance, staff directory |
| **Finance Staff** | `finance@fabsteel.demo` | `Finance@123` | Project invoices, partner ledger, salary setup, payroll batching |
| **Partner** | `partner@fabsteel.demo` | `Partner@123` | External client portal: view assigned invoices and submit inquiries |
| **Employee** | `employee@fabsteel.demo` | `Employee@123` | Employee self-service: attendance punch, view payslips, profile |
| **Site Manager** | `manager@fabsteel.demo` | `Manager@123` | On-site erection supervisor: mark site crew attendance & shifts |

---

## 2. Module Access Matrix

| Module | Super Admin | HR Staff | Finance Staff | Partner | Employee | Site Manager |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Executive Dashboard** | Full | HR KPI View | Finance KPI View | Partner Portal | Self-Service | Site Terminal |
| **2. Employee Management** | CRUD | CRUD (No Del) | Read-Only | - | - | Read Site Crew |
| **3. Attendance Tracking** | CRUD | CRUD | Read-Only | - | Punch / View Own | Crew Punch / Edit |
| **4. Project Invoices** | CRUD | - | CRUD | View Own Only | - | - |
| **5. Partner Management** | CRUD | - | CRUD (No Del) | View Own Profile | - | - |
| **6. Salary Management** | CRUD | Read-Only | CRUD | - | View Own Slip | - |
| **7. Monthly Payroll** | CRUD | - | CRUD | - | - | - |
| **8. Website CMS** | CRUD | - | - | - | - | - |
| **9. Team Management** | CRUD | CRUD | - | - | - | - |
| **10. Contact Messages** | CRUD | Read | - | - | - | - |
| **11. Partner Inquiries** | CRUD | - | - | Create / View Own | - | - |
| **12. Email Center (SMTP)**| CRUD | - | Send Invoices | - | - | - |
| **13. Activity Audit Logs**| Full View | HR Actions | Finance Actions| - | - | Site Actions |
| **14. Reports & Analytics**| Full BI | HR Reports | Financial BI | - | - | - |
| **15. System Settings** | Full Access| - | - | - | - | - |

*Legend:*
* `CRUD`: Full Create, Read, Update, Delete access.
* `-`: Denied / Hidden from navigation menu.
* `View Own`: Strict data boundary where records are filtered by the active user's ID or company name.

---

## 3. Detailed Role Scope & Boundaries

### 3.1 Super Administrator
* Complete system ownership.
* Can create, edit, or purge any record across all 15 modules.
* Exclusively authorized to access **Enterprise Settings** (database backups, theme defaults, security policies, and user accounts).
* Can switch between any demo persona on-the-fly via the Topbar / Sidebar switch widget.

### 3.2 HR Staff
* **Allowed:**
  - Create, view, and update employee personal and departmental information.
  - Oversee company-wide attendance rosters, manual punch overrides, and leave approvals.
  - Review basic salary brackets to assist hiring decisions.
  - Add public team member profiles.
* **Prohibited:**
  - Cannot delete employee records (soft-deactivation only).
  - Cannot modify financial invoice records or execute payroll payouts.
  - Cannot access system configuration or SMTP credentials.

### 3.3 Finance Staff
* **Allowed:**
  - Generate, send, update, and cancel client project invoices.
  - Record bank wire and ACH payment transactions against open invoices.
  - Define compensation breakdown (Basic, Housing, Transport, Medical, Tax).
  - Execute monthly batch payroll runs and disburse net pay.
* **Prohibited:**
  - Cannot alter employee HR records or biometric shifts.
  - Cannot modify website CMS content.
  - Cannot access system administration settings.

### 3.4 Partner / Client
* **Allowed:**
  - Review billing records and invoice statuses specifically assigned to their company.
  - Download official PDF invoice copies.
  - Submit technical or contractual inquiries to the engineering department.
* **Prohibited:**
  - Cannot view invoices or financial transactions of any other partner or client.
  - No access to workforce data, salary figures, or internal logs.

### 3.5 Employee (Self-Service)
* **Allowed:**
  - View personal employee file and contact info.
  - Punch IN and Punch OUT via the biometric terminal simulator.
  - Review historical attendance records and overtime hours.
  - Download monthly PDF payslips.
* **Prohibited:**
  - Cannot see colleague salary details or company billing metrics.

### 3.6 Site Manager
* **Allowed:**
  - View list of assigned site fabricators, welders, and erection crew.
  - Mark daily attendance and shift schedules for field crew.
  - Log site overtime hours.
* **Prohibited:**
  - Cannot access financial compensation or invoice data.

