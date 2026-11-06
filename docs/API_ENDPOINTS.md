# Fab Steel Consultancy ERP — REST API Specification

This document details the RESTful API endpoints implemented in Phase 1 via `FabMockApiAdapter` and to be implemented in Phase 2 via PHP 8.2+ controllers.

---

## 1. Global Request & Response Specifications

### Base URL
* **Phase 1 (Mock):** Handled in-memory / LocalStorage via `FabMockApiAdapter`
* **Phase 2 (PHP):** `https://erp.fabsteel.com/api/v1`

### Standard Request Headers
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
Accept: application/json
```

### Standard Response Envelope (Success: 200 / 201)
```json
{
  "success": true,
  "status": 200,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": {
    "timestamp": "2025-11-06T10:30:00.000Z",
    "total": 25,
    "filtered": 25
  }
}
```

### Standard Error Envelope (Client Error: 400 / 401 / 403 / 404 / 422)
```json
{
  "success": false,
  "status": 422,
  "data": null,
  "message": "Validation failed",
  "errors": {
    "email": "Email format is invalid or already registered",
    "basicSalary": "Basic salary must be greater than zero"
  }
}
```

---

## 2. Authentication Endpoints

### 2.1 User Login
* **Endpoint:** `POST /auth/login`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "admin@fabsteel.demo",
    "password": "Admin@123",
    "remember": true
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "status": 200,
    "data": {
      "user": {
        "id": "USR-001",
        "name": "David Sterling",
        "email": "admin@fabsteel.demo",
        "role": "SUPER_ADMIN",
        "designation": "Executive Director",
        "avatar": "https://images.unsplash.com/photo-1534528741775..."
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresAt": "2025-11-07T10:30:00.000Z"
    },
    "message": "Login successful"
  }
  ```

### 2.2 Password Recovery (Forgot Password OTP)
* **Endpoint:** `POST /auth/forgot-password`
* **Access:** Public
* **Request Body:**
  ```json
  { "email": "admin@fabsteel.demo" }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "status": 200,
    "data": { "email": "admin@fabsteel.demo", "otp": "849201" },
    "message": "Verification security token dispatched to registered address"
  }
  ```

### 2.3 Password Reset
* **Endpoint:** `POST /auth/reset-password`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "admin@fabsteel.demo",
    "otp": "849201",
    "newPassword": "NewAdmin@2025"
  }
  ```

---

## 3. Employee Management Endpoints

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/employees` | List all employees (filterable by dept/status) | Super Admin, HR, Site Mgr |
| `POST` | `/employees` | Register new employee | Super Admin, HR |
| `GET` | `/employees/{id}` | Retrieve single employee record | Super Admin, HR, Site Mgr |
| `PUT` | `/employees/{id}` | Update existing employee record | Super Admin, HR |
| `DELETE` | `/employees/{id}` | Soft-delete / terminate employee | Super Admin |

* **POST `/employees` Request Body:**
  ```json
  {
    "name": "Marcus Vance",
    "email": "marcus.v@fabsteel.demo",
    "phone": "+1 (555) 349-2194",
    "department": "Structural Engineering",
    "designation": "Senior TEKLA Modeler",
    "joinDate": "2025-11-01",
    "location": "Design Studio Austin",
    "status": "Active"
  }
  ```

---

## 4. Attendance & Biometric Punch Endpoints

### 4.1 Record Biometric Punch (IN / OUT)
* **Endpoint:** `POST /attendance/punch`
* **Access:** Authenticated Users
* **Request Body:**
  ```json
  {
    "employeeId": "EMP-001",
    "employeeName": "David Sterling",
    "type": "IN"
  }
  ```
* **Behavior:**
  - Auto-flags status as `'Late'` if check-in is after `09:15 AM`.
  - Calculates overtime hours if check-out is after `18:00 PM`.

---

## 5. Invoicing & Billing Endpoints

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/invoices` | List invoices with status & partner filters | Super Admin, Finance, Partner (scoped) |
| `POST` | `/invoices` | Create new client project invoice | Super Admin, Finance |
| `GET` | `/invoices/{id}` | Retrieve detailed invoice with items | Super Admin, Finance, Partner |
| `PUT` | `/invoices/{id}` | Update invoice items or terms | Super Admin, Finance |
| `POST` | `/invoices/{id}/payment` | Record payment against invoice | Super Admin, Finance |
| `DELETE`| `/invoices/{id}` | Cancel/delete invoice | Super Admin, Finance |

* **POST `/invoices` Request Body:**
  ```json
  {
    "partnerName": "Apex Steel Fabricators LLC",
    "date": "2025-11-01",
    "dueDate": "2025-11-30",
    "taxRate": 0.10,
    "discount": 500.00,
    "items": [
      {
        "description": "TEKLA 3D Structural Modeling (Phase 2)",
        "quantity": 120,
        "unitPrice": 85.00
      },
      {
        "description": "Connection Design Calculations",
        "quantity": 1,
        "unitPrice": 4200.00
      }
    ]
  }
  ```

---

## 6. Payroll & Compensation Endpoints

### 6.1 Generate Batch Monthly Payroll
* **Endpoint:** `POST /payroll/generate-month`
* **Access:** Super Admin, Finance Staff
* **Request Body:**
  ```json
  {
    "month": "November",
    "year": 2025
  }
  ```
* **Behavior:**
  - Pulls active employees and queries their `salary_structures`.
  - Computes `basic + allowances - statutory deductions`.
  - Creates batch records with status `'Pending'`.

### 6.2 Mark Payroll As Disbursed
* **Endpoint:** `POST /payroll/{id}/mark-paid`
* **Request Body:**
  ```json
  {
    "paymentMethod": "Direct Deposit ACH",
    "paymentDate": "2025-11-28"
  }
  ```

---

## 7. Email & Communication Gateway

### 7.1 Dispatch Outbound Email
* **Endpoint:** `POST /mailer/send`
* **Request Body:**
  ```json
  {
    "to": "client@partner.com",
    "subject": "Invoice INV-2025-084 Issued",
    "body": "Please find attached the billing statement...",
    "template": "Invoice Dispatch"
  }
  ```

### 7.2 Verify SMTP Connection
* **Endpoint:** `POST /mailer/test-smtp`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "status": 200,
    "data": {
      "server": "smtp.gmail.com",
      "port": 587,
      "encryption": "TLS",
      "status": "CONNECTED",
      "latencyMs": 142
    },
    "message": "SMTP server connection test successful. Handshake verified."
  }
  ```

---

## 8. Reports & Analytics Summary Endpoint

* **Endpoint:** `GET /reports/summary`
* **Access:** Super Admin, Finance Staff, HR Staff
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "status": 200,
    "data": {
      "summary": {
        "totalRevenue": 482500.00,
        "totalReceivables": 68400.00,
        "totalPayrollPaid": 214500.00,
        "netOperationalProfit": 268000.00,
        "activeEmployees": 25,
        "totalPartners": 10
      },
      "revenueByMonth": [32000, 38000, 42000, 41000, 48000, 52000, 50000, 56000, 61000, 64000, 38500, 0],
      "attendanceRate": 94
    }
  }
  ```

