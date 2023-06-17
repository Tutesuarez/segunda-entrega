import { Router } from "express"
import CartManager from "../controller/MongoDbManagers/CartManager.js"

const router = Router()

const cartManager = new CartManager()

router.post("/", async (req, res) => {
  let resp = await cartManager.addCart()
  res.send({ resp })
})

router.get("/:cid", async (req, res) => {
  let { cid } = req.params
  let resp = await cartManager.getCart(cid)

  resp?.error
    ? res.status(404).send({ resp })
    :res.send({ cart: resp }) 
})

router.post("/:cid/products/:pid", async (req, res) => {
  let { cid, pid } = req.params
  let resp = await cartManager.addProductToCart(cid, pid, req.body.quantity)
  resp?.error
    ? res.status(400).send({ ...resp })
    : res.send({ ...resp })
})

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  let resp = await cartManager.updateProducts(cid, products);
  resp?.error
    ? res.status(400).send({ ...resp })
    : res.send({ ...resp });
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  let resp = await cartManager.updateProductQuantity(cid, pid, quantity);
  resp?.error
    ? res.status(400).send({ ...resp })
    : res.send({ ...resp });
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  let resp = await cartManager.productDelete(cid, pid);
  resp?.error
    ? res.status(400).send({ ...resp })
    : res.send({ ...resp });
});

//Empty Cart
router.delete('/:cid', async (req,res)=>{
  const id = req.params.cid;
  try {
      const emptyCart = await cartManager.emptyCart(id);
      res.send({result: 'success', payload: emptyCart});
  } catch (error) {
      console.log(error);
      res.status(500).send({ error });
  }
})

export default router