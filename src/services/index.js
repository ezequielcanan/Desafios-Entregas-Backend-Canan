import { Carts, Products } from "../dao/factory.js"
import CartsService from "./carts.services.js"
import ProductsService from "./products.services.js"

export const cartsService = new CartsService(new Carts())
export const productsService = new ProductsService(new Products())