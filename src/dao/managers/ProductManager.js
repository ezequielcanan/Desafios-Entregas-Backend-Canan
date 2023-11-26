import fs from "fs"

class ProductManager {
  constructor(filename) {
    this.readFormat = "utf-8";
    this.path = filename;
  }

  async addProduct({title, description, price, code, stock, category, thumbnail=undefined, status=true}) {
    try {
      const products = await this.getProducts();
      if (products.some((product) => product.code === code))
        return "Invalid code";
      if (!title || !description || !price || !code || !stock || !category) return "Missed properties"
  
      const id = (products.length && products[products.length - 1].id + 1) || 1;
      const newProduct = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status
      };
  
      products.push(newProduct);
  
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return newProduct;
    }
    catch(e) {
      console.error("Error: ", e)
      return []
    }
  }

  getProducts = async (limit=0) => {
    try {
      if (!fs.existsSync(this.path)) return [];
      const products = await fs.promises.readFile(this.path, this.readFormat);
      const productsObject = products ? JSON.parse(products) : [];
      return productsObject.slice(0,(limit ? limit : undefined)) ;
    } catch (e) {
      console.error("Error: ", e);
      return []
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === id);
      return product || "No existe";
    } 
    catch(e) {
      console.error("Error: ",e)
      return []
    }
  };

  updateProduct = async (id, properties) => {
    try {
      if (properties["id"]) delete properties["id"]
      const products = await this.getProducts();
      const updatedProducts = products.map((p) =>
        p.id === id ? { ...p, ...properties} : p
      );
      await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
  
      return updatedProducts;
    }
    catch(e) {
      console.error("Error: ",e)
      return []
    }
  };

  deleteProduct = async (id) => {
    try {
      const product = await this.getProductById(id)
      if (product != "No existe") {
        const products = await this.getProducts();
        const deletedProduct = products.splice(
          products.findIndex((p) => p.id === id),
          1
        );
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return (deletedProduct.length && deletedProduct) || "No existe";
      }
      else {
        return "No existe"
      }
    }
    catch(e) {
      console.error("Error: ",e)
      return []
    }
  };
}

export default ProductManager