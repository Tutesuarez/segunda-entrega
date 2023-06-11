import cartRouter from "./routes/cart.routes.js"
import productsRouter from "./routes/products.routes.js"
import viewsRouter from "./routes/view.routes.js"
//import routerSession from "./routes/abc.routes.js"
import handlebars from "express-handlebars"
import MessageManager from "./controller/MongoDbManagers/MessageManager.js"
import express from "express"
import cors from "cors"
import { __dirname} from "./path.js"
import { Server } from "socket.io"
import mongoose from "mongoose"
import "dotenv/config"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import initializePassport from "./config/passport.js"
import  engine  from "express-handlebars"
import { userModel } from "./controller/models/user.model.js"
import userRouter from "./routes/users.routes.js"
import routerSession from "./routes/session.routes.js"

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
app.use(cookieParser(process.env.COOKIE_SECRT)) // firma de cookie
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.URL_MONGODB_ATLAS,
    mongoOpcions:{useNewUrlParser:true, useUnifiedTopology:true},
    ttl:210 // segundos
  }),
  secret: process.env.SESSION_SECRET,
  resave: true, // me premite no perder la sesion si se cierra la ventana
  saveUninitialized: true // guarda la session aunque no contenga info
}))

//config passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use('/session', routerSession)
// app.use('/user', userRouter)



//// Clase cookies
//Crear cookie

// app.get('/setCookie', (req, res) => {

//   //Nombre cookie - Valor asociado a dicha cookie

//   res.cookie('CookieCookie', "Esta es mi primer cookie", {maxAge:36000000, signed: true}).send('cookie creada firmada')
// })

// //Consultar cookie

// app.get('/getCookie', (req, res) => {

//   //Nombre cookie - Valor asociado a dicha cookie

//   res.send(req.signedCookies)
// })

// //Eliminar cookie

// app.get('/deleteCookie', (req, res) => {

//   res.clearCookie('CookieCookie').send("Cookie eliminada")

// })





app.listen(4000, () => console.log("Server on port 4000"))

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

