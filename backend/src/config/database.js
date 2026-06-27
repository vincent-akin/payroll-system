// backend/src/config/database.js
import mongoose from 'mongoose';
import logger from '../shared/utils/logger.js';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    logger.info('Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect(mongoURI);
    
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.db.databaseName}`);
    
    return conn;
  } catch (error) {
    logger.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;