import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.label({label: "Delivery"}),
        winston.format.timestamp(),
        winston.format.prettyPrint({ colorize: true }),
    ),
    transports: [
        new winston.transports.Console({})
    ]
})

export default logger;