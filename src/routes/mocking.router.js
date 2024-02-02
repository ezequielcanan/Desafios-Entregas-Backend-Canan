import { Router } from "express"
import { mockingProducts } from "../controllers/mocking.controller.js"


const router = Router()

router.get("/mockingproducts", mockingProducts)

export default router