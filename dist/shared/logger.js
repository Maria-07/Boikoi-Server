"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerInfo = exports.loggerError = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// const { combine, timestamp, label, printf, prettyPrint } = format
const { combine, timestamp, label, printf } = winston_1.format;
//custom log format
const myFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `[${date.toDateString()} ${hour}:${minutes}:${seconds} ${label}] ${level}: ${message} }`;
});
const loggerInfo = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'PUM' }), timestamp(), myFormat
    // prettyPrint()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'success', 'PhU-%DATE%-success.log'),
            datePattern: 'YYYY-DD-MM-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});
exports.loggerInfo = loggerInfo;
const loggerError = (0, winston_1.createLogger)({
    level: 'error',
    format: combine(label({ label: 'PUM' }), timestamp(), myFormat
    // prettyPrint()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(process.cwd(), 'logs', 'winston', 'errors', 'PhU-%DATE%-error.log'),
            datePattern: 'YYYY-DD-MM-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});
exports.loggerError = loggerError;
