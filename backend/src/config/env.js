import dotenv from 'dotenv';

dotenv.config();

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,

    MONGODB_URI: process.env.MONGODB_URI,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,

    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export default env;