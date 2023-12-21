import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

export const jwtSign = "eze123";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  return jwt.sign({ user }, jwtSign, { expiresIn: "24h" });
};

export const authorization = role => {
  return async (req, res, next) => {
    const user = req.user
    if (!user) return res.status(401).send({ error: 'Unauthorized' })
    if( user.user.role != role ) return res.status(403).send({error: 'No permisions'})
    return next()
  }
}

