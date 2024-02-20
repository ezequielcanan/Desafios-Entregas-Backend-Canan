import dotenv from "dotenv"
import __dirname from "../utils.js"

dotenv.config()

export const PORT = process.env.PORT || 8080
export const MONGO_URL = process.env.MONGO_URL
export const MONGO_DBNAME = process.env.MONGO_DBNAME
export const PERSISTENCE = process.env.PERSISTENCE
export const NODE_ENV = process.env.NODE_ENV
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASS = process.env.MAIL_PASS