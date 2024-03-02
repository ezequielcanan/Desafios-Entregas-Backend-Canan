import { expect } from "chai"
import { generateProduct } from "../utils.js"
import { faker } from "@faker-js/faker"
import supertest from "supertest"

const requester = supertest(`http://127.0.0.1:8080`)

describe("Testing backend api", () => {

  const userMock = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({min: 10, max: 100}),
    password: faker.internet.password(),
    role: "user"
  }

  describe("Testing carts router", () => {
    it("El endpoint POST /api/carts debe crear un carrito", async () => {
      const {_body} = await requester?.post(`/api/carts`)
      const cart = _body?.payload
      expect(typeof cart, "Tipo objeto").to.be.deep.eq("object")
      expect(cart, "Carrito creado").to.have.property("_id")
    })
  })


  describe("Testing session router", () => {
    it("El endpoint POST /api/session/register", async () => {
      const { ok } = await requester.post(`/api/session/register`).send(userMock)
      expect(ok).to.be.ok
    })
  })

  describe("Testing products router", () => {
    it("El endpoint GET /api/products debe retornar un array de productos filtrados o no filtrados", async () => {
      const {status, ok, _body} = await requester.get(`/api/products?sort=asc`)
      const products = _body?.payload
      expect(ok).to.be.ok
      expect(Array.isArray(products), "Tipo array").to.be.equal(true)
      products?.length > 1 && expect(products[0]?.price, "Filtrado por precio").to.be.lessThanOrEqual(products[1]?.price)
    })
    
    const productMock = generateProduct()
    
    /* it("El endpoint POST /api/products debe crear un nuevo producto", async () => {
      const res = await requester.post(`/api/products`).send(productMock)
      const product = res.body
      
      expect(typeof product, "Tipo objeto").to.be.deep.eq("object")
      expect(product, "Producto creado").to.have.property("_id")
      
      const errorResult = await requester.post(`/api/products`).send(productMock)
      expect(errorResult?._body?.status, "Cannot create the same code product").to.be.deep.eq("error")
      
      productMock._id = product?._id
    })
    
    it("El endpoint GET /api/products/:pid debe retornar el producto solicitado por el id", async () => {
      const {_body} = await requester.get(`/api/products/${productMock?._id}`)
      const product = _body?.payload
      
      expect(typeof product, "Tipo objeto").to.be.deep.eq("object")
      expect(product, "Producto obtenido correctamente").to.have.property("_id")
    }) */
    
  })
})