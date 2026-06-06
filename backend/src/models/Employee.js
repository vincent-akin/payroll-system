// models/Employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Operations']
    },
    position: {
        type: String,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true,
        min: [0, 'Salary cannot be negative']
    },
    joiningDate: {
        type: Date,
        required: true
    },
    bankAccount: {
        accountNumber: String,
        bankName: String,
        ifscCode: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
    }, {
    timestamps: true
    }
);

export const Employee = mongoose.model('Employee', employeeSchema);