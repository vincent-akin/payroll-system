import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true
    },

    address: {
      type: String,
      trim: true
    },

    taxId: {
      type: String,
      trim: true
    },

    logoUrl: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

organizationSchema.index({ name: 1 });
organizationSchema.index({ code: 1 }, { unique: true });

export default mongoose.model(
  'Organization',
  organizationSchema
);