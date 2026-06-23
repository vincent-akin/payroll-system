import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import logger from './shared/utils/logger.js';
import errorHandler from './shared/middlewares/errorHandler.js';
import requestLogger from './shared/middlewares/requestLogger.js';
import swaggerDocument from './config/swagger.js';
import AppError from './shared/errors/AppError.js';


import routes from './routes/index.js';

const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());

app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        credentials: true,
    })
);

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: '10mb' }));

app.use(
    express.urlencoded({
        extended: true,
    })
);

/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.http(message.trim()),
        },
    })
);

app.use(requestLogger);

/*
|--------------------------------------------------------------------------
| Swagger
|--------------------------------------------------------------------------
*/

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'PayrollPro API Docs',
    })
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

app.get('/error-test', (req, res, next) => {
    next(new AppError('Test Error', 400));
});
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/v1', routes);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;