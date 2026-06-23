import Role from './role.model.js';
import permissions from './role.permissions.js';

const roles = [
    {
        name: 'SUPER_ADMIN',
        description: 'System administrator',
        permissions: Object.values(permissions),
    },

    {
        name: 'HR_MANAGER',
        description: 'Human resource manager',
        permissions: [
            permissions.EMPLOYEES_VIEW,
            permissions.EMPLOYEES_CREATE,
            permissions.EMPLOYEES_UPDATE,

            permissions.LEAVE_VIEW,
            permissions.LEAVE_APPROVE,

            permissions.DEPARTMENTS_VIEW,
            permissions.DEPARTMENTS_CREATE,
            permissions.DEPARTMENTS_UPDATE,

            permissions.REPORTS_VIEW,
        ],
    },

    {
        name: 'PAYROLL_OFFICER',
        description: 'Payroll operations',
        permissions: [
            permissions.PAYROLL_VIEW,
            permissions.PAYROLL_CREATE,
            permissions.REPORTS_VIEW,
        ],
    },

    {
        name: 'FINANCE_OFFICER',
        description: 'Payroll approval and payment',
        permissions: [
            permissions.PAYROLL_VIEW,
            permissions.PAYROLL_APPROVE,
            permissions.PAYROLL_PAY,
            permissions.REPORTS_VIEW,
        ],
    },

    {
        name: 'EMPLOYEE',
        description: 'Employee self-service',
        permissions: [
            permissions.LEAVE_CREATE,
            permissions.LEAVE_VIEW,
        ],
    },
];

export const seedRoles = async () => {
    for (const role of roles) {
        const exists = await Role.findOne({
            name: role.name,
        });

        if (!exists) {
            await Role.create(role);
        }
    }
};

export default seedRoles;