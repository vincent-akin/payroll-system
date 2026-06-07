import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { AppError } from '../middlewares/errorHandler.js';

export const payrollService = {
    async calculateMonthlyPayroll(employeeId, month, year) {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }
        
        // Calculate attendance for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        
        const attendance = await Attendance.find({
            employeeId,
            date: { $gte: startDate, $lte: endDate }
        });
        
        // Calculate working days and overtime
        const totalWorkingDays = attendance.filter(a => a.status === 'present').length;
        const totalOvertimeHours = attendance.reduce((sum, a) => sum + a.overtime, 0);
        
        // Calculate attendance bonus (full attendance = 10% of basic salary)
        const attendanceBonus = totalWorkingDays === 22 ? employee.basicSalary * 0.1 : 0;
        
        // Calculate overtime pay (1.5x hourly rate)
        const hourlyRate = employee.basicSalary / (22 * 8);
        const overtimePay = totalOvertimeHours * hourlyRate * 1.5;
        
        // Calculate tax (10% if salary > 50000)
        const tax = employee.basicSalary > 50000 ? employee.basicSalary * 0.1 : 0;
        
        const payrollData = {
        employeeId,
        month,
        year,
        basicSalary: employee.basicSalary,
        allowances: {
            houseRent: employee.basicSalary * 0.3,
            travel: 2000,
            medical: 1500,
            other: 0
        },
        deductions: {
            tax,
            insurance: 1000,
            loan: 0,
            other: 0
        },
        attendanceBonus,
        overtimePay
        };
        
        return payrollData;
    },
    
    async processPayroll(employeeId, month, year, userId) {
        // Check if payroll already exists for this period
        const existingPayroll = await Payroll.findOne({ employeeId, month, year });
        if (existingPayroll) {
            throw new AppError('Payroll already processed for this period', 400);
        }
        
        const payrollData = await this.calculateMonthlyPayroll(employeeId, month, year);
        
        const payroll = await Payroll.create({
            ...payrollData,
            approvedBy: userId,
            status: 'processed'
        });
        
        return payroll;
    }
};