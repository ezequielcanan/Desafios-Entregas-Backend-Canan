import UsersSendDTO from "../dto/users.dto.js"
import Mail from "../modules/mail.module.js"
import { usersService } from "../services/index.js"
import { createHash, generateToken, isValidPassword, verifyToken } from "../utils.js"

const mail = new Mail()
export const sessionLogin = async (req, res) => {
  try {
    if (!req.user) return res.status(400).send("Invalid credentials")
    const { token } = req.user
    res.cookie("jwtCookie", token).redirect("/products")
  } catch (e) {
    req.logger.error("Error: " + e)
    return res.status(500).send({ message: "Server Error" })
  }
}

export const sessionRegister = async (req, res) => {
  try {
    res.send({ url: "login" })
  }
  catch (e) {
    req.logger.error("Error: " + e)
    return res.status(500).send({ message: "Server Error" })
  }
}

export const githubCallback = async (req, res) => {
  try {
    if (!req.user) return res.status(400).json({ status: "error", payload: "Invalid github" })
    return res.cookie("jwtCookie", req?.user?.token).redirect("/products")
  }
  catch (e) {
    req.logger.error("Error: " + e)
    return res.status(500).send({ message: "Server Error" })
  }
}

export const sessionCurrent = (req, res) => {
  const { user } = req.user
  const userToSend = new UsersSendDTO(user)
  res.json({ status: "success", payload: userToSend })
}

export const sessionLogout = (req, res) => {
  try {
    res.cookie("jwtCookie", "").redirect("/login")
  }
  catch (e) {
    req.logger.error("Error: " + e)
    return res.status(500).send({ message: "Server Error" })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { password, email } = req?.body

    const user = await usersService.getUserByEmail(email)
    if (!user) return res.status(400).send({ payload: "Invalid user" })

    const validPassword = isValidPassword(user, password)

    if (validPassword) return res.status(400).send({ payload: "la contraseña es la misma" })

    const result = await usersService.changeUserPassword(user, createHash(password))

    res.json({ result })
  }
  catch (e) {
    req.logger.error("Error: " + e)
    return res.status(401).send({ message: "Invalid token" })
  }
}

export const changePasswordMail = async (req, res) => {
  try {
    const { email } = req?.body

    const user = await usersService.getUserByEmail(email)
    if (!user) return res.status(400).json({ status: "error", payload: "User doesn't exists" })

    const token = generateToken(user, "1h")

    const url = `http://localhost:8080/reset-password?token=${token}`

    await mail.send(email, "Cambiar contraseña", `${url}`)

    res.json({ status: "success", payload: { url, email } })
  }
  catch (e) {
    req.logger.error("Error: " + e + req)
    return res.status(500).send({ message: "Server Error" })
  }
}

export const switchRole = async (req, res) => {
  try {
    const { uid } = req?.params

    const user = await usersService.getUserById(uid)
    if (!user) return res.status(400).json({ status: "error", payload: "User doesn't exists" })

    const result = await usersService.switchRole(user)

    res.json({ status: "success", payload: result })
  }
  catch (e) {
    req.logger.error("Error: " + e + req)
    return res.status(500).send({ message: "Server Error" })
  }
}