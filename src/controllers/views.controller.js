import { productsService, cartsService, usersService } from "../services/index.js"
import { verifyToken } from "../utils.js"
import { PERSISTENCE } from "../config/config.js"

export const productsView = async (req, res) => {
  try {
    const result = await productsService.getProducts(req?.queryFindParameters, req?.optionsPaginate)
    result.user = req.user?.user || {}
    if (result.status == 400) return res.status(result.status).send(result.message)
    return res.render("products", result)
  }
  catch (e) {
    req.logger.error("Error: " + e)
    return res.status(500).send("Server error")
  }
}

export const productView = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsService.getProductById(pid)
    if (!product) return res.status(400).send(product)
    product.user = req.user?.user
    res.render("product", product)
  }
  catch (e) {
    req.logger.error("Error: " + e)
    return res.status(500).send("Server error")
  }
}

export const cartView = async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await cartsService.getCartById(cid)
    PERSISTENCE == "FILE" && (cart.products = await Promise.all(cart.products.map(async p => {
      const product = await productsService.getProductById(p.id)
      return { ...p, product }
    })))

    res.render("cart", cart)
  }
  catch (e) {
    req.logger.error("Error: " + e)
    res.status(500).send("Server error")
  }
}

export const loginView = (req, res) => {
  return res.render("login", {})
}

export const registerView = (req, res) => {
  return res.render("register", {})
}

export const chatView = (req, res) => {
  return res.render("chat", {})
}

export const resetPasswordView =  async (req,res) => {
  try {

    const {token} = req?.query
    const data = verifyToken(token)
    
    const user = usersService.getUserByEmail(data?.email)
    if (!user) return res.render("password", {valid: true})
    
    res.render("password", {...data, valid: true})
  }
  catch(e) {
    const {user: {email}} = verifyToken(req?.query?.token, true)
    res.render("password", {valid: false, expired: true, email })
  }
}

export const adminView = async (req,res) => {
  try {
    const users = await usersService.getUsers()
    res.render("admin", {users})
  }
  catch(e) {
    req.logger.error("Error: " + e)
    res.status(500).send("Server error")
  }
}