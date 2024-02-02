import winston from "winston"
import { NODE_ENV } from "../config/config.js"

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  }
}

const isInDevelopment = NODE_ENV == "DEVELOPMENT"

const firstLevel = isInDevelopment ? "debug" : "info"

const transports = [
  new winston.transports.Console({
    level: firstLevel,
    format: winston.format.simple()
  })
]

!isInDevelopment && transports.push(new winston.transports.File({ filename: "./errors.log", level: "warning" }))



export const logger = winston.createLogger({
  levels: customLevels.levels,
  transports
})

export const addLogger = (req, res, next) => {
  req.logger = logger
  req.logger.http(`[${req?.method}] ${req?.url} - ${new Date().toLocaleTimeString()}`)

  next()
}