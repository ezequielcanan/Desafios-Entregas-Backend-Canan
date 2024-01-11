import { PERSISTENCE } from "../config/config.js"

export let Carts

console.log(PERSISTENCE)
switch (PERSISTENCE) {
  case "MONGO":
    const {default: CartsMongo} = await import("./mongo/carts.mongo.js")
    console.log(CartsMongo)
    Carts = CartsMongo
    break
}