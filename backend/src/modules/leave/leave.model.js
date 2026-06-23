import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true
    },

    leaveType: {
      type: String,
      enum: [
        'ANNUAL',
        'SICK',
        'MATERNITY',
        'PATERNITY',
        'COMPASSIONATE',
        'UNPAID'
      ],
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    totalDays: {
      type: Number,
      required: true
    },

    reason: {
      type: String,
      trim: true,
      required: true
    },

    status: {
      type: String,
      enum: [
        'PENDING',
        'APPROVED',
        'REJECTED',
        'CANCELLED'
      ],
      default: 'PENDING'
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    approvedAt: Date,

    rejectionReason: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  'Leave',
  LeaveSchema
);