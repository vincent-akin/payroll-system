import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';
import { AppError } from '../middlewares/errorHandler.js';

export const attendanceController = {
    // Check-in employee
    async checkIn(req, res, next) {
        try {
        const { employeeId } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
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
        
        res.status(200).json({
            success: true,
            message: 'Checked in successfully',
            data: attendance
        });
        } catch (error) {
        next(error);
        }
    },
    
    // Check-out employee
    async checkOut(req, res, next) {
        try {
        const { employeeId } = req.body;
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
        const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        
        // Calculate overtime (beyond 8 hours)
        const overtime = Math.max(0, workingHours - 8);
        
        attendance.checkOut = checkOutTime;
        attendance.workingHours = workingHours;
        attendance.overtime = overtime;
        
        // Update status based on working hours
        if (workingHours < 4) {
            attendance.status = 'half-day';
        } else if (workingHours < 8) {
            attendance.status = 'late';
        }
        
        await attendance.save();
        
        res.status(200).json({
            success: true,
            message: 'Checked out successfully',
            data: attendance
        });
        } catch (error) {
        next(error);
        }
    },
    
    // Get attendance for an employee
    async getEmployeeAttendance(req, res, next) {
        try {
        const { employeeId } = req.params;
        const { startDate, endDate, month, year } = req.query;
        
        let filter = { employeeId };
        
        if (startDate && endDate) {
            filter.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
            };
        } else if (month && year) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0);
            filter.date = { $gte: start, $lte: end };
        }
        
        const attendance = await Attendance.find(filter).sort({ date: -1 });
        
        // Calculate statistics
        const stats = {
            totalDays: attendance.length,
            present: attendance.filter(a => a.status === 'present').length,
            absent: attendance.filter(a => a.status === 'absent').length,
            late: attendance.filter(a => a.status === 'late').length,
            halfDay: attendance.filter(a => a.status === 'half-day').length,
            totalOvertime: attendance.reduce((sum, a) => sum + a.overtime, 0),
            totalWorkingHours: attendance.reduce((sum, a) => sum + a.workingHours, 0)
        };
        
        res.status(200).json({
            success: true,
            data: attendance,
            stats
        });
        } catch (error) {
        next(error);
        }
    },
    
    // Get monthly attendance summary
    async getMonthlySummary(req, res, next) {
        try {
        const { month, year, department } = req.query;
        
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
                attendanceRate: {
                $avg: { $cond: [{ $eq: ['$status', 'present'] }, 100, 0] }
                }
            }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: summary[0] || {},
            period: { month, year }
        });
        } catch (error) {
            next(error);
        }
    }
};