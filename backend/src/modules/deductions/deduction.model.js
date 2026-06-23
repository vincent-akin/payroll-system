// backend/src/modules/deductions/deduction.model.js
import mongoose from 'mongoose';

const deductionSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['TAX', 'PENSION', 'LOAN', 'INSURANCE', 'OTHER'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  frequency: {
    type: String,
    enum: ['ONE_TIME', 'MONTHLY'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  effectiveFrom: {
    type: Date,
    required: true
  },
  effectiveTo: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
    default: 'DRAFT'
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
  createdBy: {
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

// Indexes for performance
deductionSchema.index({ employeeId: 1, status: 1 });
deductionSchema.index({ organizationId: 1, status: 1 });
deductionSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

// Virtual for isActive
deductionSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'ACTIVE' && 
         this.effectiveFrom <= now && 
         (!this.effectiveTo || this.effectiveTo > now);
});

// Ensure effectiveTo is after effectiveFrom
deductionSchema.pre('save', function(next) {
  if (this.effectiveTo && this.effectiveTo <= this.effectiveFrom) {
    return next(new Error('effectiveTo must be after effectiveFrom'));
  }
  next();
});

export const Deduction = mongoose.model('Deduction', deductionSchema);