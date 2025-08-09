import winston from "winston";
import { LOG_LEVEL } from "../config/env.js";

const { combine, timestamp, json, prettyPrint, errors, colorize, align } =
  winston.format;

export const logger = winston.createLogger({
  level: LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    errors({ stack: true }),
    prettyPrint(),
    colorize({ all: true })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/standard.log" }),
  ],
  // defaultMeta:
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

console.error("log level", LOG_LEVEL);
logger.error("log level", LOG_LEVEL);
