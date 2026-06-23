import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    employeeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true
    },

    employmentType: {
      type: String,
      enum: [
        'FULL_TIME',
        'PART_TIME',
        'CONTRACT',
        'INTERN'
      ],
      default: 'FULL_TIME'
    },

    hireDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: [
        'ACTIVE',
        'ON_LEAVE',
        'SUSPENDED',
        'TERMINATED'
      ],
      default: 'ACTIVE'
    },

    dateOfBirth: {
      type: Date
    },

    gender: {
      type: String,
      enum: [
        'MALE',
        'FEMALE',
        'OTHER'
      ]
    },

    address: {
      type: String,
      trim: true
    },

    emergencyContactName: {
      type: String,
      trim: true
    },

    emergencyContactPhone: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

employeeSchema.index(
  {
    organizationId: 1,
    employeeNumber: 1
  },
  {
    unique: true
  }
);

employeeSchema.index({
  organizationId: 1,
  departmentId: 1
});

export default mongoose.model(
  'Employee',
  employeeSchema
);