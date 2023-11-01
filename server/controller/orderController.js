const Mongoose = require('mongoose');
const ObjectId = Mongoose.Types.ObjectId;
const User = require('../model/userModel')
const Address = require('../model/addressModel')
const Order = require('../model/orderModel')

const stockHelper = require('../helper/stockHelper')
const orderHelper = require('../helper/orderHelper')
const couponHelper = require('../helper/couponHelper')

exports.loadCheckOut=async (req,res) => { 
    if(req.session.loggedIn) {
        const user = req.session.user
        const userId = user._id
     try{
        const activeAddress = await Address.aggregate([
            {
              $match: {
                user:new Mongoose.Types.ObjectId(userId),
              },
            },
            {
              $unwind: "$addresses",
            },
            {
                $match: {
                  "addresses.isActive": true,
                },
              },
              {
                $project: {
                  user: 0, 
                },
              },
          
          ]);
          const addresses = await Address.aggregate([
            {
              $match: {
                user:new Mongoose.Types.ObjectId(userId),
              },
            },
            {
              $unwind: "$addresses",
            },
          ]);
           const cart = await User.aggregate([
              {
                $match: { 
                  _id: new ObjectId(userId),
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
    
            ])

   
          console.log(cart)

          const totalCartPrice = await User.aggregate([
            {
              $match: {
                _id: new ObjectId(userId)
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
               res.render('user/check-out',{user,activeAddress,addresses,cart,totalPrice})
            } else {
              return 0; 
            }
          })
     }
     catch(error){
         console.log(error);
     }
    }
    else {
        res.render('user/login',{"errMsg":"Please Login"})
     }
   
 }

 exports.addAddress=async (req,res) => {
    if(req.session.loggedIn) {
        const user = req.session.user
        const userId = user._id
        var isActive = false
     try{
        if(!req.body){
            res.status(400).send({message:"Content cannot be empty"})
            return
        }
        console.log("req.body.isActive: "+req.body.isActive)
        if(req.body.isActive == "on") 
          isActive = true
        else
          isActive = false
const addresses = {
                    name:req.body.name,
                    email:req.body.email,
                    address:req.body.address,
                    locality:req.body.locality,
                    city:req.body.city,
                    state:req.body.state,
                    pincode:req.body.pincode,
                    mobileNumber:req.body.mobileNumber,
                    isActive:isActive
}
        //new address
        const address = new Address({
               user:new Mongoose.Types.ObjectId(userId),
               addresses:[addresses]
            },
           )
        //save address in the database
        address
            .save(address)
            .then(async(data) =>{
              // const addressId =  data._id
              // console.log("addressId :   "+addressId)
              // await Address.updateMany(
              //   { 'addresses._id': { $ne: addressId} }, 
              //   { $set: { 'addresses.isActive': false } }
              // );
              // console.log("reached --")
                 res.send("success")
            })
            .catch(err => {
                res.status(500).send({
                    message:err.message || "Some error occured while creating create operation"
                })
            })
     }
     catch(error){
         console.log(error);
     }
    }
    else {
        res.render('user/login',{"errMsg":"Please Login"})
     }
 }

 
 exports.editAddress=async (req,res) => {
    if(!req.body){
           return res
           .status(400)
           .send({message:"Data to update cannot be empty"})
     }
   
     const id = req.params.id
     const user=req.session.user
     const userId = user._id
     const updatedData = req.body
   
Address.updateOne(
  {
    user: new Mongoose.Types.ObjectId(userId),
    "addresses._id": new Mongoose.Types.ObjectId(id),
  },
  {
    $set: {
      "addresses.$.name": updatedData.name,
      "addresses.$.email": updatedData.email,
      "addresses.$.address": updatedData.address,
      "addresses.$.locality": updatedData.locality,
      "addresses.$.city": updatedData.city,
      "addresses.$.state": updatedData.state,
      "addresses.$.pincode": updatedData.pincode,
      "addresses.$.mobileNumber": updatedData.mobileNumber,
      "addresses.$.isActive": true, // Set isActive to true
    },
  })
    // const result = await Address.aggregate([
    //     {
    //       $match: { "addresses._id": new Mongoose.Types.ObjectId(id) }
    //     },
    //     {
    //       $set: {addresses:{mobileNumber: updatedData.mobileNumber}}
    //     }
    //   ])
    .then(data =>{
      console.log("------------------------------")
    console.log(data)
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

 exports.checkOut=async (req,res) => { 
    if(req.session.loggedIn) {
        const user = req.session.user
        const userId = user._id
        const data = req.body;
   console.log("Data-------------------------------");
   console.log(data) 
   console.log("---------------USER------------") 
   console.log(user) 
        const couponCode = data.couponCode
         await couponHelper.addCouponToUser(couponCode, userId);

    try {  
        const checkStock = await stockHelper.checkStock(userId)
        if(checkStock){
          const carttotal = await orderHelper.getCartTotal(userId) 
          if(carttotal === data.totalAmountAfterDiscount){
            if(req.body.paymentMethod === "cod"){
              const updatedStock = await stockHelper.updateStock(userId)
              const response = await orderHelper.placeOrder(req.body,user)
              const updatedUser = await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } }, { new: true });  
              res.send({ codStatus: true });
          } 
          else if (req.body.paymentMethod === "wallet") {
            const userWallet = await orderHelper.getWalletBalance(user._id)
            if(userWallet.wallet < data.totalAmountAfterDiscount){
              res.json({walletstatus:false ,message:"Insufficient Wallet Balance"})
            }
            else{
              const response = await orderHelper.placeOrder(req.body,user);
          console.log("RSPNSE wallet: "+response)                  
              const updatedStock = await stockHelper.updateStock(userId)
              res.json({ orderStatus: true, message: "order placed successfully" });
              const updatedUser = await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } }, { new: true }); 
            // res.send({orderStatus: true}) 
            }
          } 
          else if (req.body.paymentMethod === "onlinePayment") { 
              const response = await orderHelper.placeOrder(req.body,user);
          console.log("RSPNSE onlinepaymt : "+response)                  
              const order = await orderHelper.generateRazorpay(userId);
              res.json(order);
            }
          else{
            res.json({ status: 'OrderFailed' });
          }
          }
          else
          {
            res.json({ orderStatus: false, message: "Difference in Cart and CheckOut Total" });
          }
           
        }
        else{
          res.send("Out Of Stock")
        }
    }
catch(err){
  console.log(err)
}
}
 }

 

 

exports.verifyPayment =  (req, res) => {
  const orderId = req.body.order.receipt
  const user = req.session.user
  orderHelper.verifyPayment(req.body).then(() => {
    orderHelper
      .changePaymentStatus(user._id, req.body.order.receipt,req.body.payment.razorpay_payment_id)
      .then(() => {
        res.json({ status: true });
      })
      .catch((err) => {
        res.json({ status: false });
      });
  }).catch(async(err)=>{
    
    console.log(err);

  });
}

exports.paymentFailed = async(req,res)=>{
  try {
    const order = req.body
    const deleted = await Order.updateOne(
      { "orders._id": new ObjectId(order.order.receipt) },
      { $pull: { orders: { _id:new ObjectId(order.order.receipt) } } }

    )
    res.send({status:true})
  } catch (error) {
    
  }
  
}

exports.listOrders = async(req,res)=>{
  if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
    try {
      return new Promise(async (resolve, reject) => {
        const orders = await Order.aggregate([
          { $match:{user:new Mongoose.Types.ObjectId(userId)}},
          { $unwind: "$orders" },
          { $sort: { "orders.createdAt": -1 } },
        ]).then((orders) => {
          // console.log("ORDERSSSSSS")
          // console.log(orders)
           res.render('user/view-orders',{user,orders});
       
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


exports.getOrderDetails = async(req,res)=>{
  if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
    try {
        const id = req.query.id
        orderHelper.findOrder(id, user._id).then((orders) => {
        const address = orders[0].shippingAddress
        const products = orders[0].productDetails 
      
        console.log("orders")
        console.log(orders)

           res.render('user/view-order-details',{user,orders,address,products});
      }) 
     } catch (error) {
       console.log(error.message);
     }
    }
    else {
       res.render('user/login',{"errMsg":"Please Login"})
    }
}


exports.cancelOrder = async(req,res)=>{
  if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
    const orderId =req.body.orderId
    const status = req.body.status
    const cancel = orderHelper.cancelOrder(orderId,status).then((response) => {
      res.send(response);
    });
  }

}


exports.orderList = (req, res) => {
  const defaultPerPage = 10;
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || defaultPerPage; 
  const skip = (page - 1) * limit;
  
  orderHelper
    .getOrderList(page, limit)
    .then(({ orders, totalPages, page, limit,startSerialNumber }) => {
     
      res.render("admin/view-order", {
        orders,
        totalPages,
        currentPage: page,
        pages: Math.ceil(totalPages / limit),
        selectedLimit:limit,
        limit: limit,
        startSerialNumber:startSerialNumber
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
  
}


exports.orderDetails = async (req,res)=>{ 
  try {
    const id = req.query.id
    const userId = req.query.user
    await orderHelper.findOrder(id,userId).then((orders) => {
      console.log(orders)
      const orderAddress = orders[0].shippingAddress
      const products = orders[0].productDetails 
      const address = orderAddress.addresses[0]
      res.render('admin/order-details',{orders,address,products})
    });      
  } catch (error) {
    console.log(error.message);
  }

}

exports.verifyCoupon = (req, res) => { console.log("VERIFY COUPON FNN IN CONTROLLER")
  const couponCode = req.params.id
  const user = req.session.user
  const userId= user._id
  
  console.log("userId:     "+userId)
  couponHelper.verifyCoupon(userId, couponCode).then((response) => {
      res.send(response)
  })
}

exports.applyCoupon =  async (req, res) => {
  const couponCode = req.params.id 
  const total = req.params.total
  const user = req.session.user
  const userId= user._id
  console.log("userId:     "+userId)
  //const total = await orderHelper.totalCheckOutAmount(userId) 
  console.log("total   : "+total)
  couponHelper.applyCoupon(couponCode, total).then((response) => {
      res.send(response)
  }) 
}

const comparingCartAmtWithChkoutAmount=async() =>{

}