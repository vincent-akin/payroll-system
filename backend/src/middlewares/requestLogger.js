import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logStream = fs.createWriteStream(path.join(__dirname, '../../logs/requests.log'), { flags: 'a' });

export const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `${new Date().toISOString()} | ${req.method} | ${req.url} | ${res.statusCode} | ${duration}ms | IP: ${req.ip}\n`;
        
        console.log(log.trim());
        logStream.write(log);
    });
    
    next();
};