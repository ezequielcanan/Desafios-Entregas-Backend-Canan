import productModel from "../models/products.model.js";

class ProductManager {
  constructor() {}

  getProducts = async (req) => {
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
  
      const result = await productModel.paginate(
        queryFindParameters,
        optionsPaginate
      );
      result.user = req.user?.user
      if (result.page > result.totalPages || result.page < 1 || isNaN(page))
        return { status: 400, message: "Incorrect Page" };
      return result;
    }
    catch (e) {
      console.error("Error:", e);
      return {status: 500, message: e}
    }
  };

  getProductById = async (pid) => {
    try {
      const product = await productModel.findById(pid).lean().exec();
      return product;
    } catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  };

  addProduct = async (
    body,
    { title, description, price, stock, code, category }
  ) => {
    try {
      const product = await productModel.findOne({ code }).lean().exec();
      if (!product) {
        if (!title || !description || !price || !stock || !code || !category)
          return { status: 400, payload: "Missed Properties" };
        const newProduct = await productModel.create(body);
        return { status: !newProduct ? 500 : 200, payload: newProduct };
      } else {
        return { status: 400, payload: "Invalid Code" };
      }
    }
    catch(e) {
      console.error("Error:", e);
      return {status: 500, payload: e}
    }
  };

  updateProduct = async (pid, body) => {
    try {
      const product = await productModel.findById(pid).lean().exec();
      if (body._id || body.code)
        return { status: 400, payload: "Invalid property" };
      const updatedProduct = await productModel.updateOne(
        { _id: pid },
        { ...product, ...body }
      );
      return { status: !updatedProduct ? 500 : 200, payload: updatedProduct };
    } catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  };

  deleteProduct = async (pid) => {
    try {
      const deletedProduct = await productModel.deleteOne({ _id: pid });
      return { status: !deletedProduct ? 404 : 200, payload: deletedProduct };
    } catch (e) {
      console.error("Error:", e);
      if (e.name == "CastError") {
        return { status: 404, payload: "Not found" };
      } else return { status: 500, payload: "Server Error" };
    }
  };
}

export default ProductManager;
