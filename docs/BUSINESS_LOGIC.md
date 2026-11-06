# Fab Steel Consultancy ERP — Business Logic & Calculation Specifications

This document defines the mathematical equations, business rules, validation constraints, and lifecycle workflows enforced across the ERP system.

---

## 1. Invoicing & Billing Business Rules

### 1.1 Calculation Formulae
1. **Subtotal Calculation:**
   $$\text{Subtotal} = \sum_{i=1}^{n} (\text{Quantity}_i \times \text{UnitPrice}_i)$$
   - Both `Quantity` and `UnitPrice` must be strictly positive non-negative values.
   - Rounded to 2 decimal places.

2. **Taxable Base:**
   $$\text{TaxableBase} = \max(0, \text{Subtotal} - \text{Discount})$$
   - Discounts cannot exceed the Subtotal. If Discount $>$ Subtotal, Taxable Base evaluates to 0.

3. **Tax (VAT / Service Tax):**
   $$\text{TaxAmount} = \text{TaxableBase} \times \text{TaxRate}$$
   - Default `TaxRate` is $10\%$ ($0.10$), configurable in Company Settings.

4. **Invoice Total (Gross Due):**
   $$\text{Total} = \text{TaxableBase} + \text{TaxAmount}$$

### 1.2 Invoice Lifecycle State Machine

```
              [Create Draft]
                    |
                    v
               +----------+
               |  Draft   |
               +----------+
                    |
              (Dispatch / Send)
                    |
                    v
               +----------+      (Due Date Exceeded)      +-----------+
               |   Sent   | ----------------------------> |  Overdue  |
               +----------+                               +-----------+
                    |                                           |
             (Payment Received)                        (Payment Received)
                    |                                           |
                    +--------------------+----------------------+
                                         |
                                         v
                                   +-----------+
                                   |   Paid    |
                                   +-----------+
```

* **Overdue Evaluation:**
  An invoice automatically transitions to `Overdue` when:
  $$\text{CurrentDate} > \text{DueDate} \quad \text{AND} \quad \text{Status} \notin \{\text{Paid}, \text{Cancelled}\}$$
* **Payment Recording:**
  - Recording full payment sets `Status = 'Paid'` and records `paymentDate` and `paymentMethod`.
  - Partial payments record against `paidAmount` and keep invoice in `Sent` status until fully settled.

---

## 2. Workforce Attendance & Overtime Logic

### 2.1 Standard Operating Hours
* **Shift Window:** 09:00 AM – 18:00 PM (9 hours, including 1 hour lunch).
* **Standard Working Hours:** 8 productive hours per day.
* **Standard Working Days:** 22 days per calendar month.

### 2.2 Punctuality & Late Arrival Threshold
* **Grace Period Cutoff:** `09:15 AM`.
* **Rules:**
  - If $\text{CheckIn} \le \text{09:15 AM} \implies \text{Status} = \text{'Present'}$.
  - If $\text{CheckIn} > \text{09:15 AM} \implies \text{Status} = \text{'Late'}$.
  - If no punch is recorded for a scheduled working day $\implies \text{Status} = \text{'Absent'}$.

### 2.3 Overtime Calculation Formula
* **Overtime Start Threshold:** `18:00 PM`.
* If employee checks out after 18:00:
  $$\text{OvertimeHours} = (\text{CheckOutHour} - 18) + \left(\frac{\text{CheckOutMinute}}{60}\right)$$
* Rounded to 1 decimal place.
* **Overtime Pay Formula:**
  $$\text{HourlyRate} = \frac{\text{BasicSalary}}{22 \times 8}$$
  $$\text{OvertimePay} = \text{OvertimeHours} \times \text{HourlyRate} \times 1.5$$

---

## 3. Compensation & Salary Structure Logic

Each employee's compensation breakdown consists of base salary, allowances, and statutory withholdings:

### 3.1 Allowances Component
$$\text{TotalAllowances} = \text{Housing} + \text{Transport} + \text{Meal} + \text{SpecialAllowance}$$
* Standard corporate benchmarks:
  - Housing: $15\%$ of Basic
  - Transport: $8\%$ of Basic
  - Meal: $5\%$ of Basic

### 3.2 Statutory Deductions Component
$$\text{TotalDeductions} = \text{IncomeTax} + \text{SocialSecurity} + \text{MedicalInsurance} + \text{LoanWithholding}$$
* Standard deductions:
  - Income Tax Withholding: $10\%$ of Basic
  - Social Security Contribution: $6\%$ of Basic
  - Medical Insurance: $3\%$ of Basic

### 3.3 Net Salary Payable
$$\text{NetSalary} = \text{BasicSalary} + \text{TotalAllowances} - \text{TotalDeductions}$$
- `NetSalary` can never be negative. If deductions exceed earnings, `NetSalary` is clamped to 0.

---

## 4. Monthly Batch Payroll Workflow

1. **Trigger:** Finance Officer selects target month and year (e.g., `November 2025`).
2. **Duplicate Protection:**
   - The system checks if payroll has already been executed for that period.
   - If records exist, the operator is prompted before replacing or updating existing draft records.
3. **Execution Loop:**
   - Fetches all active employees (`Status === 'Active'`).
   - Retrieves active `salary_structure` for each employee.
   - Computes allowances, deductions, and net compensation.
   - Generates unique payroll identifier: `PAY-{YEAR}-{MONTH}-{EMP_ID}`.
   - Sets initial status to `'Pending'`.
4. **Disbursement Approval:**
   - Reviewer audits total batch gross vs. net amount.
   - Operator clicks **Disburse Payment**, selecting disbursement mode (`Direct Deposit ACH` / `Bank Wire`).
   - All records in batch transition to `'Paid'`.
   - Generates downloadable printable Payslips formatted with company header and statutory breakdown.

---

## 5. Email Center & Simulated SMTP Protocol

1. **Dispatch Configuration:**
   - Server: `smtp.gmail.com`
   - Port: `587` (TLS) / `465` (SSL)
   - Authentication: RFC 4954 `AUTH LOGIN`
2. **Dispatch Process:**
   - Validates recipient email format via RFC 5322 regex.
   - Verifies subject line and body length.
   - Phase 1: Records simulated SMTP handshake `250 2.0.0 OK Handshake Completed`, logs dispatch in `mailer_history`, and dispatches notification.
   - Phase 2: Dispatches real MIME email using PHPMailer via OAuth2 or Gmail App Password.

