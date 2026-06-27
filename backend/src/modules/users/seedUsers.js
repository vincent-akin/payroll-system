// backend/src/modules/users/seedUsers.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './user.model.js';
import Role from '../roles/role.model.js';

// Load environment variables
dotenv.config();

const seedUsers = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');

    // Get the roles
    const superAdminRole = await Role.findOne({ name: 'SUPER_ADMIN' });
    const hrManagerRole = await Role.findOne({ name: 'HR_MANAGER' });
    const payrollOfficerRole = await Role.findOne({ name: 'PAYROLL_OFFICER' });
    const employeeRole = await Role.findOne({ name: 'EMPLOYEE' });

    if (!superAdminRole) {
      console.error('❌ Roles not found. Please run seedRoles.js first.');
      process.exit(1);
    }

    // Clear existing users
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    const users = [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@payrollpro.com',
        password: 'Admin@123',
        roleId: superAdminRole._id,
        isActive: true,
      },
      {
        firstName: 'HR',
        lastName: 'Manager',
        email: 'hr@payrollpro.com',
        password: 'Admin@123',
        roleId: hrManagerRole._id,
        isActive: true,
      },
      {
        firstName: 'Payroll',
        lastName: 'Officer',
        email: 'payroll@payrollpro.com',
        password: 'Admin@123',
        roleId: payrollOfficerRole._id,
        isActive: true,
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@company.com',
        password: 'Admin@123',
        roleId: employeeRole._id,
        isActive: true,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@company.com',
        password: 'Admin@123',
        roleId: employeeRole._id,
        isActive: true,
      },
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      console.log(`✅ Created user: ${userData.email}`);
    }

    console.log('\n✅ Users seeded successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('   Email: admin@payrollpro.com');
    console.log('   Password: Admin@123');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedUsers();