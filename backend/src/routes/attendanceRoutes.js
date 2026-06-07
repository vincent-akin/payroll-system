import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { attendanceController } from '../controllers/attendanceController.js';

const router = express.Router();

router.use(authenticate);

router.post('/checkin', attendanceController.checkIn);
router.post('/checkout', attendanceController.checkOut);
router.get('/employee/:employeeId', authorize('admin', 'staff'), attendanceController.getEmployeeAttendance);
router.get('/summary', authorize('admin'), attendanceController.getMonthlySummary);

export default router;