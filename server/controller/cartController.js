var Product = require('../model/productModel')
var User = require('../model/userModel')
const Mongoose= require("mongoose")
// const { ObjectId } = require("mongodb");
const stockHelper = require('../helper/stockHelper')

exports.loadCart = async(req,res) => {
  if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
    try {
      return new Promise((resolve, reject) => {
        User.aggregate([
          {
            $match: { 
              _id: new Mongoose.Types.ObjectId(userId),
              cart: { $exists: true, $ne: [] },  },
          },
          {
            $unwind: '$cart.cartItems', 
          },
          {
            $lookup: {
              from: 'products', 
              localField: 'cart.cartItems.productId',
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
              quantity: '$cart.cartItems.quantity'
            },
          },

        ]).then(async (cartDetails) => {
          try{
            const totalCartPrice = await User.aggregate([
              {
                $match: {
                  _id:new Mongoose.Types.ObjectId(userId)
                }
              },
              {
                $unwind: '$cart.cartItems'
              },
              {
                $lookup: {
                  from: 'products', 
                  localField: 'cart.cartItems.productId',
                  foreignField: '_id',
                  as: 'product'
                }
              },
              {
                $unwind: '$product'
              },
              {
                $group: {
                  _id: null,
                  totalPrice: {
                    $sum: {
                      $multiply: ['$product.productPrice', '$cart.cartItems.quantity']
                    }
                  }
                }
              }
            ]).then( totalCartPrice => {
              if (totalCartPrice.length != 0) {
                const totalPrice = totalCartPrice[0].totalPrice;
                console.log('Total Price IN GETTOTAL:', totalPrice);
                res.render('user/view-cart',{user,cartDetails,totalPrice});
              } else {
                res.render('user/view-cart',{user,cartDetails,totalPrice:0});
              }
            })
            // .catch({
          
            // })
          }
          catch(err){
        
          }
       
         });
      })
    }
    catch(error) {
      console.log(error.message);
    }
 
  }
  else {
    res.render('user/login',{"errMsg":"Please Login"})
 }

 
}

exports.addToCart=async (req,res) => {
   
  if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
  
  const productId = req.params.id
  
var quantity = 1
const product = await Product.findOne({_id:productId})
.then( async (productAvailability )=> {
  console.log(productAvailability.productStock)
  if(productAvailability.productStock <= 0 ){
    res.send("Out Of Stock")
  }
  else {
    const cartChk = await User.aggregate([
      {
        $match: { _id: new Mongoose.Types.ObjectId(userId) }, 
      },
      {
        $unwind: '$cart.cartItems', 
      },
      {
        $match: {
          'cart.cartItems.productId': new Mongoose.Types.ObjectId(productId), 
        },
      },
      {
        $limit: 1, 
      },
    ])
      .then(async (isProductInCart) => {
          if (!isProductInCart || isProductInCart.length === 0) { 
    const quantityToAdd = 1; 
    try {
      // Find the user by ID
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            'cart.cartItems': {
              productId: productId,
              quantity: quantityToAdd,
            },
          },
        },
        { useFindAndModify: false, new: true } // Setting new: true returns the updated user object
      );
    
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.send(true)
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
          } else {
            incrementQuantity = 1
            User.updateOne(
              {
                _id: new Mongoose.Types.ObjectId(userId),
                'cart.cartItems.productId':new Mongoose.Types.ObjectId(productId),
              },
              {
                $inc: {
                  'cart.cartItems.$.quantity': incrementQuantity,
                },
              }).then(async (quantityIncremented) => {
    
            })
    
           res.send(false)
        }
      })
  }
})

  }
  
}


const getTotalPrice = async(userId)=>{

  try{
    const totalCartPrice = await User.aggregate([
      {
        $match: {
          _id: new Mongoose.Types.ObjectId(userId)
        }
      },
      {
        $unwind: '$cart.cartItems'
      },
      {
        $lookup: {
          from: 'products', 
          localField: 'cart.cartItems.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: {
              $multiply: ['$product.productPrice', '$cart.cartItems.quantity']
            }
          }
        }
      }
    ]).then( totalCartPrice => {
      if (totalCartPrice.length > 0) {
        const totalPrice = totalCartPrice[0].totalPrice;
        resolve({'TotalPrice': totalPrice});
      } else {
        
        return 0; 
      }
    })
    // .catch({
  
    // })
  }
  catch(err){

  }

 } 

exports.incrementCartQuantity=async (req,res) => {
  if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
    const productId = req.params.prodId
    const qty = req.params.qty

var incrementQuantity = 1
const product = await Product.findOne({_id:productId})
.then( async (productAvailability )=> {
  if(productAvailability.productStock < qty){
    res.send("Out Of Stock")
  }
  else{
    User.updateOne(
      {
        _id:new Mongoose.Types.ObjectId(userId),
        'cart.cartItems.productId': new Mongoose.Types.ObjectId(productId),
      },
      {
        $inc: {
          'cart.cartItems.$.quantity': incrementQuantity,
        },
      }).then(async(result) => {
        try{
          const totalCartPrice = await User.aggregate([
            {
              $match: {
                _id: new Mongoose.Types.ObjectId(userId)
              }
            },
            {
              $unwind: '$cart.cartItems'
            },
            {
              $lookup: {
                from: 'products', 
                localField: 'cart.cartItems.productId',
                foreignField: '_id',
                as: 'product'
              }
            },
            {
              $unwind: '$product'
            },
            {
              $group: {
                _id: null,
                totalPrice: {
                  $sum: {
                    $multiply: ['$product.productPrice', '$cart.cartItems.quantity']
                  }
                }
              }
            }
          ]).then( totalCartPrice => {
            if (totalCartPrice.length > 0) {
              const totalPrice = totalCartPrice[0].totalPrice;
              console.log('Total Price IN GETTOTAL:', totalPrice);
              res.send({'TotalPrice': totalPrice});
            } else {
              return 0; 
            }
          })
          // .catch({
        
          // })
        }
        catch(err){
      
        }
      
      })
      .catch(err => {
        console.error('Error:', err);
      });

  }
})

}

}

exports.decrementCartQuantity=async (req,res) => {
    if(req.session.loggedIn) {
      const user = req.session.user
      const userId = user._id
      const productId = req.params.prodId
      var decrementQuantity = 1
  const decQuantity= await User.updateOne (
    {
      _id:new Mongoose.Types.ObjectId(userId),
      'cart.cartItems.productId': new Mongoose.Types.ObjectId(productId),
      'cart.cartItems.quantity': { $gt: 1 }
    },
    {
      $inc: {
        'cart.cartItems.$.quantity': -decrementQuantity,
      },
    }) 
    .then(async (result) => {
    //  const TotalPrice = await  getTotalPrice(userId) 
    try{
      const totalCartPrice = await User.aggregate([
        {
          $match: {
            _id: new Mongoose.Types.ObjectId(userId)
          }
        },
        {
          $unwind: '$cart.cartItems'
        },
        {
          $lookup: {
            from: 'products', 
            localField: 'cart.cartItems.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: '$product'
        },
        {
          $group: {
            _id: null,
            totalPrice: {
              $sum: {
                $multiply: ['$product.productPrice', '$cart.cartItems.quantity']
              }
            }
          }
        }
      ]).then( totalCartPrice => {
        if (totalCartPrice.length > 0) {
          const totalPrice = totalCartPrice[0].totalPrice;
          res.send({'TotalPrice': totalPrice});
        } else {
          return 0; 
        }
      })
      // .catch({
    
      // })
    }
    catch(err){
  
    }
  
    })
    .catch(err => {
      console.error('Error:', err);
    });
  }
  else {
  
  }
  
}


 exports.removeCartProduct =  async (req,res) => {
  if(req.session.loggedIn) {
    const prodId = req.params.prodId;
    const user = req.session.user
    const userId = user._id
    // const product =  Product.findOne({_id:prodId})
    // const cart =  User.findOne({ _id: userId, "cart.cartItems.productId": prodId });
    
    return new Promise(async (resolve, reject) => {
      try {
        
        const result = await User.updateOne(
          {
            _id: new Mongoose.Types.ObjectId(userId),
          },
          {
            $pull: {
              'cart.cartItems': {
                productId: new Mongoose.Types.ObjectId(prodId),
              },
            },
          }

      ).then(() => {
          //resolve({ status: true });
          try {
            return new Promise((resolve, reject) => {
              User.aggregate([
                {
                  $match: { 
                    _id: new Mongoose.Types.ObjectId(userId),
                    cart: { $exists: true, $ne: [] },  },
                },
                {
                  $unwind: '$cart.cartItems', 
                },
                {
                  $lookup: {
                    from: 'products', 
                    localField: 'cart.cartItems.productId',
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
                    quantity: '$cart.cartItems.quantity'
                  },
                },
      
              ]).then(async (cartDetails) => {
                try{
                  const totalCartPrice = await User.aggregate([
                    {
                      $match: {
                        _id: new Mongoose.Types.ObjectId(userId)
                      }
                    },
                    {
                      $unwind: '$cart.cartItems'
                    },
                    {
                      $lookup: {
                        from: 'products', 
                        localField: 'cart.cartItems.productId',
                        foreignField: '_id',
                        as: 'product'
                      }
                    },
                    {
                      $unwind: '$product'
                    },
                    {
                      $group: {
                        _id: null,
                        totalPrice: {
                          $sum: {
                            $multiply: ['$product.productPrice', '$cart.cartItems.quantity']
                          }
                        }
                      }
                    }
                  ]).then( totalCartPrice => {
                    if (totalCartPrice.length > 0) {
                      const totalPrice = totalCartPrice[0].totalPrice;
                      console.log('Total Price IN GETTOTAL:', totalPrice);
                      res.render('user/view-cart',{user,cartDetails,totalPrice:totalPrice});
                    } else {
                      res.render('user/view-cart',{user,cartDetails,totalPrice:0});
                    }
                  })
                  // .catch({
                
                  // })
                }
                catch(err){
              
                }
               });
            })
          }
          catch(error) {
            console.log(error.message);
          }
        });
      } catch (error) { 
        throw error;
      }
    })
  }
 
 }



