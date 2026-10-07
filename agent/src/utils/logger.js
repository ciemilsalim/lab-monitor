/**
 * Logger - Logging system untuk agent
 */

const winston = require('winston');
const path = require('path');
const config = require('./config');

const logDir = 'logs';
const logFile = config.get('LOG_FILE') || 'agent.log';
const logLevel = config.get('LOG_LEVEL') || 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
    })
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    }),
    
    // File transport - all logs
    new winston.transports.File({
      filename: path.join(logDir, logFile),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // File transport - error logs only
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

module.exports = logger;
