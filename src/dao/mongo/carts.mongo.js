import cartModel from "./models/carts.model.js"

export default class Carts {
  constructor () {}

  getCartById = async (cid) => {
    const cart = await cartModel.findOne({_id: cid}).lean().exec()
    return cart
  }

  addCart = async (products) => {
    const cart = await cartModel.create(products)
    return cart
  }

  updateCartProducts = async (cid, products) => {
    const result = await cartModel.updateOne({_id: cid}, {$set: {products}})
    return result
  }

  updateProductFromCart = async (pid, cid, quantity=1) => {
    const result = await cartModel.updateOne({_id: cid}, {$inc: {"products.$[].quantity": quantity}}, {upsert: true})
    return result
  }

  deleteCartProducts = async (cid) => {
    const result = await cartModel.updateOne({_id: cid}, {$set: {products: []}})
    return result
  }

  deleteProductFromCart = async (cid, pid) => {
    const result = await cartModel.updateOne({_id: cid}, {$pull: {"products": {product: pid}}})
    return result
  }
} 