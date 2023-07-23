import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
// const { combine, timestamp, label, printf, prettyPrint } = format
const { combine, timestamp, label, printf } = format;

//custom log format

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `[${date.toDateString()} ${hour}:${minutes}:${seconds} ${label}] ${level}: ${message} }`;
});

const loggerInfo = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'PUM' }),
    timestamp(),
    myFormat
    // prettyPrint()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'success',
        'PhU-%DATE%-success.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});
const loggerError = createLogger({
  level: 'error',
  format: combine(
    label({ label: 'PUM' }),
    timestamp(),
    myFormat
    // prettyPrint()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),

    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'PhU-%DATE%-error.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export { loggerError, loggerInfo };
