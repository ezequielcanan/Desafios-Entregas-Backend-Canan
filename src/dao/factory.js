import { PERSISTENCE } from "../config/config.js"

export let Carts
export let Products

switch (PERSISTENCE) {
  case "MONGO":
    const {default: CartsMongo} = await import("./mongo/carts.mongo.js")
    const {default: ProductsMongo} = await import("./mongo/products.mongo.js")
    Carts = CartsMongo
    Products = ProductsMongo
    break
}