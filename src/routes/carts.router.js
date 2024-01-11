import {Router} from "express"
import { cartsService } from "../services/index.js"

const router = Router()

router.get("/:cid", async (req,res) => {
  try {
    const result = await cartsService.getCartById(req.params?.cid)
    res.send(result)
  }
  catch(e) {
    res.status(500).send("Server error")
  }
})

router.post("/", async (req,res) => {
  try {
    const result = await cartsService.addCart(req.body || [])
    res.send(result)
  }
  catch(e) {
    res.status(500).send("Server error")
  }
})

router.put("/:cid", async (req,res) => {
  try {
    const {body: {products}, params: {cid}} = req
    if (!products) return res.status(400).json({status: "error", payload: "There aren't products specified"})
    const result = await cartManager.updateCartProducts(cid, products)
    res.status(result.status).json({status: result.status, payload: result.payload})
  }
  catch(e) {
    res.status(500).send("Server error")
  }
})

router.put("/:cid/product/:pid", async (req,res) => {
  try {
    const {params: {cid,pid}, body: {quantity}} = req
    const result = await cartsService.updateProductFromCart(pid,cid,quantity)
    res.send(result)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(500).send("Server error")
  }
})

router.delete("/:cid", async (req,res) => {
  try {
    const {params: {cid}} = req
    const result = await cartManager.deleteProducts(cid)
    res.status(result.status).json(result.payload)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(500).send("Server error")
  }
})

router.delete("/:cid/products/:pid", async (req,res) => {
  try {
    const {params: {cid,pid}} = req
    const result = await cartManager.deleteProductFromCart(cid, pid)
    res.status(result.status).json(result.payload)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(500).send("Server error")
  }
})

export default router