# SSD.md

# PayrollPro — System Structure Design

## 1. System Overview

PayrollPro is a multi-user payroll management platform designed to automate employee management, attendance tracking, leave management, payroll processing, payslip generation, approvals, and reporting.

The system follows a modular monolith architecture with clear separation of concerns and can later evolve into microservices if needed.

---

# 2. High-Level Architecture

```text
┌─────────────────────────────┐
│         Frontend            │
│  Next.js + TypeScript       │
│  Tailwind + React Query     │
└──────────────┬──────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────┐
│         API Gateway         │
│      Express.js Server      │
└──────────────┬──────────────┘
               │
 ┌─────────────┴─────────────┐
 │      Business Layer       │
 │         Services          │
 └─────────────┬─────────────┘
               │
 ┌─────────────┴─────────────┐
 │      Persistence Layer    │
 │        MongoDB            │
 └───────────────────────────┘

Additional Services

- JWT Authentication
- Audit Logging
- Email Notifications
- PDF Payslip Generation
- Scheduled Jobs
```

---

# 3. Architectural Style

Pattern:

```text
Presentation Layer
        ↓
Controller Layer
        ↓
Service Layer
        ↓
Repository / Model Layer
        ↓
Database
```

Responsibilities:

### Controllers

Handle:

- Request validation
- Response formatting
- Status codes

No business logic.

---

### Services

Handle:

- Payroll calculations
- Leave approval logic
- Attendance rules
- Salary processing
- Authorization decisions

Contains all business logic.

---

### Models

Handle:

- Data schemas
- Database access
- Relationships

No business logic.

---

# 4. Backend Structure

```text
backend/
└── src/
    ├── modules/
    │
    ├── auth/
    ├── organizations/
    ├── users/
    ├── roles/
    ├── employees/
    ├── departments/
    ├── attendance/
    ├── leave/
    ├── salary-structures/
    ├── payroll/
    ├── payslips/
    ├── deductions/
    ├── reports/
    ├── notifications/
    └── audit/
    │
    ├── shared/
    │   ├── middlewares/
    │   ├── validators/
    │   ├── constants/
    │   ├── errors/
    │   ├── utils/
    │   └── services/
    │
    ├── jobs/
    ├── config/
    └── app.js
```

---

# 5. Frontend Structure

```text
frontend/
├── app/
│
├── login/
├── dashboard/
│   ├── employees/
│   ├── departments/
│   ├── attendance/
│   ├── leave/
│   ├── payroll/
│   ├── reports/
│   ├── settings/
│   └── profile/
│
├── api/
├── hooks/
├── store/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── layout/
│
├── types/
├── utils/
└── lib/
```

---

# 6. Module Responsibilities

## Authentication Module

Responsibilities:

- Login
- Logout
- Refresh Tokens
- Password Change
- Password Reset

Dependencies:

- Users
- Roles

---

## Organization Module

Responsibilities:

- Organization creation
- Organization settings
- Payroll configuration

Dependencies:

- Users
- Payroll

---

## Users Module

Responsibilities:

- User management
- Profile management
- Role assignment

Dependencies:

- Roles

---

## Employees Module

Responsibilities:

- Employee records
- Employment status
- Employee profiles

Dependencies:

- Departments
- Salary Structures

---

## Departments Module

Responsibilities:

- Department management
- Employee assignment

Dependencies:

- Employees

---

## Attendance Module

Responsibilities:

- Attendance records
- Overtime tracking
- Absence tracking

Dependencies:

- Employees
- Payroll

---

## Leave Module

Responsibilities:

- Leave requests
- Leave approvals
- Leave balances

Dependencies:

- Employees

---

## Salary Structures Module

Responsibilities:

- Basic salary
- Allowances
- Compensation packages

Dependencies:

- Employees

---

## Payroll Module

Responsibilities:

- Payroll generation
- Payroll approval workflow
- Payroll calculations

Dependencies:

- Employees
- Attendance
- Salary Structures
- Deductions

---

## Payslip Module

Responsibilities:

- PDF generation
- Payslip storage
- Payslip retrieval

Dependencies:

- Payroll

---

## Reports Module

Responsibilities:

- Payroll summaries
- Cost analysis
- Leave reports

Dependencies:

- Payroll
- Attendance
- Employees

---

## Audit Module

Responsibilities:

- Activity tracking
- Security logging
- Compliance records

Dependencies:

- All modules

---

# 7. Authentication Flow

```text
User Login
    ↓
Validate Credentials
    ↓
Generate Access Token
    ↓
Generate Refresh Token
    ↓
Store Refresh Token
    ↓
Return Tokens
```

Access Token:

```text
Lifetime: 15 minutes
```

Refresh Token:

```text
Lifetime: 30 days
```

---

# 8. Authorization Flow

```text
Request
    ↓
JWT Verification
    ↓
User Retrieval
    ↓
Role Verification
    ↓
Permission Check
    ↓
Allow / Deny
```

Roles:

- Super Admin
- HR Manager
- Payroll Officer
- Finance Officer
- Employee

---

# 9. Payroll Processing Flow

```text
Employee Data
        +
Attendance
        +
Salary Structure
        +
Deductions
        ↓
Payroll Generation
        ↓
Draft
        ↓
Submitted
        ↓
Under Review
        ↓
Approved
        ↓
Processed
        ↓
Paid
        ↓
Payslip Generated
```

---

# 10. Leave Approval Flow

```text
Employee
    ↓
Submit Request
    ↓
HR Review
    ↓
Approve / Reject
    ↓
Leave Balance Updated
```

---

# 11. Payslip Generation Flow

```text
Payroll Approved
        ↓
Generate PDF
        ↓
Store PDF Metadata
        ↓
Email Notification
        ↓
Employee Download
```

---

# 12. Notification Architecture

Events:

```text
LEAVE_APPROVED
LEAVE_REJECTED
PAYROLL_SUBMITTED
PAYROLL_APPROVED
PAYSLIP_GENERATED
PASSWORD_CHANGED
```

Flow:

```text
Event Triggered
       ↓
Notification Service
       ↓
Email Queue
       ↓
Email Delivery
```

---

# 13. Background Jobs

Technology:

```text
BullMQ + Redis
```

Jobs:

### Payroll Generation

```text
Generate payroll for all employees
```

### Payslip Generation

```text
Generate PDF files
```

### Email Dispatch

```text
Send notifications
```

### Cleanup Tasks

```text
Delete expired tokens
Archive logs
```

---

# 14. Logging Architecture

Framework:

```text
Winston
```

Outputs:

```text
logs/error.log
logs/combined.log
console
```

Levels:

```text
error
warn
info
debug
```

---

# 15. Audit Architecture

Tracked Events:

```text
EMPLOYEE_CREATED
EMPLOYEE_UPDATED
EMPLOYEE_TERMINATED

LEAVE_APPROVED
LEAVE_REJECTED

PAYROLL_CREATED
PAYROLL_APPROVED
PAYROLL_PAID

USER_LOGIN
USER_LOGOUT
```

Audit Record:

```json
{
  "actorId": "user_id",
  "action": "PAYROLL_APPROVED",
  "resource": "Payroll",
  "resourceId": "payroll_id",
  "timestamp": "2026-01-01T10:00:00Z"
}
```

---

# 16. Security Design

Security Controls:

- JWT Authentication
- Refresh Token Rotation
- Password Hashing (bcrypt)
- Helmet
- CORS
- Input Validation
- Rate Limiting
- Audit Logs

Sensitive Data:

- Passwords never returned
- Refresh tokens hashed before storage
- Salary data protected by RBAC

---

# 17. Scalability Strategy

Current Architecture:

```text
Modular Monolith
```

Future Evolution:

```text
Auth Service
Payroll Service
Notification Service
Reporting Service
```

All modules should communicate through service interfaces to simplify future extraction.

---

# 18. Availability & Reliability

Targets:

Availability:

99.9%

Recovery Objective:

Less than 1 hour

Backups:

- Daily MongoDB backup
- Weekly backup verification

---

# 19. Technology Decisions

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- BullMQ
- Redis
- Winston

Frontend:

- Next.js
- TypeScript
- TailwindCSS
- React Query
- Zustand
- Axios

Infrastructure:

- MongoDB Atlas
- Redis Cloud
- Vercel
- Railway / Render / AWS

---

# 20. Deployment Architecture

```text
Users
   ↓
Next.js Frontend
   ↓
Express API
   ↓
MongoDB Atlas

Background Workers
   ↓
Redis Queue

Email Service
   ↓
SMTP Provider
```
