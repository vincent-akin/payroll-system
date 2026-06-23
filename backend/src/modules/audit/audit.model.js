// backend/src/modules/audit/audit.model.js
import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  actorDetails: {
    firstName: String,
    lastName: String,
    email: String,
    role: String
  },
  action: {
    type: String,
    required: true,
    enum: [
      'EMPLOYEE_CREATED',
      'EMPLOYEE_UPDATED',
      'EMPLOYEE_TERMINATED',
      'LEAVE_CREATED',
      'LEAVE_APPROVED',
      'LEAVE_REJECTED',
      'PAYROLL_GENERATED',
      'PAYROLL_SUBMITTED',
      'PAYROLL_REVIEWED',
      'PAYROLL_APPROVED',
      'PAYROLL_PROCESSED',
      'PAYROLL_PAID',
      'DEDUCTION_CREATED',
      'DEDUCTION_ACTIVATED',
      'DEDUCTION_DEACTIVATED',
      'SALARY_STRUCTURE_CREATED',
      'SALARY_STRUCTURE_SUBMITTED',
      'SALARY_STRUCTURE_APPROVED',
      'USER_LOGIN',
      'USER_LOGOUT',
      'PASSWORD_CHANGED',
      'ROLE_ASSIGNED',
      'PERMISSION_CHANGED'
    ],
    index: true
  },
  resource: {
    type: String,
    required: true,
    enum: [
      'EMPLOYEE',
      'LEAVE',
      'PAYROLL',
      'DEDUCTION',
      'SALARY_STRUCTURE',
      'USER',
      'ROLE',
      'ATTENDANCE',
      'DEPARTMENT',
      'ORGANIZATION'
    ],
    index: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE'],
    default: 'SUCCESS'
  },
  error: {
    type: String,
    default: null
  },
  duration: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
auditSchema.index({ actorId: 1, createdAt: -1 });
auditSchema.index({ resource: 1, resourceId: 1 });
auditSchema.index({ action: 1, createdAt: -1 });

// TTL index to automatically archive/delete old logs (after 1 year)
auditSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

export const Audit = mongoose.model('Audit', auditSchema);