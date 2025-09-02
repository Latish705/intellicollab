import winston, { log } from "winston";
// import { config } from ".";
import LokiTransport from "winston-loki";

const logger = winston.createLogger({
  // level: config.LOG_LEVEL,
  // defaultMeta: { service: config.SERVICE_NAME },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, service }) => {
      return `[${timestamp}] [${level}] [${service}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: "http://127.0.0.1:3100",
    }),
  ],
});

export default logger;
