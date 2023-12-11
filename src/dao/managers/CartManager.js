import cartModel from "../models/carts.model.js";

class CartManager {
  constructor() { }

  getCartById = async (cid) => {
    try {
      const cart = await cartModel.findOne({ _id: cid }).lean().exec()
      if (!cart) return { status: 404, payload: "Not found" }
      return { status: 200, payload: cart.products }
    } catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  };

  addCart = async (products) => {
    try {
      const cart = await cartModel.create({ products })
      return { status: !cart ? 500 : 200, payload: cart }
    }
    catch (e) {
      console.error("Error:", e);
      return { status: 500, payload: e }
    }
  }

  updateCartProducts = async (cid, products) => {
    try {
      const result = await cartModel.updateOne({ _id: cid }, { $set: { products } })
      return { status: result.modifiedCount ? 200 : 404, payload: result }
    }
    catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  }

  updateProductFromCart = async (pid, cid, quantity) => {
    try {
      const cart = await cartModel.findById(cid).lean().exec()
      if (!cart) return { status: 404, payload: "Not found" }
      const existsProduct = cart.products.findIndex((p) => p.product._id == pid)
      if (existsProduct == -1) {
        cart.products.push({ product: pid, quantity })
      } else {
        cart.products[existsProduct].quantity = quantity
      }
      const result = await cartModel.updateOne({ _id: cid }, cart)
      return {status: result ? 200 : 500, payload: result}
    }
    catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  }

  deleteProducts = async (cid) => {
    try {
      const result = await cartModel.updateOne({_id: cid}, {$set: {products: []}})
      return {status: result.modifiedCount ? 200 : 404, payload: result}
    }
    catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  }

  deleteProductFromCart = async (cid, pid) => {
    try {
      const result = await cartModel.updateOne({_id: cid}, {$pull: {"products": {product: pid}}})
      return {status: result.modifiedCount ? 200 : 404, payload: result}
    }
    catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  }
}

export default CartManager