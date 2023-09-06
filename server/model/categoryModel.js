const mongoose = require('mongoose')

var categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    categoryDescription:{
        type:String
    },
    categoryImage: {
        type: Array,
    },
    date: {
        type: Date,
        //default: Date.now,
      }
})

const Category = mongoose.model('category',categorySchema)

module.exports = Category