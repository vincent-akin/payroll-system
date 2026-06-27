// src/types/index.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  role?: Role;
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

export interface Organization {
  _id: string;
  name: string;
  code: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  organizationId: string;
  organization?: Organization;
  isActive: boolean;
}

export interface Employee {
  _id: string;
  employeeId: string;
  userId: string;
  user?: User;
  organizationId: string;
  organization?: Organization;
  departmentId: string;
  department?: Department;
  position: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN';
  joinDate: Date;
  terminationDate?: Date;
  isActive: boolean;
  contactInfo: {
    phone: string;
    address: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch: string;
  };
}

export interface SalaryStructure {
  _id: string;
  employeeId: string;
  employee?: Employee;
  organizationId: string;
  basicSalary: number;
  allowances: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  deductions: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  grossSalary: number;
  effectiveDate: Date;
  endDate?: Date;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  version: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  _id: string;
  employeeId: string;
  employee?: Employee;
  organizationId: string;
  attendanceDate: Date;
  checkIn: Date;
  checkOut?: Date;
  workedHours: number;
  overtimeHours: number;
  lateMinutes: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY';
  workflowStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'LOCKED';
  approvedBy?: string;
  approvedAt?: Date;
  isPayrollProcessed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Leave {
  _id: string;
  employeeId: string;
  employee?: Employee;
  organizationId: string;
  leaveType: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'OTHER';
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deduction {
  _id: string;
  employeeId: string;
  employee?: Employee;
  organizationId: string;
  type: 'TAX' | 'PENSION' | 'LOAN' | 'INSURANCE' | 'OTHER';
  name: string;
  amount: number;
  frequency: 'ONE_TIME' | 'MONTHLY';
  effectiveFrom: Date;
  effectiveTo?: Date;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// src/types/index.ts
export interface Payroll {
  _id: string;
  organizationId: string;
  periodStart: Date;
  periodEnd: Date;
  employeeIds: string[];
  employees?: Employee[];
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PROCESSED' | 'PAID';
  items: Array<{
    employeeId: string;
    employee?: Employee;
    basicSalary: number;
    allowances: number;
    overtime: number;
    bonuses: number;
    deductions: number;
    netSalary: number;
    currency: string;
  }>;
  totalBasic: number;
  totalAllowances: number;
  totalOvertime: number;
  totalBonuses: number;
  totalDeductions: number;
  totalNetSalary: number;
  submittedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  processedBy?: string;
  paidBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payslip {
  _id: string;
  payrollId: string;
  employeeId: string;
  employee?: Employee;
  organizationId: string;
  periodStart: Date;
  periodEnd: Date;
  basicSalary: number;
  allowances: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  deductions: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  overtime: number;
  bonuses: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: 'GENERATED' | 'EMAILED' | 'VIEWED';
  pdfUrl: string;
  metadata: {
    fileName: string;
    fileSize: number;
    generatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  _id: string;
  actorId: string;
  actor?: User;
  action: string;
  resource: string;
  resourceId: string;
  metadata: Record<string, any>;
  ipAddress: string;
  timestamp: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  user?: User;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}