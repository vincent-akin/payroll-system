// backend/src/routes/employeeRoutes.js
import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { employeeController } from '../controllers/employeeController.js';
import { employeeValidationRules, validateRequest } from '../middlewares/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin', 'staff'), employeeController.getAllEmployees);
router.get('/stats', authorize('admin'), employeeController.getEmployeeStats);
router.get('/:id', authorize('admin', 'staff'), employeeController.getEmployeeById);
router.post('/', authorize('admin'), employeeValidationRules(), validateRequest, employeeController.createEmployee);
router.put('/:id', authorize('admin'), employeeValidationRules(), validateRequest, employeeController.updateEmployee);
router.delete('/:id', authorize('admin'), employeeController.deleteEmployee);

export default router;