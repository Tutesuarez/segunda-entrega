import cartRouter from "./routes/cart.routes.js"
import productsRouter from "./routes/products.routes.js"
import viewsRouter from "./routes/view.routes.js"
import handlebars from "express-handlebars"
import MessageManager from "./controller/MongoDbManagers/MessageManager.js"
import express from "express"
import cors from "cors"
import { __dirname} from "./path.js"
import { Server } from "socket.io"
import mongoose from "mongoose"
import "dotenv/config"

const messageManager = new MessageManager();

const app = express()

try {
  await mongoose.connect(process.env.URL_MONGODB_ATLAS)
      .then('DB is Connected')
} catch (error) {
  console.log(error)
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

app.engine("handlebars", handlebars.engine())
app.set("views", `${__dirname}/views`)
app.set("view engine", "handlebars")

app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)

const socketio = app.listen(process.env.PORT, () =>
  console.log(`Server running at http://localhost:${process.env.PORT}`)
);
const io = new Server(socketio)
app.set("socketio", io)

io.on("connection", (socket) => {
  console.log(`New user online...`)

  socket.on("newuser", async ({ user }) => {
    socket.broadcast.emit("newuserconnected", { user: user })
    let messages = await messageManager.getMessages()
    io.emit("messageLogs", messages)
  })

  socket.on("message", async (data) => {
    await messageManager.addMessage(data)
    let messages = await messageManager.getMessages()
    io.emit("messageLogs", messages)
  })
})

