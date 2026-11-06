# Fab Steel Consultancy ERP — MySQL Database Schema Specification

This document provides the complete, production-ready relational database schema designed for **MySQL 8.x** or **MariaDB 10.6+**. It mirrors the entities, structures, and business constraints established in the Phase 1 frontend implementation.

---

## 1. Entity-Relationship Overview

```
+---------------+           +---------------+           +-------------------+
|     roles     |<----------|     users     |---------->|   activity_logs   |
+---------------+     |     +---------------+           +-------------------+
                      |             |
+---------------+     |             | (1:1 linked employee)
|  permissions  |     |             v
+---------------+     |     +---------------+           +-------------------+
        ^             |     |   employees   |---------->|    attendance     |
        |             |     +---------------+           +-------------------+
+---------------+     |             |
|role_permission|<----+             +------------------>| salary_structures |
+---------------+                   |                   +-------------------+
                                    |
                                    +------------------>|   payroll_items   |
                                                        +-------------------+
                                                                  ^
+---------------+           +---------------+                     |
|   partners    |<----------|   invoices    |             +---------------+
+---------------+           +---------------+             | payroll_runs  |
        ^                           |                     +---------------+
        |                           v
+---------------+           +---------------+
|   inquiries   |           | invoice_items |
+---------------+           +---------------+
                                    |
                                    v
                            +---------------+
                            |invoice_payments
                            +---------------+
```

---

## 2. Complete SQL DDL Statements

```sql
-- Database Initialization
CREATE DATABASE IF NOT EXISTS `fab_steel_erp`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `fab_steel_erp`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. ROLES & ACCESS CONTROL
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `module` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL,
  UNIQUE KEY `uk_module_action` (`module`, `action`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. USERS (AUTH CREDENTIALS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `custom_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  `status` ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  `avatar_url` VARCHAR(500) NULL,
  `phone` VARCHAR(30) NULL,
  `remember_token` VARCHAR(100) NULL,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. DEPARTMENTS & EMPLOYEES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `head_employee_id` INT UNSIGNED NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `employees` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE, -- e.g. EMP-001
  `user_id` INT UNSIGNED NULL UNIQUE,
  `department_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `status` ENUM('Active', 'Inactive', 'Terminated', 'On Leave') DEFAULT 'Active',
  `join_date` DATE NOT NULL,
  `location` VARCHAR(150) DEFAULT 'Headquarters',
  `avatar_url` VARCHAR(500) NULL,
  `emergency_contact` VARCHAR(100) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_emp_dept` (`department_id`),
  INDEX `idx_emp_status` (`status`),
  CONSTRAINT `fk_emp_dept` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_emp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. ATTENDANCE & BIOMETRIC LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `employee_id` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `check_in` TIME NULL,
  `check_out` TIME NULL,
  `status` ENUM('Present', 'Late', 'Absent', 'Half-Day', 'Leave') DEFAULT 'Present',
  `overtime_hours` DECIMAL(4, 2) DEFAULT 0.00,
  `shift_name` VARCHAR(50) DEFAULT 'General Day Shift',
  `notes` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_emp_date` (`employee_id`, `date`),
  INDEX `idx_att_date` (`date`),
  CONSTRAINT `fk_att_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. PARTNERS & ENTERPRISE CLIENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `partners` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE, -- e.g. PRT-001
  `user_id` INT UNSIGNED NULL UNIQUE,
  `company_name` VARCHAR(200) NOT NULL,
  `contact_person` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `tier` ENUM('Platinum', 'Gold', 'Silver', 'Standard') DEFAULT 'Standard',
  `status` ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  `country` VARCHAR(100) DEFAULT 'United States',
  `city` VARCHAR(100) NULL,
  `billing_address` TEXT NULL,
  `tax_number` VARCHAR(50) NULL,
  `total_projects` INT UNSIGNED DEFAULT 1,
  `total_billing` DECIMAL(14, 2) DEFAULT 0.00,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_partner_tier` (`tier`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. INVOICES, LINE ITEMS & PAYMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE, -- e.g. INV-2025-001
  `partner_id` INT UNSIGNED NOT NULL,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `tax_rate` DECIMAL(5, 4) NOT NULL DEFAULT 0.1000, -- 10%
  `tax_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `paid_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Draft',
  `payment_method` VARCHAR(50) NULL,
  `payment_date` DATE NULL,
  `terms` TEXT NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_inv_status` (`status`),
  INDEX `idx_inv_due` (`due_date`),
  CONSTRAINT `fk_inv_partner` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `invoice_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT UNSIGNED NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL DEFAULT 1.00,
  `unit_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT `fk_ii_inv` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `invoice_payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `payment_date` DATE NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `transaction_reference` VARCHAR(100) NULL,
  `notes` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ip_inv` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. SALARY STRUCTURES & PAYROLL
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `salary_structures` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL UNIQUE,
  `basic_salary` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `allowance_housing` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `allowance_transport` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `allowance_meal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `allowance_special` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `deduction_tax` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `deduction_social_security` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `deduction_medical` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `deduction_loan` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `net_salary` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `effective_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sal_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `payroll_runs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period_month` VARCHAR(20) NOT NULL, -- e.g. "October 2025"
  `processed_date` DATE NOT NULL,
  `total_employees` INT UNSIGNED NOT NULL,
  `total_gross` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `total_deductions` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `total_net_disbursed` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Draft', 'Approved', 'Paid', 'Archived') DEFAULT 'Draft',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_payroll_period` (`period_month`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `payroll_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `payroll_run_id` INT UNSIGNED NOT NULL,
  `employee_id` INT UNSIGNED NOT NULL,
  `basic_salary` DECIMAL(12, 2) NOT NULL,
  `total_allowances` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_deductions` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `bonus_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `net_salary` DECIMAL(12, 2) NOT NULL,
  `payment_status` ENUM('Pending', 'Paid', 'Hold') DEFAULT 'Pending',
  `payment_method` VARCHAR(50) DEFAULT 'Direct Deposit',
  `payment_date` DATE NULL,
  CONSTRAINT `fk_pi_run` FOREIGN KEY (`payroll_run_id`) REFERENCES `payroll_runs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pi_emp` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. COMMUNICATIONS & CRM (MESSAGES, INQUIRIES, MAILER)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `sender_name` VARCHAR(150) NOT NULL,
  `sender_email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'Read', 'Replied', 'Archived') DEFAULT 'New',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `partner_inquiries` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `partner_id` INT UNSIGNED NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `contact_person` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  `status` ENUM('New', 'Under Review', 'In Progress', 'Resolved', 'Closed') DEFAULT 'New',
  `details` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_inq_partner` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `recipient_email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `template_used` VARCHAR(100) DEFAULT 'General Notification',
  `status` ENUM('Queued', 'Delivered', 'Failed') DEFAULT 'Delivered',
  `smtp_response` VARCHAR(255) DEFAULT '250 2.0.0 OK Handshake Completed',
  `sent_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. AUDIT LOGS & SYSTEM SETTINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_name` VARCHAR(150) NOT NULL,
  `action` VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, etc.
  `module` VARCHAR(50) NOT NULL,
  `details` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT '127.0.0.1',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_log_created` (`created_at`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `company_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'general',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
```

---

## 3. Seed Data Insertion Script

```sql
-- Insert Standard Roles
INSERT INTO `roles` (`slug`, `name`, `description`) VALUES
('SUPER_ADMIN', 'Super Administrator', 'Full system control, financial governance, and settings'),
('HR_STAFF', 'Human Resources Staff', 'Workforce, attendance, and team administration'),
('FINANCE_STAFF', 'Finance Staff', 'Invoicing, salary management, and payroll accounting'),
('PARTNER', 'Corporate Partner', 'Client portal: project invoices and inquiries'),
('EMPLOYEE', 'Engineering Personnel', 'Employee self-service: attendance and payslips'),
('SITE_MANAGER', 'Site Operations Manager', 'Site crew supervision and roster attendance');

-- Insert Initial Admin Account (BCrypt hash for "Admin@123")
INSERT INTO `users` (`custom_id`, `name`, `email`, `password_hash`, `role_id`, `status`, `avatar_url`)
VALUES (
  'USR-001',
  'David Sterling',
  'admin@fabsteel.demo',
  '$2y$10$wK8r4mUu1bC1hR8L/bK6ueY7E1K3kF1O2A.G4t2c3hB1iL4f7D5.y',
  1,
  'Active',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
);

-- Insert Standard Departments
INSERT INTO `departments` (`code`, `name`) VALUES
('ENG', 'Structural Engineering'),
('FAB', 'Steel Fabrication & Welding'),
('PM', 'Project Management & Erection'),
('QA', 'Quality Assurance & NDT'),
('FIN', 'Finance & Accounting'),
('HR', 'Human Resources & Safety');
```

