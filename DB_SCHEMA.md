# DB_SCHEMA.md

# PayrollPro — Database Schema Design

## Database

MongoDB (Mongoose ODM)

Naming Convention:

- Collections: plural
- Fields: camelCase
- IDs: MongoDB ObjectId

Common Fields (all collections):

```js
createdAt;
updatedAt;
createdBy;
updatedBy;
```

---

# Entity Relationship Overview

```text
Organization
    │
    ├── Users
    ├── Departments
    ├── Employees
    ├── Salary Structures
    ├── Attendance
    ├── Leave Requests
    ├── Payrolls
    ├── Payslips
    ├── Notifications
    └── Audit Logs

Employee
    ├── Attendance
    ├── Leave Requests
    ├── Payrolls
    └── Salary Structure

Payroll
    ├── Payslip
    └── Deductions
```

---

# 1. organizations

Purpose:

Supports multi-tenant payroll operations.

Collection:

```js
organizations;
```

Schema:

```js
{
  _id: ObjectId,

  name: String,
  code: String,

  email: String,
  phone: String,

  address: String,

  payrollSettings: {
    pensionEmployeePercent: Number,
    pensionEmployerPercent: Number,
    nhfPercent: Number,
    taxEnabled: Boolean
  },

  isActive: Boolean
}
```

Indexes:

```js
{
  code: 1;
}
UNIQUE;
{
  name: 1;
}
```

---

# 2. roles

Collection:

```js
roles;
```

Schema:

```js
{
  _id: ObjectId,

  name: String,

  permissions: [String]
}
```

Seeded Roles:

```text
SUPER_ADMIN
HR_MANAGER
PAYROLL_OFFICER
FINANCE_OFFICER
EMPLOYEE
```

Indexes:

```js
{
  name: 1;
}
UNIQUE;
```

---

# 3. users

Purpose:

Authentication accounts.

Collection:

```js
users;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  roleId: ObjectId,

  firstName: String,
  lastName: String,

  email: String,

  password: String,

  isActive: Boolean,

  lastLoginAt: Date,

  refreshTokenHash: String
}
```

Relationships:

```text
User
  belongsTo Organization
  belongsTo Role
```

Indexes:

```js
{
  email: 1;
}
UNIQUE;
{
  organizationId: 1;
}
{
  roleId: 1;
}
```

---

# 4. departments

Collection:

```js
departments;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  name: String,

  description: String,

  budget: Number,

  managerId: ObjectId,

  isActive: Boolean
}
```

Indexes:

```js
{
  organizationId: 1,
  name: 1
}
UNIQUE
```

---

# 5. employees

Collection:

```js
employees;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  departmentId: ObjectId,

  userId: ObjectId,

  employeeNumber: String,

  firstName: String,
  lastName: String,

  email: String,
  phone: String,

  employmentDate: Date,

  employmentType: String,

  status: String,

  bankName: String,
  accountNumber: String,

  leaveBalance: Number,

  terminatedAt: Date
}
```

Status:

```text
ACTIVE
SUSPENDED
TERMINATED
```

Indexes:

```js
{
  employeeNumber: 1;
}
UNIQUE;

{
  email: 1;
}
UNIQUE;

{
  organizationId: 1;
}

{
  departmentId: 1;
}

{
  status: 1;
}
```

---

# 6. salaryStructures

Collection:

```js
salaryStructures;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  employeeId: ObjectId,

  basicSalary: Number,

  allowances: {
    housing: Number,
    transport: Number,
    meal: Number,
    other: Number
  },

  effectiveDate: Date,

  isActive: Boolean
}
```

Indexes:

```js
{
  employeeId: 1;
}
{
  organizationId: 1;
}
```

---

# 7. attendance

Collection:

```js
attendance;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  employeeId: ObjectId,

  date: Date,

  status: String,

  overtimeHours: Number,

  remarks: String
}
```

Status:

```text
PRESENT
ABSENT
LEAVE
HOLIDAY
```

Indexes:

```js
{
 employeeId: 1,
 date: 1
}
UNIQUE

{
 organizationId: 1
}
```

---

# 8. leaveRequests

Collection:

```js
leaveRequests;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  employeeId: ObjectId,

  leaveType: String,

  startDate: Date,
  endDate: Date,

  totalDays: Number,

  reason: String,

  status: String,

  reviewedBy: ObjectId,

  reviewedAt: Date
}
```

Status:

```text
PENDING
APPROVED
REJECTED
CANCELLED
```

Indexes:

```js
{
  employeeId: 1;
}

{
  status: 1;
}

{
  organizationId: 1;
}
```

---

# 9. deductions

Collection:

```js
deductions;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  employeeId: ObjectId,

  name: String,

  type: String,

  value: Number,

  active: Boolean
}
```

Types:

```text
FIXED
PERCENTAGE
```

Examples:

```text
Loan
Insurance
Union Dues
Cooperative
```

Indexes:

```js
{
  employeeId: 1;
}

{
  organizationId: 1;
}
```

---

# 10. payrolls

Collection:

```js
payrolls;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  employeeId: ObjectId,

  payrollPeriod: String,

  basicSalary: Number,

  allowances: {
    housing: Number,
    transport: Number,
    meal: Number,
    other: Number
  },

  overtimePay: Number,

  grossPay: Number,

  deductions: {
    tax: Number,
    pension: Number,
    nhf: Number,
    custom: Number
  },

  totalDeductions: Number,

  netPay: Number,

  status: String,

  submittedAt: Date,

  approvedAt: Date,

  processedAt: Date,

  paidAt: Date,

  approvedBy: ObjectId
}
```

Status:

```text
DRAFT
SUBMITTED
UNDER_REVIEW
APPROVED
PROCESSED
PAID
REJECTED
```

Indexes:

```js
{
 employeeId: 1,
 payrollPeriod: 1
}
UNIQUE

{
 organizationId: 1
}

{
 status: 1
}
```

---

# 11. payslips

Collection:

```js
payslips;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  payrollId: ObjectId,

  employeeId: ObjectId,

  fileUrl: String,

  generatedAt: Date
}
```

Relationships:

```text
Payroll
   1
   |
   |
   1
Payslip
```

Indexes:

```js
{
  payrollId: 1;
}
UNIQUE;

{
  employeeId: 1;
}
```

---

# 12. notifications

Collection:

```js
notifications;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  recipientId: ObjectId,

  type: String,

  title: String,

  message: String,

  isRead: Boolean,

  sentAt: Date
}
```

Indexes:

```js
{
  recipientId: 1;
}

{
  isRead: 1;
}
```

---

# 13. auditLogs

Collection:

```js
auditLogs;
```

Schema:

```js
{
  _id: ObjectId,

  organizationId: ObjectId,

  actorId: ObjectId,

  action: String,

  resource: String,

  resourceId: ObjectId,

  metadata: Object,

  ipAddress: String,

  timestamp: Date
}
```

Examples:

```text
EMPLOYEE_CREATED

EMPLOYEE_UPDATED

PAYROLL_CREATED

PAYROLL_APPROVED

PAYROLL_PAID

LEAVE_APPROVED

USER_LOGIN
```

Indexes:

```js
{
  actorId: 1;
}

{
  resource: 1;
}

{
  timestamp: -1;
}

{
  organizationId: 1;
}
```

---

# 14. Refresh Tokens (Optional)

If storing multiple sessions.

Collection:

```js
refreshTokens;
```

Schema:

```js
{
  _id: ObjectId,

  userId: ObjectId,

  tokenHash: String,

  expiresAt: Date,

  revoked: Boolean
}
```

Indexes:

```js
{
  userId: 1;
}

{
  expiresAt: 1;
}
TTL;
```

---

# Database Constraints

## Unique Constraints

```js
organizations.code;

roles.name;

users.email;

employees.employeeNumber;

employees.email;

attendance(employeeId, date);

payrolls(employeeId, payrollPeriod);

payslips.payrollId;
```

---

# Soft Delete Strategy

Employees:

```js
status = TERMINATED;
terminatedAt = Date;
```

Users:

```js
isActive = false;
```

Payrolls:

```text
Never deleted after approval
```

Audit Logs:

```text
Never deleted
```

---

# Recommended MongoDB Indexes

```js
employees.status;

employees.departmentId;

payrolls.status;

payrolls.payrollPeriod;

leaveRequests.status;

auditLogs.timestamp;

notifications.recipientId;

attendance.date;
```
