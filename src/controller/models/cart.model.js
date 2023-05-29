import { Schema, model } from "mongoose"

const cartsCollection = 'carts'

const cartSchema = new Schema({
    products: {
        type:
        [ {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }],
        default: [],
        require: true
    },
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product');
    next();
})


export const cartModel = model(cartsCollection, cartSchema)
