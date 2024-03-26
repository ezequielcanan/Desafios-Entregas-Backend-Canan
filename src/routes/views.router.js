import { Router } from "express"
import { getFindParameters } from "../middlewares/products.middlewares.js"
import { authorization } from "../middlewares/auth.middlewares.js"
import passport from "passport"
import { adminView, cartView, chatView, loginView, productView, productsView, registerView, resetPasswordView } from "../controllers/views.controller.js"

const router = Router()

const isLoggedIn = (req, res, next) => {
  if (req.cookies.jwtCookie) return res.redirect("/products")

  return next()
}

const auth = (req, res, next) => {
  if (req.cookies.jwtCookie) return next()

  return res.redirect("/login")
}

router.get("/products", auth, passport.authenticate("jwt", { session: false }), getFindParameters, productsView)

router.get("/products/:pid", passport.authenticate("jwt", { session: false }), productView)

router.get("/carts/:cid", cartView)

router.get("/", (req, res) => res.redirect("/login"))

router.get("/login", isLoggedIn, loginView)

router.get("/register", isLoggedIn, registerView)

router.get("/chat", chatView)

router.get("/reset-password", resetPasswordView)

router.get("/admin", passport.authenticate("jwt", { session: false }), authorization(["admin"]), adminView)

export default router