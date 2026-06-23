import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/database.js';
import logger from './src/shared/utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            logger.info(
                `🚀 Payroll API running on port ${PORT} in ${process.env.NODE_ENV} mode`
            );

            logger.info(
                `📚 API Docs available at http://localhost:${PORT}/api-docs`
            );
        });

        process.on('unhandledRejection', (error) => {
            logger.error(`Unhandled Rejection: ${error.message}`);
            server.close(() => process.exit(1));
        });

        process.on('uncaughtException', (error) => {
            logger.error(`Uncaught Exception: ${error.message}`);
            server.close(() => process.exit(1));
        });

        process.on('SIGTERM', () => {
            logger.info('SIGTERM received. Shutting down gracefully...');
            server.close(() => process.exit(0));
        });

    } catch (error) {
        logger.error(`Server startup failed: ${error.message}`);
        process.exit(1);
    }
};

startServer();