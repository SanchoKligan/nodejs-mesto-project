import { transports, format } from 'winston';
import { logger, errorLogger } from 'express-winston';

import 'winston-daily-rotate-file';

const reqTransport = new transports.DailyRotateFile({
  filename: './logs/request-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d',
});

const errTransport = new transports.DailyRotateFile({
  filename: './logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '14d',
});

const reqLogger = logger({
  transports: [reqTransport],
  format: format.json(),
});

const errLogger = errorLogger({
  transports: [errTransport],
  format: format.json(),
});

export default {
  reqLogger,
  errLogger,
};
