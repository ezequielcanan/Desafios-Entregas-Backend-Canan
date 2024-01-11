import { Carts } from "../dao/factory.js"
import CartsService from "./carts.services.js"

export const cartsService = new CartsService(new Carts())