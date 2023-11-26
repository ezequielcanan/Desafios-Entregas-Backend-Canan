import {Router} from "express"
import productModel from "../dao/models/products.model.js"

const router = Router()

router.get("/", async (req,res) => {
  try {
    const products = await productModel.find().lean().exec()
    res.send(products)
  }
  catch(e) {
    res.status(500).send("Error en el servidor")
  }
})

router.get("/:pid", async (req,res) => {
  try {   
    const {pid} = req.params
    const product = await productModel.findById(pid).lean().exec()
    res.status(!product ? 404 : 200).send(product)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

router.post("/", async (req,res) => {
  try {
    const products = await productModel.find().lean().exec()
    if (!products.some(p => p.code === req.body.code)) {
      if (!req.body.title || !req.body.description || !req.body.price || !req.body.code || !req.body.stock || !req.body.category) return res.status(400).json({message: "Missed properties"})
      const newProduct = await productModel.create(req.body)
      res.status(!newProduct ? 500 : 200).send(newProduct)
    } else {
      res.status(400).json({message: "Invalid code"})
    }
  }
  catch(e) {
    console.error("Error:",e)
    res.status(500).send("Error en el servidor")
  }
})

router.put("/:pid", async (req,res) => {
  try {
    const {pid} = req.params
    let product = await productModel.findById(pid).lean().exec()
    if (req.body._id || req.body.code) return res.status(400).json({message: "Invalid property"})
    const updatedProduct = await productModel.updateOne({_id: pid}, {...product, ...req.body})
    res.status(!updatedProduct ? 500 : 200).send(updatedProduct)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

router.delete("/:pid", async (req,res) => {
  try {
    const {pid} = req.params
    const deletedProduct = await productModel.deleteOne({_id: pid})
    res.status(!deletedProduct ? 404 : 200).send(deletedProduct)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

export default router