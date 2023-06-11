import { Router } from "express";
import ProductManager from "../controller/MongoDbManagers/ProductManager.js";
import { uploader } from "../path.js";


const router = Router();

const productManager = new ProductManager();

const options = {
  allowProtoPropertiesByDefault: true
};
router.get("/", async (req, res) => {
  try {
    let keyword = req.query.keyword
    let limit = parseInt(req.query.limit, 10) || 10
    let page = parseInt(req.query.page, 10) || 1
    const sort = req.query.sort
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productManager.getProducts(keyword,limit, page, sort)
    //const products=JSON.stringify(docs)
    //console.log(products);
    //res.send(products)
    const products = docs.map((prod) => ({
      title: prod.title,
      _id: prod._id,
      description: prod.description,
      price: prod.price,
      thumbnails: prod.thumbnails,
      code: prod.code,
      stock: prod.stock,
      category: prod.category,
      status: prod.status,
    }))

    res.render('index', 
    {
      products,
      //products: JSON.parse(products),
      // products: docs.map((prod)=>({
      //   title: prod.title,
      //   _id: prod._id,
      //   description: prod.description,
      //   price: prod.price,
      //   thumbnails: prod.thumbnails,
      //   code: prod.code,
      //   stock: prod.stock,
      //   category: prod.category,
      //   status: prod.status,
      // })),
      title: "FASHION PRODUCTS",
      style: "home",
      hasPrevPage,
      hasNextPage,
      nextPage,
      prevPage,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
})


router.get("/:pid", async (req, res) => {
  let { pid } = req.params;
  let resp = await productManager.getProductById(pid);
  resp?.error
    ? res.status(404).send({ ...resp })
    : res.send({ product: resp })
})

router.post("/", uploader.array("thumbnails"), async (req, res) => {
  const { files, body } = req
  let product = { ...body, status: true }
  let thumbnails = files.map((file) => file.originalname)
  product.thumbnails = thumbnails
  const io = req.app.get("socketio")
  let resp = await productManager.addProduct(product)
  let resp2 = await productManager.getProducts()
  res.send(resp)
  io.emit("products", resp2)
})

router.delete("/:pid", async (req, res) => {
  let { pid } = req.params
  const io = req.app.get("socketio")
  let resp = await productManager.deleteProduct(pid)
  let resp2 = await productManager.getProducts()
  res.send(resp)
  io.emit("products", resp2)
})

router.put("/:pid", async (req, res) => {
  let { pid } = req.params
  let changes = req.body

  let resp = await productManager.updateProduct(pid, changes)
  resp?.error
    ? res.status(400).send({ ...resp })
    : res.send({ product: resp })
})

export default router