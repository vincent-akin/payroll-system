import { payrollService } from '../services/payrollService.js';
import { Payroll } from '../models/Payroll.js';
import { AppError } from '../middlewares/errorHandler.js';

export const payrollController = {
    // Process payroll for an employee
    async processPayroll(req, res, next) {
        try {
            const { employeeId, month, year } = req.body;
            const userId = req.user.id;
            
            // Validate input
            if (!employeeId || !month || !year) {
                throw new AppError('Employee ID, month, and year are required', 400);
            }
        
            if (month < 1 || month > 12) {
                throw new AppError('Month must be between 1 and 12', 400);
            }
            
            if (year < 2000 || year > 2100) {
                throw new AppError('Invalid year', 400);
            }
            
            const payroll = await payrollService.processPayroll(employeeId, month, year, userId);
            
            res.status(201).json({
                success: true,
                message: 'Payroll processed successfully',
                data: payroll
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Get all payroll records with filtering
    async getAllPayrolls(req, res, next) {
        try {
            const { page = 1, limit = 10, status, year, month } = req.query;
            
            const filter = {};
            if (status) filter.status = status;
            if (year) filter.year = parseInt(year);
            if (month) filter.month = parseInt(month);
            
            const payrolls = await Payroll.find(filter)
                .populate('employeeId', 'firstName lastName employeeId department')
                .populate('approvedBy', 'username email')
                .sort({ year: -1, month: -1, createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);
            
            const total = await Payroll.countDocuments(filter);
            
            res.status(200).json({
                success: true,
                data: payrolls,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Get payroll for specific employee
    async getEmployeePayrolls(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { year } = req.query;
            
            const filter = { employeeId };
            if (year) filter.year = parseInt(year);
            
            const payrolls = await Payroll.find(filter)
                .populate('employeeId', 'firstName lastName employeeId department basicSalary')
                .sort({ year: -1, month: -1 });
            
            if (!payrolls.length) {
                return res.status(404).json({
                success: false,
                message: 'No payroll records found for this employee'
                });
            }
            
            // Calculate summary statistics
            const summary = {
                totalPaid: payrolls.reduce((sum, p) => sum + p.netSalary, 0),
                averageSalary: payrolls.reduce((sum, p) => sum + p.netSalary, 0) / payrolls.length,
                totalRecords: payrolls.length,
                lastPayment: payrolls[0]?.paymentDate || null
            };
            
            res.status(200).json({
                success: true,
                data: payrolls,
                summary
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Update payroll status
    async updatePayrollStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status, paymentDate, paymentMethod, notes } = req.body;
            
            const validStatuses = ['pending', 'processed', 'paid', 'cancelled'];
            if (!validStatuses.includes(status)) {
                throw new AppError('Invalid status', 400);
            }
            
            const payroll = await Payroll.findById(id);
            
            if (!payroll) {
                throw new AppError('Payroll record not found', 404);
            }
            
            // Business rule: Cannot modify paid payroll
            if (payroll.status === 'paid' && status !== 'paid') {
                throw new AppError('Cannot modify a paid payroll record', 400);
            }
            
            payroll.status = status;
            if (paymentDate) payroll.paymentDate = paymentDate;
            if (paymentMethod) payroll.paymentMethod = paymentMethod;
            if (notes) payroll.notes = notes;
            
            await payroll.save();
            
            res.status(200).json({
                success: true,
                message: 'Payroll status updated successfully',
                data: payroll
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Get payroll summary for dashboard
    async getPayrollSummary(req, res, next) {
        try {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            
            // Monthly summary for current year
            const monthlySummary = await Payroll.aggregate([
                {
                $match: {
                    year: currentYear,
                    status: { $in: ['processed', 'paid'] }
                }
                },
                {
                $group: {
                    _id: { month: '$month' },
                    totalSalary: { $sum: '$netSalary' },
                    count: { $sum: 1 },
                    averageSalary: { $avg: '$netSalary' }
                }
                },
                { $sort: { '_id.month': 1 } }
            ]);
            
            // Overall statistics
            const stats = await Payroll.aggregate([
                {
                $group: {
                    _id: null,
                    totalPaid: { $sum: '$netSalary' },
                    totalRecords: { $sum: 1 },
                    averageSalary: { $avg: '$netSalary' },
                    maxSalary: { $max: '$netSalary' },
                    minSalary: { $min: '$netSalary' }
                }
                }
            ]);
            
            res.status(200).json({
                success: true,
                data: {
                currentYear,
                currentMonth,
                monthlySummary,
                overallStats: stats[0] || {},
                pendingPayrolls: await Payroll.countDocuments({ status: 'pending' }),
                processedPayrolls: await Payroll.countDocuments({ status: 'processed' }),
                paidPayrolls: await Payroll.countDocuments({ status: 'paid' })
                }
            });
            } catch (error) {
            next(error);
            }
        },
        
        // Generate payslip for an employee
        async generatePayslip(req, res, next) {
            try {
            const { id } = req.params;
            
            const payroll = await Payroll.findById(id)
                .populate('employeeId', 'firstName lastName employeeId department position bankAccount')
                .populate('approvedBy', 'username');
            
            if (!payroll) {
                throw new AppError('Payroll record not found', 404);
            }
            
            // Format payslip data
            const payslip = {
                payrollId: payroll._id,
                employee: {
                    name: `${payroll.employeeId.firstName} ${payroll.employeeId.lastName}`,
                    id: payroll.employeeId.employeeId,
                    department: payroll.employeeId.department,
                    position: payroll.employeeId.position,
                    bankAccount: payroll.employeeId.bankAccount
                },
                period: {
                    month: payroll.month,
                    year: payroll.year
                },
                earnings: {
                    basicSalary: payroll.basicSalary,
                    allowances: payroll.allowances,
                    attendanceBonus: payroll.attendanceBonus,
                    overtimePay: payroll.overtimePay,
                    totalEarnings: payroll.totalEarnings
                },
                deductions: {
                    tax: payroll.deductions.tax,
                    insurance: payroll.deductions.insurance,
                    loan: payroll.deductions.loan,
                    other: payroll.deductions.other,
                    totalDeductions: payroll.totalDeductions
                },
                netSalary: payroll.netSalary,
                paymentDetails: {
                    method: payroll.paymentMethod,
                    date: payroll.paymentDate,
                    status: payroll.status
                },
                generatedDate: new Date()
            };
            
            res.status(200).json({
                success: true,
                data: payslip
            });
        } catch (error) {
            next(error);
        }
    }
};