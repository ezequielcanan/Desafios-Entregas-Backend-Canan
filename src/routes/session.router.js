import { Router } from "express"
import passport from "passport"

const router = Router()

router.post("/login", passport.authenticate("login", {session: false, failureRedirect: "/"}), async (req, res) => {
  try {
    if (!req.user) return res.status(400).send("Invalid credentials")

    const {token} = req.user

    res.cookie("jwtCookie", token).redirect("/products")
  } catch (e) {
    console.log("Error:", e)
    return res.status(500).send({ message: "Server Error" })
  }
})

router.post("/register", passport.authenticate("register", {failureRedirect: "/", session: false}), async (req, res) => {
  try {
    res.send({ url: "login" })
  }
  catch (e) {
    console.log("Error:", e)
    return res.status(500).send({ message: "Server Error" })
  }
})

router.get("/github", passport.authenticate("github", {scope: ['user:email'], session: false}), async (req,res) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/", session: false}), async (req,res) => {
  try {
    if (!req.user) return res.status(400).json({status: "error", payload: "Invalid github"})
    return res.cookie("jwtCookie", req?.user?.token).redirect("/products")
  }
  catch (e) {
    console.log("Error:", e)
    return res.status(500).send({ message: "Server Error" })
  }
})

router.get("/current", passport.authenticate("jwt", {session: false}), (req,res) => {
  const {user} = req.user
  res.json({status:"success", payload: user})
})

router.get("/logout", (req, res) => {
  try {
    res.cookie("jwtCookie", "").redirect("/login")
  }
  catch (e) {
    console.log("Error:", e)
    return res.status(500).send({ message: "Server Error" })
  }
})

export default router