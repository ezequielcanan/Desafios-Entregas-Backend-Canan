import { Router } from "express"
import { mockingProducts, testLogger } from "../controllers/mocking.controller.js"


const router = Router()

router.get("/mockingproducts", mockingProducts)
router.get("/logger", testLogger)

export default router