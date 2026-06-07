import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../middlewares/errorHandler.js';

export const authService = {
    async register(userData) {
        const existingUser = await User.findOne({ 
            $or: [{ email: userData.email }, { username: userData.username }] 
        });
        
        if (existingUser) {
            throw new AppError('User already exists with this email or username', 400);
        }
        
        const user = await User.create(userData);
        const token = generateToken(user);
        
        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
                token
            };
    },
    
    async login(email, password) {
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }
        
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }
        
        const token = generateToken(user);
        
        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    }
};