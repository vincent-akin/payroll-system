// backend/src/modules/roles/seedRoles.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Role from './role.model.js';

// Load environment variables
dotenv.config();

const seedRoles = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing roles
    await Role.deleteMany({});
    console.log('✅ Cleared existing roles');

    const roles = [
      {
        name: 'SUPER_ADMIN',
        permissions: ['*'],
        description: 'Super Administrator with full system access',
      },
      {
        name: 'HR_MANAGER',
        permissions: [
          'view_employees',
          'create_employee',
          'update_employee',
          'delete_employee',
          'view_attendance',
          'create_attendance',
          'update_attendance',
          'view_leave',
          'approve_leave',
          'reject_leave',
          'view_salary',
          'create_salary',
          'update_salary',
          'view_reports',
          'view_payroll',
          'view_departments',
          'create_department',
          'update_department',
        ],
        description: 'HR Manager with employee and leave management permissions',
      },
      {
        name: 'PAYROLL_OFFICER',
        permissions: [
          'view_employees',
          'view_attendance',
          'view_leave',
          'view_salary',
          'create_salary',
          'update_salary',
          'view_payroll',
          'create_payroll',
          'update_payroll',
          'process_payroll',
          'view_payslips',
          'generate_payslips',
        ],
        description: 'Payroll Officer with payroll processing permissions',
      },
      {
        name: 'FINANCE_OFFICER',
        permissions: [
          'view_payroll',
          'approve_payroll',
          'view_reports',
          'view_payslips',
          'view_employees',
          'view_salary',
        ],
        description: 'Finance Officer with financial approval permissions',
      },
      {
        name: 'EMPLOYEE',
        permissions: [
          'view_own_profile',
          'update_own_profile',
          'view_own_attendance',
          'create_attendance',
          'view_own_leave',
          'create_leave',
          'cancel_leave',
          'view_own_payslips',
          'view_own_salary',
        ],
        description: 'Regular employee with self-service permissions',
      },
    ];

    for (const roleData of roles) {
      const role = new Role(roleData);
      await role.save();
      console.log(`✅ Created role: ${roleData.name}`);
    }

    console.log('✅ Roles seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedRoles();