import fs from "fs"

class CartManager {
  constructor(filename) {
    this.path = filename
    this.readFormat = "utf-8"
  }

  writeFile = async (array) => {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(array))
    }
    catch (e) {
      console.error("Error: ",e)
      return e
    }
  }

  addCart = async (products) => {
    try {
      const carts = await this.getCarts()
      if (!products) return "Missed properties"
      
      const id = (carts.length && carts[carts.length - 1].id + 1) || 1
      const newCart = {
        id,
        products
      }
  
      carts.push(newCart)
      await this.writeFile(carts)
      return newCart
    }
    catch(e) {
      console.error("Error: ",e)
      return []
    }
  }

  addProductsInCart = async (cid,pid,quantity) => {
    try {
      const carts = await this.getCarts()
      const indexOfCart = await this.getIndexOfCart(cid)
      const products = await this.getProductsOfCart(cid)

      const indexProduct = products.findIndex(p => p.product === pid)
      indexProduct != -1 ? products[indexProduct].quantity+=quantity : products.push({product: pid, quantity: quantity})
      carts[indexOfCart].products = products
  
      await this.writeFile(carts)
      return products
    }
    catch(e) {
      console.error("Error: ",e)
      return []
    }
  }

  getIndexOfCart = async (cid) => {
    try {
      const carts = await this.getCarts()
      const cart = carts.findIndex(c => c.id === cid)
      return cart
    } 
    catch (e) {
      console.error("Error: ",e)
      return []
    }
  }

  getCarts = async () => {
    try {
      if (!fs.existsSync(this.path)) return []
      const carts = await fs.promises.readFile(this.path)
      const cartsObjects = carts ? JSON.parse(carts) : []
      return cartsObjects
    }
    catch (e) {
      console.error("Error: ",e)
      return []
    }
  }

  getProductsOfCart = async (cid) => {
    try {
      const carts = await this.getCarts()
      const cart = carts.find(cart => cart.id === cid)
      return cart?.products || "No existe"
    }
    catch(e) {
      console.error(e)
      return []
    }
  }
}

export default CartManager