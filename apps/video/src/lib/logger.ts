import winston from "winston";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json({
		space: 4,
		deterministic: true,
		bigint: false,
	}),
	exitOnError: false,
	defaultMeta: { service: "summaraize" },
	transports: [new winston.transports.Console()],
});
