// backend/test-connection.js
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://jobPortal:vinceAkin@cluster0.1nn4d6y.mongodb.net/payroll_system?retryWrites=true&w=majority';

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Database:', mongoose.connection.db.databaseName);
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes('bad auth')) {
      console.log('⚠️  Authentication failed. Check username and password.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('⚠️  Network error. Check your internet connection and the cluster hostname.');
    }
  }
};

testConnection();