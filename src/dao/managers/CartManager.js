import cartModel from "../models/carts.model.js";

class CartManager {
  constructor() {}

  getCartById = async (cid) => {
    try {
      const cart = await cartModel.findOne({_id: cid}).lean().exec()
      if (!cart) return {status: 404, payload: "Not found"}
      return {status: 200, payload: cart.products}
    } catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  };

  addCart = async (products) => {
    try {
      const cart = await cartModel.create({products})
      return {status: !cart ? 500 : 200, payload: cart}
    }
    catch (e) {
      console.error("Error:", e);
      return {status: 500, payload: e}
    }
  }

  updateCartProducts = async (cid, products) => {
    try {
      const result = await cartModel.updateOne({_id: cid}, {$set: {products}})
      return {status: result.modifiedCount ? 200 : 404, payload: result}
    }
    catch (e) {
      console.error("Error:", e);
      return {status: 500, payload: e}
    }
  }
}

export default CartManager