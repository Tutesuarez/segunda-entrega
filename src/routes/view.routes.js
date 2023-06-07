import { Router } from "express"
import ProductManager from "../controller/MongoDbManagers/ProductManager.js"

const router = Router();

const productManager = new ProductManager()


/// CHEQUEAR VISTA CUANDO TODO FUNCIONE
router.get("/", async(req, res) => {
  try {
    let keyword = req.query.keyword
    let limit = parseInt(req.query.limit, 10) || 10
    let page = parseInt(req.query.page, 10) || 1
    const sort = req.query.sort

    console.log(keyword);
    const{docs,hasPrevPage, hasNextPage, nextPage, prevPage }=await productManager.getProducts(keyword,limit, page, sort)
    const products = docs
  
    //res.send(products)
    //console.log('aqui van los productos', products)
    res.render('index',{
      products,
      title: "FASHION PRODUCTS", 
      style: "home",
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})


router.get("/realtimeproducts", async (req, res) => {
  const io = req.app.get("socketio")
  const products = await productManager.getProducts();
  
  res.render("realTimeProducts", { products,
    title: "FASHION - Real Time Products",
    style: "home",
  })
  io.on("connection", (socket) => {
    console.log("Client Conected")
    socket.emit("products", products)
  })
})

router.get("/chat", (req, res) => {
  res.render("chat", { style: "chatStyles" })
})

export default router;