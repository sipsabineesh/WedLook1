var User = require('../model/userModel')
const { ObjectId } = require("mongodb");

exports.loadWishList = async (req,res) => {
    if(req.session.loggedIn) {
    const user = req.session.user
    try {
      return new Promise((resolve, reject) => {
        User.aggregate([
          {
            $match: {
              _id: new ObjectId(user._id),
            },
          },
          {
            $unwind: "$wishlist",
          },
          {
            $project: {
              productId: "$wishlist.productId",
              addedDate: "$wishlist.addedDate",
            },
          },
          {
            $lookup: {
              from: "product",
              localField: "_id",
              foreignField: "wishlist.productId",
              as: "wishlisted",
            },
          },
          
        ]).then((wishlisted) => {
          console.log("productsssssss     :")
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

User.findByIdAndUpdate(user._id,updateData,{useFindAndModify:false})
// User.updateOne({ _id:  new ObjectId(user._id)},
// {
//     $push: {
//         wishlist: {
//          productId: id
//         }
//     }
// }
// )
.then(data =>{
   if(!data){
       res.status(404).send({message:`Cannot update  with ${id}.May be user not found`})
   }
   else{
       res.send(data)
   }
})
.catch(err =>{
   res.status(500).send({message:"Error Update userinformation"})
})
}