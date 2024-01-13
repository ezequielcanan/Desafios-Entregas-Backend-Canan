import { Router } from "express"
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/:pid", getProductById);

router.post("/", addProduct);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

export default router;
