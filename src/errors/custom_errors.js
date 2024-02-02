import EErrors from "./enums.js"
import { generateProductErrorInfo } from "./info.js"

export default class CustomError {
  static createError({ name = "Error", cause, message, code }) {
    const error = new Error(message, { cause })
    error.code = code
    error.name = name

    throw error
  }

  static createProduct(product) {

    CustomError.createError({
      name: "Product creation error",
      cause: generateProductErrorInfo(product),
      message: "Error trying to create product",
      code: EErrors.INVALID_TYPES_ERROR
    })

  }
}