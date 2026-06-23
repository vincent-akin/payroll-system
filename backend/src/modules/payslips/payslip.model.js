// backend/src/modules/payslips/payslip.model.js
import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    index: true
  },
  payrollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payroll',
    required: true,
    unique: true,
    index: true
  },
  payslipNumber: {
    type: String,
    required: true,
    unique: true
  },
  period: {
    year: { type: Number, required: true },
    month: { type: Number, required: true }
  },
  employeeDetails: {
    firstName: String,
    lastName: String,
    email: String,
    employeeCode: String,
    department: String,
    position: String
  },
  earnings: {
    basicSalary: { type: Number, required: true },
    allowances: { type: mongoose.Schema.Types.Mixed, default: {} },
    totalEarnings: { type: Number, required: true },
    overtimePay: { type: Number, default: 0 }
  },
  deductions: {
    items: [{
      type: String,
      amount: Number,
      description: String
    }],
    totalDeductions: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    pension: { type: Number, default: 0 }
  },
  netSalary: {
    type: Number,
    required: true
  },
  paymentDetails: {
    bankName: String,
    accountNumber: String,
    paymentDate: Date,
    reference: String
  },
  pdfUrl: {
    type: String,
    default: null
  },
  pdfMetadata: {
    fileName: String,
    fileSize: Number,
    generatedAt: Date
  },
  status: {
    type: String,
    enum: ['GENERATED', 'EMAILED', 'VIEWED'],
    default: 'GENERATED'
  },
  viewedAt: {
    type: Date,
    default: null
  },
  emailedAt: {
    type: Date,
    default: null
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
payslipSchema.index({ employeeId: 1, 'period.year': 1, 'period.month': 1 });
payslipSchema.index({ status: 1 });

export const Payslip = mongoose.model('Payslip', payslipSchema);