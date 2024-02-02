import { generateProduct } from "../utils.js"

export const mockingProducts = (req, res) => {
  try {
    const products = []

    for (let i = 0; i < 100; i++) {
      products.push(generateProduct())
    }

    res.json({ status: "success", payload: products })
  }
  catch (e) {
    console.error("Error:", e);
    res.status(500).send("Server error");
  }
}