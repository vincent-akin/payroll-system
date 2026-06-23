import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true
    },

    attendanceDate: {
      type: Date,
      required: true,
      index: true
    },

    clockInAt: {
      type: Date
    },

    clockOutAt: {
      type: Date
    },

    workedHours: {
      type: Number,
      default: 0
    },

    overtimeHours: {
      type: Number,
      default: 0
    },

    lateMinutes: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        'PRESENT',
        'ABSENT',
        'LATE',
        'HALF_DAY',
        'LEAVE',
        'HOLIDAY'
      ],
      default: 'PRESENT'
    },

    workflowStatus: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'APPROVED',
        'LOCKED'
      ],
      default: 'DRAFT'
    },

    payrollProcessed: {
      type: Boolean,
      default: false
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    approvedAt: {
      type: Date
    },

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

AttendanceSchema.index(
  {
    employeeId: 1,
    attendanceDate: 1
  },
  {
    unique: true
  }
);

export default mongoose.model(
  'Attendance',
  AttendanceSchema
);