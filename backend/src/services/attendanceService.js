import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';
import { AppError } from '../middlewares/errorHandler.js';

export const attendanceService = {
  async checkIn(employeeId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }
    
    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: today
    });
    
    if (existingAttendance && existingAttendance.checkIn) {
      throw new AppError('Already checked in today', 400);
    }
    
    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: today },
      { 
        checkIn: new Date(),
        status: 'present'
      },
      { upsert: true, new: true }
    );
    
    return attendance;
  },
  
  async checkOut(employeeId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employeeId,
      date: today
    });
    
    if (!attendance) {
      throw new AppError('No check-in record found for today', 404);
    }
    
    if (attendance.checkOut) {
      throw new AppError('Already checked out today', 400);
    }
    
    const checkOutTime = new Date();
    const checkInTime = new Date(attendance.checkIn);
    const workingHours = parseFloat(((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2));
    
    // Calculate overtime (beyond 8 hours)
    const overtime = parseFloat((Math.max(0, workingHours - 8)).toFixed(2));
    
    attendance.checkOut = checkOutTime;
    attendance.workingHours = workingHours;
    attendance.overtime = overtime;
    
    // Update status based on working hours
    if (workingHours < 4) {
      attendance.status = 'half-day';
    } else if (workingHours < 8) {
      attendance.status = 'late';
    } else {
      attendance.status = 'present';
    }
    
    await attendance.save();
    
    return attendance;
  },
  
  async getEmployeeAttendance(employeeId, filters = {}) {
    const { startDate, endDate, month, year } = filters;
    let query = { employeeId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.date = { $gte: start, $lte: end };
    }
    
    const attendance = await Attendance.find(query).sort({ date: -1 });
    
    // Calculate statistics
    const stats = {
      totalDays: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      totalOvertime: attendance.reduce((sum, a) => sum + a.overtime, 0),
      totalWorkingHours: attendance.reduce((sum, a) => sum + a.workingHours, 0),
      attendanceRate: attendance.length > 0 
        ? ((attendance.filter(a => a.status === 'present').length / attendance.length) * 100).toFixed(2)
        : 0
    };
    
    return { attendance, stats };
  },
  
  async getMonthlySummary(month, year, department = null) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    let matchStage = {
      date: { $gte: startDate, $lte: endDate }
    };
    
    if (department) {
      const employees = await Employee.find({ department });
      const employeeIds = employees.map(e => e._id);
      matchStage.employeeId = { $in: employeeIds };
    }
    
    const summary = await Attendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
          totalLate: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
          totalHalfDay: { $sum: { $cond: [{ $eq: ['$status', 'half-day'] }, 1, 0] } },
          totalOvertime: { $sum: '$overtime' },
          totalWorkingHours: { $sum: '$workingHours' },
          averageWorkingHours: { $avg: '$workingHours' },
          attendanceRate: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'present'] },
                100,
                { $cond: [{ $eq: ['$status', 'late'] }, 50, 0] }
              ]
            }
          }
        }
      }
    ]);
    
    return {
      summary: summary[0] || {
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        totalHalfDay: 0,
        totalOvertime: 0,
        totalWorkingHours: 0,
        averageWorkingHours: 0,
        attendanceRate: 0
      },
      period: { month, year }
    };
  },
  
  async markAbsentForDate(date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const employees = await Employee.find({ isActive: true });
    const absences = [];
    
    for (const employee of employees) {
      const existing = await Attendance.findOne({
        employeeId: employee._id,
        date: targetDate
      });
      
      if (!existing) {
        const absence = await Attendance.create({
          employeeId: employee._id,
          date: targetDate,
          status: 'absent',
          workingHours: 0,
          overtime: 0
        });
        absences.push(absence);
      }
    }
    
    return absences;
  },
  
  async getAttendanceReport(startDate, endDate) {
    const report = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $group: {
          _id: '$employee.department',
          totalPresent: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
          totalLate: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
          totalOvertime: { $sum: '$overtime' },
          totalWorkingHours: { $sum: '$workingHours' }
        }
      }
    ]);
    
    return report;
  }
};