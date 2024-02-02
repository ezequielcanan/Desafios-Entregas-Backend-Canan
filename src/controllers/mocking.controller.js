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
    req.logger.error("Error: " + e);
    res.status(500).send("Server error");
  }
}


export const testLogger = (req, res) => {
  req.logger.debug("debug")
  req.logger.http("http")
  req.logger.info("info")
  req.logger.warning("warning")
  req.logger.error("error")
  req.logger.fatal("fatal")

  res.send("LOGGER IS OK")
}