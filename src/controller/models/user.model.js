import { Schema, model } from "mongoose"

const userCollection = 'user'

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
      }
});

export const userModel = model(userCollection, userSchema)