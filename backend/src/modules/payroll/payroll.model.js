// backend/src/modules/payroll/payroll.model.js
import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  period: {
    year: { type: Number, required: true },
    month: { type: Number, required: true, min: 1, max: 12 }
  },
  salaryStructureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalaryStructure',
    required: true
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  allowances: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  totalAllowances: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: [{
    deductionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deduction'
    },
    type: String,
    amount: Number,
    description: String
  }],
  totalDeductions: {
    type: Number,
    default: 0,
    min: 0
  },
  attendance: {
    workedDays: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    lateMinutes: { type: Number, default: 0 }
  },
  leaveDays: {
    taken: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    unpaid: { type: Number, default: 0 }
  },
  netSalary: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSED', 'PAID'],
    default: 'DRAFT'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  submittedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },
  paymentReference: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    maxlength: 1000,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound unique index for employee + period
payrollSchema.index({ employeeId: 1, 'period.year': 1, 'period.month': 1 }, { unique: true });

// Indexes for reporting
payrollSchema.index({ organizationId: 1, 'period.year': 1, 'period.month': 1 });
payrollSchema.index({ status: 1 });

// Pre-save middleware to calculate net salary
payrollSchema.pre('save', function(next) {
  this.netSalary = this.baseSalary + this.totalAllowances - this.totalDeductions;
  next();
});

export const Payroll = mongoose.model('Payroll', payrollSchema);