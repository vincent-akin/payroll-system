import { Employee } from '../models/Employee.js';
import { AppError } from '../middlewares/errorHandler.js';

export const employeeService = {
    async getAllEmployees(filters = {}) {
        const { department, isActive, search } = filters;
        const query = {};
        
        if (department) query.department = department;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { employeeId: { $regex: search, $options: 'i' } }
        ];
        }
        
        return await Employee.find(query).sort({ createdAt: -1 });
    },
    
    async getEmployeeById(id) {
        const employee = await Employee.findById(id);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }
        return employee;
    },
    
    async createEmployee(employeeData) {
        // Generate employee ID
        const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
        const lastId = lastEmployee ? parseInt(lastEmployee.employeeId.split('-')[1]) : 0;
        const employeeId = `EMP-${String(lastId + 1).padStart(4, '0')}`;
        
        // Check for duplicate email
        const existingEmployee = await Employee.findOne({ email: employeeData.email });
        if (existingEmployee) {
            throw new AppError('Employee with this email already exists', 400);
        }
        
        const employee = await Employee.create({ ...employeeData, employeeId });
        return employee;
    },
    
    async updateEmployee(id, updateData) {
        const employee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }
        
        return employee;
    },
    
    async deleteEmployee(id) {
        const employee = await Employee.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
        
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }
        
        return employee;
    },
    
    async getEmployeeStats() {
        const stats = await Employee.aggregate([
            {
                $group: {
                _id: '$department',
                count: { $sum: 1 },
                avgSalary: { $avg: '$basicSalary' },
                totalSalary: { $sum: '$basicSalary' },
                minSalary: { $min: '$basicSalary' },
                maxSalary: { $max: '$basicSalary' }
                }
            }
        ]);
        
        const totalEmployees = await Employee.countDocuments();
        const activeEmployees = await Employee.countDocuments({ isActive: true });
        const totalSalary = await Employee.aggregate([
        { $group: { _id: null, total: { $sum: '$basicSalary' } } }
        ]);
        
        return {
            totalEmployees,
            activeEmployees,
            inactiveEmployees: totalEmployees - activeEmployees,
            totalMonthlySalary: totalSalary[0]?.total || 0,
            departmentWise: stats
        };
    },
    
    async getEmployeesByDepartment(department) {
        return await Employee.find({ department, isActive: true });
    },
    
    async searchEmployees(searchTerm) {
        return await Employee.find({
            $or: [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { employeeId: { $regex: searchTerm, $options: 'i' } }
            ]
        });
    }
};