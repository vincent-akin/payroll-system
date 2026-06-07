// routes/payrollRoutes.js
import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { payrollController } from '../controllers/payrollController.js';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /payroll:
 *   post:
 *     summary: Process payroll for an employee
 *     tags: [Payroll]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - month
 *               - year
 *             properties:
 *               employeeId:
 *                 type: string
 *               month:
 *                 type: number
 *               year:
 *                 type: number
 *     responses:
 *       201:
 *         description: Payroll processed successfully
 */
router.post('/', authorize('admin', 'staff'), payrollController.processPayroll);

router.get('/', authorize('admin', 'staff'), payrollController.getAllPayrolls);
router.get('/employee/:employeeId', payrollController.getEmployeePayrolls);
router.put('/:id/status', authorize('admin'), payrollController.updatePayrollStatus);

export default router;