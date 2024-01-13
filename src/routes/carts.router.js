import {Router} from "express"
import { addCart, deleteProductFromCart, deleteProducts, getCartById, updateCartProducts, updateProductFromCart } from "../controllers/carts.controller.js"

const router = Router()

router.get("/:cid", getCartById)

router.post("/", addCart)

router.put("/:cid", updateCartProducts)

router.put("/:cid/product/:pid", updateProductFromCart)

router.delete("/:cid", deleteProducts)

router.delete("/:cid/products/:pid", deleteProductFromCart)

export default router