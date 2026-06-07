import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorHandler.js';

export const userController = {
  // Get all users (Admin only)
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role } = req.query;
      
      const filter = {};
      if (role) filter.role = role;
      
      const users = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      const total = await User.countDocuments(filter);
      
      res.status(200).json({
        success: true,
        data: users,
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
  
  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id).select('-password');
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Update user
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      
      // Don't allow password update through this endpoint
      const { password, ...updateData } = req.body;
      
      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Delete user (Admin only)
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Update password
  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await User.findById(req.user.id);
      
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new AppError('Current password is incorrect', 401);
      }
      
      user.password = newPassword;
      await user.save();
      
      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};