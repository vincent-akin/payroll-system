import mongoose from 'mongoose';

const AllowanceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'HOUSING',
        'TRANSPORT',
        'MEAL',
        'UTILITY',
        'MEDICAL',
        'OTHER'
      ],
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const DeductionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'TAX',
        'PENSION',
        'LOAN',
        'INSURANCE',
        'OTHER'
      ],
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const SalaryStructureSchema =
  new mongoose.Schema(
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        index: true
      },

      version: {
        type: Number,
        required: true
      },

      currency: {
        type: String,
        default: 'NGN'
      },

      payFrequency: {
        type: String,
        enum: [
          'WEEKLY',
          'BI_WEEKLY',
          'MONTHLY'
        ],
        default: 'MONTHLY'
      },

      basicSalary: {
        type: Number,
        required: true,
        min: 0
      },

      allowances: [AllowanceSchema],

      deductions: [DeductionSchema],

      grossSalary: {
        type: Number,
        required: true,
        min: 0
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
        enum: [
          'DRAFT',
          'SUBMITTED',
          'APPROVED',
          'REJECTED',
          'ARCHIVED'
        ],
        default: 'DRAFT'
      },

      isCurrent: {
        type: Boolean,
        default: false
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },

      approvedAt: Date,

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

SalaryStructureSchema.index({
  employeeId: 1,
  version: 1
});

export default mongoose.model(
  'SalaryStructure',
  SalaryStructureSchema
);