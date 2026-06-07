import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';
import bcrypt from 'bcryptjs';

export const userService = {
    async getAllUsers(filters = {}) {
        const { role, isActive } = filters;
        const query = {};
        
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        
        return await User.find(query).select('-password').sort({ createdAt: -1 });
    },
    
    async getUserById(id) {
        const user = await User.findById(id).select('-password');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    },
    
    async createUser(userData) {
        // Check if user exists
        const existingUser = await User.findOne({ 
        $or: [{ email: userData.email }, { username: userData.username }] 
        });
        
        if (existingUser) {
            throw new AppError('User already exists with this email or username', 400);
        }
        
        const user = await User.create(userData);
        const userObject = user.toObject();
        delete userObject.password;
        
        return userObject;
    },
    
    async updateUser(id, updateData) {
        // Don't allow password update through this method
        const { password, ...safeUpdateData } = updateData;
        
        const user = await User.findByIdAndUpdate(
            id,
            safeUpdateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            throw new AppError('User not found', 404);
        }
        
        return user;
    },
    
    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    },
    
    async updatePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new AppError('User not found', 404);
        }
        
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            throw new AppError('Current password is incorrect', 401);
        }
        
        user.password = newPassword;
        await user.save();
        
        return true;
    },
    
    async getUserStats() {
        const totalUsers = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });
        const staffCount = await User.countDocuments({ role: 'staff' });
        const userCount = await User.countDocuments({ role: 'user' });
        const activeUsers = await User.countDocuments({ isActive: true });
        
        return {
            totalUsers,
            adminCount,
            staffCount,
            userCount,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers
        };
    }
};