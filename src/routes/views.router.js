import { Router } from "express"
import productModel from "../dao/models/products.model.js"
import cartModel from "../dao/models/carts.model.js"

const router = Router()

router.get("/products", async (req, res) => {
  try {
    const queryFindParameters = {}
    const limit = parseInt(req.query?.limit ?? 10)
    const page = parseInt(req.query?.page ?? 1)
    const title = req.query?.query || null
    const optionsPaginate = { limit, page, lean: true }
    const sortOrder = req.query?.sort?.toLowerCase()
    const categoryFilter = req.query?.category
    const stockFilter = parseInt(req.query?.stock)
  
    sortOrder === "asc" && (optionsPaginate.sort = { price: 1 }) || sortOrder === "desc" && (optionsPaginate.sort = { price: -1 })
    stockFilter && (queryFindParameters.stock = {$gte: stockFilter})  
    categoryFilter && !title && (queryFindParameters.category = categoryFilter)
    title && (queryFindParameters.title = title, optionsPaginate.page = 1)

    const result = await productModel.paginate(queryFindParameters, optionsPaginate)
    if (result.page > result.totalPages || result.page < 1 || isNaN(page)) return res.status(400).send("Incorrect Page")
    res.render("products", result)
  }
  catch (e) {
    console.error(e)
  }
})

router.get("/products/:pid", async (req,res) => {
  try {
    const {pid} = req.params
    const product = await productModel.findById(pid)
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

router.get("/chat", (req, res) => {
  res.render("chat", {})
})

export default router