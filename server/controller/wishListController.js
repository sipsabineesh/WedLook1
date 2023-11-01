var User = require('../model/userModel')
var Product = require('../model/productModel')
const Mongoose= require("mongoose");
const { ObjectId } = require("mongodb");


exports.loadWishList = async (req,res) => {
    if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
    console.log("  userId   "+userId)
    try {
      return new Promise((resolve, reject) => {
       User.aggregate([
        {
          $match: {
            _id: new Mongoose.Types.ObjectId(userId),
            wishlist: { $exists: true, $ne: [] }, 
          },
        },
        {
          $unwind: '$wishlist',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'wishlist.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $unwind: '$productDetails',
        },
        {
          $project: {
            _id: '$productDetails._id',
            productName: '$productDetails.productName',
            productCategory: '$productDetails.productCategory',
            productPrice: '$productDetails.productPrice',
            productStock: '$productDetails.productStock',
            productDescription: '$productDetails.productDescription',
            productImage: '$productDetails.productImage',
            addedDate: '$wishlist.addedDate',
          },
        },
 
        ]).then((wishlisted) => {
          console.log(wishlisted)
         // res.send(wishListed);
       
           res.render('user/view-wishlist',{user,wishlisted});
       
         });
       });
     } catch (error) {
       console.log(error.message);
     }
    }
    else {
       res.render('user/login',{"errMsg":"Please Login"})
    }
  
   }
  
exports.addToWishList = (req,res) => { 
    const id = req.params.id
   var updateData = {
    $push: {
                 wishlist: {
                  productId: id
                 }
             }
    }
 const user = req.session.user
 User.findOne({
  _id: user._id,
  'wishlist.productId': new Mongoose.Types.ObjectId(id)
})
.then((productExists) => {
  console.log(productExists)
 // res.send(wishListed);


 console.log("PRODUCT EXISTS OR NOT")
 console.log(productExists)
 if(!productExists){
  User.findByIdAndUpdate(user._id,updateData,{useFindAndModify:false})
    .then(data =>{
     if(!data){
         res.status(404).send({message:`Cannot update  with ${id}.May be user not found`})
     }
     else{
         res.send(true)
     }
  })
  .catch(err =>{
     res.status(500).send({message:"Error Update userinformation"})
  })
 }
else {
   res.send(false)
 }
})
}