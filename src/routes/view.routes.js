import { Router } from "express"
import ProductManager from "../controller/MongoDbManagers/ProductManager.js"
import { getUser } from "../controller/user.controller.js"

const router = Router();

const productManager = new ProductManager()


const publicAccess = (req, res, next) =>{
  if(req.session.user) return res.redirect('/')
  next();
};

const privateAccess = (req, res, next) =>{
  if(!req.session.user) return res.redirect('/login')
  next();
}


router.get("/",privateAccess ,async(req, res) => {
  try {
    let keyword = req.query.keyword
    let limit = parseInt(req.query.limit, 10) || 10
    let page = parseInt(req.query.page, 10) || 1
    const sort = req.query.sort

    console.log(keyword);
    const{docs,hasPrevPage, hasNextPage, nextPage, prevPage }=await productManager.getProducts(keyword,limit, page, sort)

    const products = JSON.stringify(docs)
    
    res.render('index',{
      name: req.session.user.first_name,
      products:JSON.parse(products),
      title: "FASHION PRODUCTS", 
      style: "home",
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
      user: { email: req.session.email, rol: req.session.rol, name: req.session.name },
      logued: true,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})


router.get("/realtimeproducts",privateAccess, async (req, res) => {
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

router.get('/', publicAccess, async (req, res) => {
  res.render('login')
});

router.get('/register', publicAccess, (req, res) => {
  res.render('register')
});

router.get('/login', publicAccess, (req, res) => {
  res.render('login');
});

router.get('/perfil', async (req, res) => {  // falaria un auth
  const user = req.session.user
  res.render('perfil',
  {
    user,
    title: "User",
    style: "home",
    logued: true,
  })
})

router.get('/errorlogin', (req,res)=>{
  res.render('errorLogin')
}) 

router.get('/errorsingup', (req,res)=>{
  res.render('errorSingup')
})

router.get('/', privateAccess, (req, res) => {
  res.redirect('/products')
});


router.get("/chat",privateAccess ,(req, res) => {
  res.render("chat", { style: "chatStyles" })
})


export default router;