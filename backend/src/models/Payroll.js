import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    allowances: {
        houseRent: { type: Number, default: 0 },
        travel: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    deductions: {
        tax: { type: Number, default: 0 },
        insurance: { type: Number, default: 0 },
        loan: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    attendanceBonus: {
        type: Number,
        default: 0
    },
    overtimePay: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    totalDeductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['bank', 'cash', 'cheque'],
        default: 'bank'
    },
    paymentDate: Date,
    status: {
        type: String,
        enum: ['pending', 'processed', 'paid', 'cancelled'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String
    }, {
    timestamps: true
    }
);

    // Business logic: Calculate net salary before saving
    payrollSchema.pre('save', function(next) {
    // Calculate total earnings
    const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
    this.totalEarnings = this.basicSalary + totalAllowances + this.attendanceBonus + this.overtimePay;
    
    // Calculate total deductions
    this.totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
    
    // Calculate net salary
    this.netSalary = this.totalEarnings - this.totalDeductions;
    
    // Validate net salary cannot be negative
    if (this.netSalary < 0) {
        throw new Error('Net salary cannot be negative. Please check deductions.');
    }
    
    next();
});

export const Payroll = mongoose.model('Payroll', payrollSchema);