import cartModel from "../dao/mongo/models/carts.model.js"
import CartManager from "../dao/managers/CartManager.js"

const cartManager = new C
export const getCartById = async (req,res) => {
  try {
    const {cid} = req.params
    const result = await cartManager.getCartById(cid)
    res.status(result.status).send(result.payload)
  }
  catch(e) {
    console.error("Error:",e)
    res.status(500).send("Server error")
  }
}