// backend/src/modules/attendance/attendance.model.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendanceDate: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: Date,
  workedHours: {
    type: Number,
    default: 0,
  },
  overtimeHours: {
    type: Number,
    default: 0,
  },
  lateMinutes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE', 'HOLIDAY'],
    default: 'PRESENT',
  },
  workflowStatus: {
    type: String,
    enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'LOCKED'],
    default: 'DRAFT',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: Date,
  isPayrollProcessed: {
    type: Boolean,
    default: false,
  },
  notes: String,
}, {
  timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;