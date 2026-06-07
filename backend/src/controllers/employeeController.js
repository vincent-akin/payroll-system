import { Employee } from '../models/Employee.js';
import { AppError } from '../middlewares/errorHandler.js';

export const employeeController = {
  // Get all employees
    async getAllEmployees(req, res, next) {
        try {
            const { page = 1, limit = 10, department, isActive } = req.query;
            
            const filter = {};
            if (department) filter.department = department;
            if (isActive !== undefined) filter.isActive = isActive === 'true';
            
            const employees = await Employee.find(filter)
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);
            
            const total = await Employee.countDocuments(filter);
            
            res.status(200).json({
                success: true,
                data: employees,
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
    
    // Get employee by ID
    async getEmployeeById(req, res, next) {
        try {
            const { id } = req.params;
            
            const employee = await Employee.findById(id);
            
            if (!employee) {
                throw new AppError('Employee not found', 404);
            }
            
            res.status(200).json({
                success: true,
                data: employee
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Create new employee
    async createEmployee(req, res, next) {
        try {
            // Generate employee ID
            const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
            const lastId = lastEmployee ? parseInt(lastEmployee.employeeId.split('-')[1]) : 0;
            const employeeId = `EMP-${String(lastId + 1).padStart(4, '0')}`;
            
            const employeeData = { ...req.body, employeeId };
            const employee = await Employee.create(employeeData);
            
            res.status(201).json({
                success: true,
                message: 'Employee created successfully',
                data: employee
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Update employee
    async updateEmployee(req, res, next) {
        try {
            const { id } = req.params;
            
            const employee = await Employee.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );
            
            if (!employee) {
                throw new AppError('Employee not found', 404);
            }
            
            res.status(200).json({
                success: true,
                message: 'Employee updated successfully',
                data: employee
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Delete employee (soft delete)
    async deleteEmployee(req, res, next) {
        try {
        const { id } = req.params;
        
        const employee = await Employee.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
        
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }
        
        res.status(200).json({
            success: true,
            message: 'Employee deactivated successfully'
        });
        } catch (error) {
        next(error);
        }
    },
    
    // Get employee statistics
    async getEmployeeStats(req, res, next) {
        try {
            const stats = await Employee.aggregate([
                {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 },
                    avgSalary: { $avg: '$basicSalary' },
                    totalSalary: { $sum: '$basicSalary' }
                }
                }
            ]);
            
            const totalEmployees = await Employee.countDocuments();
            const activeEmployees = await Employee.countDocuments({ isActive: true });
            
            res.status(200).json({
                success: true,
                data: {
                    totalEmployees,
                    activeEmployees,
                    departmentWise: stats,
                    departments: [...new Set(stats.map(s => s._id))]
                }
            });
        } catch (error) {
            next(error);
        }
    }
};