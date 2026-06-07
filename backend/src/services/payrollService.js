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
    const totalWorkingDays = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const totalOvertimeHours = attendance.reduce((sum, a) => sum + a.overtime, 0);
    
    // Calculate attendance bonus (full attendance = 10% of basic salary)
    const expectedWorkingDays = 22; // Average working days in a month
    const attendanceBonus = totalWorkingDays === expectedWorkingDays ? employee.basicSalary * 0.1 : 0;
    
    // Calculate overtime pay (1.5x hourly rate)
    const hourlyRate = employee.basicSalary / (expectedWorkingDays * 8);
    const overtimePay = totalOvertimeHours * hourlyRate * 1.5;
    
    // Calculate tax (10% if salary > 50000)
    const tax = employee.basicSalary > 50000 ? employee.basicSalary * 0.1 : 0;
    
    // Calculate allowances
    const allowances = {
      houseRent: employee.basicSalary * 0.3,
      travel: 2000,
      medical: 1500,
      other: 0
    };
    
    // Calculate deductions
    const deductions = {
      tax,
      insurance: 1000,
      loan: 0,
      other: 0
    };
    
    const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + val, 0);
    const totalEarnings = employee.basicSalary + totalAllowances + attendanceBonus + overtimePay;
    const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
    const netSalary = totalEarnings - totalDeductions;
    
    // Validate net salary
    if (netSalary < 0) {
      throw new AppError('Calculated net salary is negative. Please review deductions.', 400);
    }
    
    return {
      employeeId,
      month,
      year,
      basicSalary: employee.basicSalary,
      allowances,
      deductions,
      attendanceBonus,
      overtimePay,
      totalEarnings,
      totalDeductions,
      netSalary
    };
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
  },
  
  async processBulkPayroll(employeeIds, month, year, userId) {
    const results = [];
    const errors = [];
    
    for (const employeeId of employeeIds) {
      try {
        const payroll = await this.processPayroll(employeeId, month, year, userId);
        results.push(payroll);
      } catch (error) {
        errors.push({ employeeId, error: error.message });
      }
    }
    
    return {
      success: results,
      failed: errors,
      totalProcessed: results.length,
      totalFailed: errors.length
    };
  },
  
  async getAllPayrolls(filters = {}) {
    const { status, year, month, employeeId, startDate, endDate } = filters;
    const query = {};
    
    if (status) query.status = status;
    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);
    if (employeeId) query.employeeId = employeeId;
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const payrolls = await Payroll.find(query)
      .populate('employeeId', 'firstName lastName employeeId department position')
      .populate('approvedBy', 'username email')
      .sort({ year: -1, month: -1, createdAt: -1 });
    
    return payrolls;
  },
  
  async getPayrollById(id) {
    const payroll = await Payroll.findById(id)
      .populate('employeeId', 'firstName lastName employeeId department position bankAccount')
      .populate('approvedBy', 'username email');
    
    if (!payroll) {
      throw new AppError('Payroll record not found', 404);
    }
    
    return payroll;
  },
  
  async updatePayrollStatus(id, status, updateData = {}) {
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
    if (updateData.paymentDate) payroll.paymentDate = updateData.paymentDate;
    if (updateData.paymentMethod) payroll.paymentMethod = updateData.paymentMethod;
    if (updateData.notes) payroll.notes = updateData.notes;
    
    await payroll.save();
    
    return payroll;
  },
  
  async getPayrollSummary(year = null) {
    const targetYear = year || new Date().getFullYear();
    
    const monthlySummary = await Payroll.aggregate([
      {
        $match: {
          year: targetYear,
          status: { $in: ['processed', 'paid'] }
        }
      },
      {
        $group: {
          _id: { month: '$month' },
          totalSalary: { $sum: '$netSalary' },
          count: { $sum: 1 },
          averageSalary: { $avg: '$netSalary' },
          totalEarnings: { $sum: '$totalEarnings' },
          totalDeductions: { $sum: '$totalDeductions' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);
    
    const overallStats = await Payroll.aggregate([
      {
        $match: {
          status: { $in: ['processed', 'paid'] }
        }
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$netSalary' },
          totalRecords: { $sum: 1 },
          averageSalary: { $avg: '$netSalary' },
          maxSalary: { $max: '$netSalary' },
          minSalary: { $min: '$netSalary' },
          totalEarnings: { $sum: '$totalEarnings' },
          totalDeductions: { $sum: '$totalDeductions' }
        }
      }
    ]);
    
    const pendingCount = await Payroll.countDocuments({ status: 'pending' });
    const processedCount = await Payroll.countDocuments({ status: 'processed' });
    const paidCount = await Payroll.countDocuments({ status: 'paid' });
    const cancelledCount = await Payroll.countDocuments({ status: 'cancelled' });
    
    return {
      year: targetYear,
      monthlySummary,
      overallStats: overallStats[0] || {},
      statusBreakdown: {
        pending: pendingCount,
        processed: processedCount,
        paid: paidCount,
        cancelled: cancelledCount
      }
    };
  },
  
  async generatePayslip(payrollId) {
    const payroll = await this.getPayrollById(payrollId);
    
    return {
      payrollId: payroll._id,
      generatedDate: new Date(),
      employee: {
        name: `${payroll.employeeId.firstName} ${payroll.employeeId.lastName}`,
        id: payroll.employeeId.employeeId,
        department: payroll.employeeId.department,
        position: payroll.employeeId.position,
        joiningDate: payroll.employeeId.joiningDate,
        bankAccount: payroll.employeeId.bankAccount
      },
      period: {
        month: payroll.month,
        year: payroll.year,
        monthName: new Date(payroll.year, payroll.month - 1, 1).toLocaleString('default', { month: 'long' })
      },
      earnings: {
        basicSalary: payroll.basicSalary,
        allowances: payroll.allowances,
        attendanceBonus: payroll.attendanceBonus,
        overtimePay: payroll.overtimePay,
        totalEarnings: payroll.totalEarnings,
        breakdown: [
          { item: 'Basic Salary', amount: payroll.basicSalary },
          { item: 'House Rent Allowance', amount: payroll.allowances.houseRent },
          { item: 'Travel Allowance', amount: payroll.allowances.travel },
          { item: 'Medical Allowance', amount: payroll.allowances.medical },
          { item: 'Attendance Bonus', amount: payroll.attendanceBonus },
          { item: 'Overtime Pay', amount: payroll.overtimePay }
        ]
      },
      deductions: {
        tax: payroll.deductions.tax,
        insurance: payroll.deductions.insurance,
        loan: payroll.deductions.loan,
        other: payroll.deductions.other,
        totalDeductions: payroll.totalDeductions,
        breakdown: [
          { item: 'Tax Deduction', amount: payroll.deductions.tax },
          { item: 'Insurance', amount: payroll.deductions.insurance },
          { item: 'Loan Repayment', amount: payroll.deductions.loan },
          { item: 'Other Deductions', amount: payroll.deductions.other }
        ]
      },
      netSalary: payroll.netSalary,
      netSalaryInWords: this.numberToWords(payroll.netSalary),
      paymentDetails: {
        method: payroll.paymentMethod,
        date: payroll.paymentDate,
        status: payroll.status
      },
      approval: {
        approvedBy: payroll.approvedBy?.username || 'System',
        approvedDate: payroll.updatedAt
      }
    };
  },
  
  numberToWords(num) {
    // Simple number to words converter for payslip
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    
    const convert = (n) => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    };
    
    return convert(Math.floor(num)) + ' Rupees Only';
  }
};