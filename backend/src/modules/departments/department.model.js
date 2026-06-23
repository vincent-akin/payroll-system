import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },

        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },

        headOfDepartment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

departmentSchema.index({ organizationId: 1, code: 1 }, { unique: true });

export default mongoose.model('Department', departmentSchema);