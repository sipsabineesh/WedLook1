const mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productCategory:{
        type:String,
        required:true
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productStock: {
        type: Number,
        required: true,
    },
    productDescription:{
        type:String
    },
    productImage: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
})

const Product = mongoose.model('product',productSchema)

module.exports = Product