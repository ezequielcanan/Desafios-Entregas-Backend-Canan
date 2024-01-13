import { productsService } from "../services/index.js";

export const addProduct = async (req, res) => {
  try {
    const { body } = req;
    const product = await productsService.getProductByFilter({
      code: body.code,
    });
    if (product) {
      return res.status(400).json({ status: "error", payload: "Invalid code" });
    }
    if (!productsService.checkProductProperties(body))
      return res
        .status(400)
        .json({ status: "error", payload: "Missed properties" });
    const result = await productsService.addProduct(body);
    res.json({ status: "success", payload: result });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send("Server error");
  }
};

export const getProducts = async (req, res) => {
  try {
    const queryFindParameters = {};
    const limit = parseInt(req.query?.limit ?? 10);
    const page = parseInt(req.query?.page ?? 1);
    const title = req.query?.query || null;
    const optionsPaginate = { limit, page, lean: true };
    const sortOrder = req.query?.sort?.toLowerCase();
    const categoryFilter = req.query?.category;
    const stockFilter = parseInt(req.query?.stock);

    (sortOrder === "asc" && (optionsPaginate.sort = { price: 1 })) ||
      (sortOrder === "desc" && (optionsPaginate.sort = { price: -1 }));
    stockFilter && (queryFindParameters.stock = { $gte: stockFilter });
    categoryFilter && !title && (queryFindParameters.category = categoryFilter);
    title && ((queryFindParameters.title = title), (optionsPaginate.page = 1));

    const result = await productsService.getProducts(
      queryFindParameters,
      optionsPaginate
    );
    res.json({ status: "success", payload: result.docs });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).send("Server error");
  }
};

export const getProductById = async (req, res) => {
  try {
    const result = await productsService.getProductById(req.params?.pid);
    res.json({ status: "success", payload: result });
  } catch (e) {
    console.error("Error:", e);
    if (e.name == "CastError") return res.status(404).send("Not found");
    res.status(500).send("Server error");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {body} = req
    if (body._id || body.code)
      return res.status(400).json({status: "error", payload: "Invalid properties to update"})
    const result = await productsService.updateProduct(req.params?.pid, {
      ...body,
    });
    res.json({status: "success", payload: result})
  } catch (e) {
    console.error("Error:", e);
    if (e.name == "CastError") return res.status(404).send("Not found");
    res.status(500).send("Server error");
  }
};

export const deleteProduct = async (req,res) => {
  try {
    const result = await productsService.deleteProduct(req.params?.pid)
    res.json({status: "success", payload: result})
  }
  catch (e) {
    console.error("Error:", e);
    if (e.name == "CastError") return res.status(404).send("Not found");
    res.status(500).send("Server error");
  }
}