import ProductManager from "./ProductManager.js"
import { cartModel } from "../models/cart.model.js"

export default class CartManager {
  async addCart() {
    try {
      let result = await cartModel.create({ products: [] })
      return result
    } catch (error) {
      return { error: `The cart was not created.`, payload: error }
    }
  }

  async getCarts() {
    let result = await cartModel.find({}, { __v: 0 })
    return result
  }

  async getCart(id) {
    try {
      let result = await cartModel.findOne({ _id: id }, { __v: 0 })

      if (result.length === 0) throw new Error(`The cart not exist.`)
      console.log(result);
      return result
    } catch (error) {
      return { error: error.message }
    }
  }

  async addProductToCart(cid, pid, quantity) {
    try {
        const carts = await cartModel.find({ _id: cid })
        const cart = carts[0]

        let productExist = cart.products.find(({ product }) => product._id.toString() === pid);
      let result;
      if (productExist) {
        result = await cartModel.updateOne(
          { _id: cid, "products.product": pid },
          { $inc: { "products.$.quantity": quantity } }
        );
      } else {
        result = await cartModel.updateOne(
          { _id: cid },
          { $push: { products: { product: pid, quantity: quantity } } }
        );
      }
        return {
                success: `The product was added successfully`
              }
    } catch (error) {
        console.error(error)
        throw new Error(`Could not add product with ID ${pid} to cart with ID ${cid}.`)
    }
}

  async productDelete(cid, pid) {
    try {
      const cart = await cartModel.findById(cid)
      const product = cart.products.find(prod => prod._id.toString() === pid)
  
      if (product) {
        await product.deleteOne({_id: pid})
        await cart.save()
        console.log('Product successfully deleted from cart.')
        return {
          success: 'Product successfully removed from cart.',
        }
      } else {
        throw new Error(`Product with ID ${pid} not found in cart with ID ${cid}.`)
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  emptyCart = async (cid) => {
    try {
      const result = await cartModel.updateOne({ _id: cid }, { products: [] });
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  async updateProducts(cid, products) {
    try {
      const result = await cartModel.updateOne(
        { _id: cid },
        { $set: { products: products } }
      );
      return { success: `The products were successfully updated`, payload: result };
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const result = await cartModel.updateOne(
        { _id: cid, "products._id": pid },
        { $set: { "products.$.quantity": quantity } }
      );
      return { success: `The product quantity was successfully updated`, payload: result };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  async checkIfProductExist(pid) {
    let productManager = new ProductManager()
    let product = await productManager.getProductById(pid)
    return product
  }
}
