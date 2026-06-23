import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import employeeRoutes from '../modules/employees/employee.routes.js';
import departmentRoutes from '../modules/departments/department.routes.js';
import payrollRoutes from '../modules/payroll/payroll.routes.js';
import leaveRoutes from '../modules/leave/leave.routes.js';
import deductionRoutes from '../modules/deductions/deduction.routes.js';
import roleRoutes from '../modules/roles/role.routes.js';
import organizationRoutes from '../modules/organizations/organization.routes.js';
import salaryStructureRoutes from '../modules/salary-structures/salaryStructure.routes.js';
import attendanceRoutes from '../modules/attendance/attendance.routes.js';
import payslipRoutes from '../modules/payslips/payslip.routes.js';
import notificationRoutes from '../modules/notifications/notification.routes.js';
import reportRoutes from '../modules/reports/report.routes.js';
import auditRoutes from '../modules/audit/audit.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/payrolls', payrollRoutes);
router.use('/leave-requests', leaveRoutes);
router.use('/deductions', deductionRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/salary-structures', salaryStructureRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/payslips', payslipRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/audit', auditRoutes);





export default router;