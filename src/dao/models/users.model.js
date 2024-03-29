import mongoose from "mongoose"

mongoose.pluralize(null)

const collection = 'users'

const schema = new mongoose.Schema({
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
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
    },
    role: {
        type: String,
        default: 'user',
    },
})

const model = mongoose.model(collection, schema)
export default model