import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker"
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

export const generateProduct = () => {
  return (
    {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      code: faker.string.fromCharacters("abcdefghijklmnopqrstuvwxyz0123456789", 6),
      stock: faker.number.int({ max: 100 }),
      category: faker.commerce.category,
      status: faker.datatype.boolean()
    }
  )
}