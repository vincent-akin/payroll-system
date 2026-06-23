import mongoose from 'mongoose';
import logger from '../shared/utils/logger.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (error) => {
            logger.error(`MongoDB connection error: ${error.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

    } catch (error) {
        logger.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;