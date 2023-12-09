import { Router } from "express";
import ProductManager from "../dao/managers/ProductManager.js";
import productModel from "../dao/models/products.model.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const result = productManager.getProducts(req);
    if (result.status == 400 || result.status == 500)
      return res.status(result.status).send(result.message);
    return res.send(result)
  } catch (e) {
    res.status(500).send("Server error")
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid)
    res.status(!product ? 404 : 200).send(product);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send("Server error")
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await productManager.addProduct(req.body, req.body)
    res.status(result.status).send(result.payload)
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send("Server error")
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await productManager.updateProduct(pid, req.body)
    res.status(result.status).send(result.payload);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send("Server error")
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await productManager.deleteProduct(pid)
    res.status(result.status).send(result.payload);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send("Server error")
  }
});

export default router;
