export const generateProductErrorInfo = product => {
  return `
    Una o mas propiedades estan incompletas o no son validas
    Lista de propiedades obligatorias:
      - title: Must be a string (${product?.title})
      - description: Must be a string (${product?.description})
      - price: Must be a number (${product?.price})
      - stock: Must be a number (${product?.stock})
      - category: Must be a string (${product?.category})
      - status: Must be a boolean (${product?.status})

    Lista de propiedades obligatorias e irrepetibles:
      - code: Must be a string (${product?.code})
  `
}