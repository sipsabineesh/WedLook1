var Product = require('../model/productModel')
var User = require('../model/userModel')
const { ObjectId } = require("mongodb");


exports.addToCart=async (req,res) => {
   const productId = req.params.id
   const product = await Product.findOne({_id:productId})
   
    var updateData = {
        $push: {
             "cart.$eleMatch.cartItems":{
                      productId: productId,
                      quantity:1
                     }
                }
        }
         
    if(req.session.loggedIn) {
    const user = req.session.user
    console.log(updateData)
    const userCarrt = await User.find(
        {
            cart:{
                "$elemMatch": {
                  cartItems: {
                    $ne: null
                  }
                }
              }
        })
    .then(users => {
        if(users){
//add to cart
        }
        else
        {
//create new cart
User.findByIdAndUpdate(user._id,updateData,{useFindAndModify:false})
        }
        console.log(users)

    })
    }
}