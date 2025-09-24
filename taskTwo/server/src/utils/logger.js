import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
  //   defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),

    new transports.File({
      filename: "logs/combined.log",
      level: "warn",
      level: "info",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(myFormat),
    })
  );
}

export default logger;
