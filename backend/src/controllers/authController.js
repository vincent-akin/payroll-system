import { authService } from '../services/authService.js';

export const authController = {
    async register(req, res, next) {
        try {
        const result = await authService.register(req.body);
        res.status(201).json({ success: true, data: result });
        } catch (error) {
        next(error);
        }
    },
    
    async login(req, res, next) {
        try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json({ success: true, data: result });
        } catch (error) {
        next(error);
        }
    }
};