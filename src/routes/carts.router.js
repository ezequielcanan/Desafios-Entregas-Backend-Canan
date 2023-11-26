import {Router} from "express"
import cartModel from "../dao/models/carts.model.js"

const router = Router()

router.get("/:cid", async (req,res) => {
  try {
    const {cid} = req.params
    const products = await cartModel.findOne({_id: cid}).lean().exec()
    if (!products) return res.status(404).json({message: "Not found"})
    res.status(!products ? 404 : 200).send(products.products)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

router.post("/", async (req,res) => {
  try {
    const cart = await cartModel.create({products: req.body.products || [], })
    res.status(!cart ? 500 : 200).send(cart)
  }
  catch(e) {
    res.status(500).send("Error en el servidor")
  }
})

router.put("/:cid", async (req,res) => {
  try {
    const {body: {products}, params: {cid}} = req
    if (!products) return res.status(400).json({status: "error", payload: "There aren't products specified"})
    const result = await cartModel.updateOne({_id: cid}, {$set: {products}})
    res.status(result.modifiedCount ? 200 : 404).json({status: "success", payload: result})
  }
  catch(e) {
    res.status(500).send("Error en el servidor")
  }
})

router.put("/:cid/product/:pid", async (req,res) => {
  try {
    const {params: {cid,pid}, body: {quantity}} = req
    const cart = await cartModel.findById(cid).lean().exec()
    if (!cart) return res.status(404).json({message: "Not found"})
    const existsProduct = cart.products.findIndex((p) => p.product._id == pid)
    if (existsProduct == -1) {
      cart.products.push({product: pid, quantity})
    } else {
      cart.products[existsProduct].quantity = quantity
    }
    const newProducts = await cartModel.updateOne({_id: cid}, cart)
    res.status(!newProducts ? 500 : 200).send(newProducts)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

router.delete("/:cid", async (req,res) => {
  try {
    const {params: {cid}} = req
    const result = await cartModel.updateOne({_id: cid}, {$set: {products: []}})
    res.status(result.modifiedCount ? 200 : 400).json({status: "success", payload: result})
  }
  catch(e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

router.delete("/:cid/products/:pid", async (req,res) => {
  try {
    const {params: {cid,pid}} = req
    const result = await cartModel.updateOne({_id: cid}, {$pull: {"products": {product: pid}}})
    res.status(result.modifiedCount ? 200 : 404).json({status: "success", payload: result})
  }
  catch(e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

export default router