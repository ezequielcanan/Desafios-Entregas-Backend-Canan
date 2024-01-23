import { cartsService, productsService, ticketsService } from "../services/index.js"
import moment from "moment"

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params
    const result = await cartsService.getCartById(cid)
    res.status(result ? 200 : 404).json({ status: result ? "success" : "error", payload: result })
  }
  catch (e) {
    console.error("Error:", e)
    if (e.name == "CastError") return res.status(404).send("Not found")
    res.status(500).send("Server error")
  }
}

export const addCart = async (req, res) => {
  try {
    const result = await cartsService.addCart(req.body)
    res.json({ status: result ? "success" : "error", payload: result })
  }
  catch (e) {
    console.error("Error:", e)
    res.status(500).send("Server error")
  }
}

export const updateCartProducts = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ status: "error", payload: "there aren't products specified" })
    const result = await cartsService.updateCartProducts(req.params?.cid, req.body?.products)
    res.status(result.modifiedCount ? 200 : 404).json({ stauts: result.modifiedCount ? "success" : "error", payload: result })
  }
  catch (e) {
    console.error("Error:", e)
    if (e.name == "CastError") return res.status(404).send("Not found")
    res.status(500).send("Server error")
  }
}

export const updateProductFromCart = async (req, res) => {
  try {
    const { params: { pid, cid }, body: { quantity } } = req
    const result = await cartsService.updateProductFromCart(pid, cid, quantity)
    res.status(result.modifiedCount ? 200 : 404).json({ stauts: result.modifiedCount ? "success" : "error", payload: result })
  }
  catch (e) {
    console.error("Error:", e)
    if (e.name == "CastError") return res.status(404).send("Not found")
    res.status(500).send("Server error")
  }
}

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const result = await cartsService.deleteProductFromCart(cid, pid)
    res.status(result.modifiedCount ? 200 : 404).json({ stauts: result.modifiedCount ? "success" : "error", payload: result })
  }
  catch (e) {
    console.error("Error:", e)
    if (e.name == "CastError") return res.status(404).send("Not found")
    res.status(500).send("Server error")
  }
}

export const deleteProducts = async (req, res) => {
  try {
    const result = await cartsService.deleteCartProducts(req.params?.cid)
    res.status(result.modifiedCount ? 200 : 404).json({ stauts: result.modifiedCount ? "success" : "error", payload: result })
  }
  catch (e) {
    console.error("Error:", e)
    if (e.name == "CastError") return res.status(404).send("Not found")
    res.status(500).send("Server error")
  }
}

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await cartsService.getCartById(cid)

    const unavailableProducts = []
    const purchasedProducts = []
    cart.products.forEach(async p => p.product.stock >= p.quantity ? (await productsService.updateProduct(p.product._id, { stock: p.product.stock - p.quantity }), purchasedProducts.push(p)) : unavailableProducts.push(p))

    const ticket = {
      purchase_datetime: moment().format("YYYY-MM-DD hh:mm:ss"),
      amount: purchasedProducts.reduce((acc, p) => acc + p.product.price * p.quantity, 0),
      purchaser: req?.user?.user?.email
    }
    const ticketResult = await ticketsService.createTicket(ticket)

    const cartUpdateProducts = await cartsService.updateCartProducts(cid, unavailableProducts)

    res.json({ status: "success", payload: unavailableProducts.length ? unavailableProducts : ticketResult })
  }
  catch (e) {
    console.error("Error:", e)
    if (e.name == "CastError") return res.status(404).send("Not found")
    res.status(500).send("Server error")
  }
}