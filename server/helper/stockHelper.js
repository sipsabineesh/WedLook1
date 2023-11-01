const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Product = require('../model/productModel')
const User = require('../model/userModel')

exports.checkStock = async (userId) => {
    try {
        userId = new ObjectId(userId);
        const userCart = await User.findOne({ _id: userId }, { cart: 1 });
        const cartProducts = userCart.cart.cartItems
        for(const cartProduct of cartProducts ){
            const productId = cartProduct.productId;
            const product = await Product.findOne({_id:productId})
            if(product.stock < cartProduct.quantity ){
              return false
            }
          }
          return true
       
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
}


exports.updateStock = async (userId) => {
    try {
        userId = new ObjectId(userId);
        const userCart = await User.findOne({ _id: userId }, { cart: 1 });
        const cartProducts = userCart.cart.cartItems
        for(const cartProduct of cartProducts ){
            const productId = cartProduct.productId;
            const quantity = cartProduct.quantity;

            const product = await Product.findOne({_id:productId})
            if(product.productStock < cartProduct.quantity ){
              return false
            }

            await Product.updateOne({_id:productId},
                {$inc:{productStock:-quantity}}
                )
          }
          return true
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
}


exports.checkProductStock = async (productId) => {
  try {
       productId = new ObjectId(productId);
     
          const product = await Product.findOne({_id:productId})
            .then( productAvailability => {
              if(productAvailability.stock <= 0 ){
                return false
              }
            return true
            })
         
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
}