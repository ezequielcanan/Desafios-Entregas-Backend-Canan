import express from "express"
import mongoose from "mongoose"
import routerProducts from "./routes/products.router.js"
import routerCarts from "./routes/carts.router.js"
import routerViews from "./routes/views.router.js"
import routerSession from "./routes/session.router.js"
import handlebars from "express-handlebars"
import messageModel from "./dao/models/messages.model.js"
import __dirname from "./utils.js"
import { Server } from "socket.io"
import session from "express-session"
import MongoStore from "connect-mongo"

const PORT = 8080
const mongoUrl = "mongodb+srv://admin:1234@ecommerce.yr9omem.mongodb.net/"
const dbName = "ecommerce"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/static", express.static(__dirname + "/public"))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(session({
  store: MongoStore.create({
    mongoUrl,
    dbName
  }),
  secret: "secret",
  resave: true,
  saveUninitialized: true
}))

app.use("/api/session", routerSession)
app.use("/api/products", routerProducts)
app.use("/api/carts", routerCarts)
app.use("/", routerViews)

mongoose.connect(mongoUrl, {dbName})
  .then(() => {
    const httpServer = app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
    const socketServer = new Server(httpServer)
    socketServer.on("connection", async socket => {
      socket.emit("messages", await messageModel.find().lean().exec())
      socket.on("new-message", async ({message, user}) => {
        await messageModel.create({user,message})
        socketServer.emit("messages", await messageModel.find().lean().exec())
      })
    })
  })
  .catch(e => {
    console.error(e)
  })