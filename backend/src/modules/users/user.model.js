import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLoginAt: {
            type: Date,
            default: null,
        },

        refreshTokenHash: {
            type: String,
            default: null,
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User = mongoose.model('User', userSchema);

export default User;