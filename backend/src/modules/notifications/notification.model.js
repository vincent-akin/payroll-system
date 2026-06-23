// backend/src/modules/notifications/notification.model.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'LEAVE_APPROVED',
      'LEAVE_REJECTED',
      'LEAVE_PENDING',
      'PAYROLL_SUBMITTED',
      'PAYROLL_APPROVED',
      'PAYROLL_PAID',
      'PAYROLL_REJECTED',
      'PAYSLIP_GENERATED',
      'PASSWORD_CHANGED',
      'EMPLOYEE_CREATED',
      'EMPLOYEE_TERMINATED',
      'DEDUCTION_ACTIVATED',
      'DEDUCTION_DEACTIVATED'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  link: {
    type: String,
    default: null
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  sourceType: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);