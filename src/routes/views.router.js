import { Router } from "express"
import ProductManager from "../dao/managers/ProductManager.js"
import productModel from "../dao/models/products.model.js"
import cartModel from "../dao/models/carts.model.js"

const router = Router()
const productManager = new ProductManager()
// MIDDLEWARES

const justPublicWitoutSession = (req,res,next) => {
  if (req.session?.user) return res.redirect("/products")
  
  return next()
}

const auth = (req,res,next) => {
  if (req.session?.user) return next()

  return res.redirect("/login")
}

//******/

router.get("/products", auth, async (req, res) => {
  try {
    const result = await productManager.getProducts(req)
    if (result.status == 400) return res.status(result.status).send(result.message)
    return res.render("products", result)
  }
  catch (e) {
    console.error(e)
  }
})

router.get("/products/:pid", async (req,res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid)
    if (!product) return res.status(400).send(product)
    res.render("product", product)
  }
  catch (e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

router.get("/carts/:cid", async (req,res) => {
  try {
    const {cid} = req.params
    const cart = await cartModel.findOne({_id: cid}).lean().exec()
    console.log(cart)
    res.render("cart", cart)

  }
  catch (e) {
    console.error("Error:",e)
    res.status(e.name == "CastError" ? 400 : 500).send(e.name == "CastError" ? "Not found" : "Error en el servidor")
  }
})

router.get("/login", justPublicWitoutSession, (req,res) => {
  return res.render("login",{})
})

router.get("/register", justPublicWitoutSession, (req,res) => {
  return res.render("register", {})
})

router.get("/chat", (req, res) => {
  res.render("chat", {})
})

export default router