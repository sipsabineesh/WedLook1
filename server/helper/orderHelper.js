const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const dotenv = require('dotenv')
const path = require('path')
const Razorpay = require('razorpay');
const crypto = require("crypto");
const Product = require('../model/productModel')
const User = require('../model/userModel')
const Address = require('../model/addressModel')
const Order = require('../model/orderModel')
const stockHelper = require('../helper/stockHelper')


dotenv.config({path :'config.env'})

var instance = new Razorpay({ 
   key_id:  process.env.RAZORPAY_KEY_ID,
   key_secret:  process.env.RAZORPAY_KEY_SECRET
 })

exports.placeOrder = async (data,user)=>{
  try { 
    const userId = user._id
    return new Promise((resolve, reject) => {
      User.aggregate([
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

      ]).then(async (cartDetails) => {
        
        try{
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
          ]).then( async(totalCartPrice) => {
           
            if (totalCartPrice.length > 0) {
              let totalPrice = totalCartPrice[0].totalPrice;
  console.log("CART TOTAL WITH CHKOUT  TOTAL")
  console.log(totalPrice + "            IS IT EQUAL TO                "+data.totalAmountAfterDiscount) 
              //to avoid multiple cart issue
              if(totalPrice !== data.totalAmountAfterDiscount){
   console.log("CART TOTAL AND CHKOUT TOTAL DIFFERENCE should redirect")
              }
              if(data.totalAmountAfterDiscount > 0){
                totalPrice = data.totalAmountAfterDiscount
              }  if(data.totalAmountAfterDiscount > 0){
                totalPrice = data.totalAmountAfterDiscount
              }
            const activeAddresses = await Address.aggregate([
              {
                $match: {
                  user:new mongoose.Types.ObjectId(userId),
                  'addresses.isActive': true, 
                },
              },
              {
                $unwind: '$addresses', // Unwind the addresses array
              },
              {
                $match: { 'addresses.isActive': true }, // Filter active addresses again
              },
              {
                $group: {
                  _id: '$_id',
                  addresses: { $push: '$addresses' }, // Push the filtered addresses into an array
                },
              },
            ])  
              .then(async (addressDetails) => {
              let status,orderStatus
              if(data.paymentMethod === 'cod'){
                (status = "Success"), (orderStatus = "Placed");
              }
              else if (data.paymentMethod === "wallet") { 
                const userData = await User.findById({ _id:new mongoose.Types.ObjectId(userId) });
                  userData.wallet -= totalPrice;
                  await userData.save();
                  (status = "Success"), (orderStatus = "Placed");
                  const walletTransaction = {
                    date:new Date(),
                    type:"Debit",
                    amount:totalPrice,
                  }
                  const walletupdated = await User.updateOne(
                    { _id: user },
                    {
                      $push: { walletTransaction: walletTransaction },
                    }
                  )
              }
              else {
                (status = "Pending"), (orderStatus = "Pending");
              }
            
                 const orderData = {
                  _id: new ObjectId(),
                  name: user.name,
                  paymentStatus: status,
                  paymentMethod: data.paymentMethod,
                  productDetails: cartDetails,
                  shippingAddress: addressDetails[0],
                  orderStatus: orderStatus,
                  totalPrice:totalPrice,
                  discountPercentage:data.discountPercentage,
                  discountAmount:data.discountAmount,
                  couponCode:data.couponCode,
                  cancelStatus:'false',
                  createdAt:new Date()
                };
                
  
                const order = await Order.findOne({ user:new mongoose.Types.ObjectId(userId)  });
                if (order) {
                  await Order.updateOne(
                    { user:new mongoose.Types.ObjectId(userId) },
                    {
                      $push: { orders: orderData },
                    }
                  ).then((response) => {
                    resolve(response);
                  });
                } else {
                  const newOrder = Order({
                    user: userId,
                    orders: orderData,
                  });
                  await newOrder.save().then((response) => {
                      resolve(response);
                    });
                  }
            })
          } 
          })
          // .catch({
        
          // })
        }
        catch(err){
          console.log(err.message);
        }
     
       });
    })
  }
  catch(error) {
    console.log(error.message);
  }
 

}


exports.generateRazorpay = (userId)=> {
  try {
    return new Promise(async (resolve, reject) => {
      let orders = await Order.find({ user: userId });
      console.log("orders")
      
      let order = orders[0].orders.slice().reverse();
      console.log(order[0])
      let orderId = order[0]._id;
      let total = order[0].totalPrice
      var options = {
        amount: total * 100, 
        currency: "INR",
        receipt: "" + orderId,
      };
      
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          resolve(order);
        }
      });
    });
  } catch (error) { 
    console.log(error.message);
  }
}

exports.getCartTotal = async (userId) => {
  try {
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
    ]);
    const cartTotal = totalCartPrice[0].totalPrice;
    return cartTotal;
  } catch (error) {
    console.log(error.message);
    throw error; // Rethrow the error so it can be caught by the caller.
  }
}

exports.verifyPayment =  async(details) => {
  try {
    await Order.updateOne({})

    let key_secret = process.env.RAZORPAY_KEY_SECRET;
    return new Promise((resolve, reject) => {
      let hmac = crypto.createHmac("sha256", key_secret);


      hmac.update(
        details.payment.razorpay_order_id +
          "|" +
          details.payment.razorpay_payment_id
      );
      hmac = hmac.digest("hex");
      if (hmac == details.payment.razorpay_signature) {

        resolve();
      } else {
        reject("not match");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

// change payment status
exports.changePaymentStatus =  (userId, orderId,razorpayId) => {
  try {
    return new Promise(async (resolve, reject) => {
      await Order.updateOne(
        { "orders._id": new ObjectId(orderId) },
        {
          $set: {
            "orders.$.orderStatus": "Placed",
            "orders.$.paymentStatus": "Success",
            "orders.$.razorpayId": razorpayId
          },
        }
      ),
        await stockHelper.updateStock(userId)
        const updatedUser = await User.findByIdAndUpdate(userId, { $unset: { cart: 1 } }, { new: true })
        .then(() => {
          resolve();
        });
    });
  } catch (error) { 
    console.log(error.message);
  }
}

exports.findOrder  = (orderId, userId) => { 
  try {
    return new Promise((resolve, reject) => {
      Order.aggregate([
        {
          $match: {
            "orders._id": new ObjectId(orderId),
            user: new ObjectId(userId),
          },
        },
        { $unwind: "$orders" },
      ]).then((response) => {
        let orders = response
          .filter((element) => {
            if (element.orders._id == orderId) {
              return true;
            }
            return false;
          })
          .map((element) => element.orders);

        resolve(orders);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
}

exports.cancelOrder = (orderId,status) => { 
  try {
    return new Promise((resolve, reject) => {
      Order.updateOne(
        { "orders._id": new ObjectId(orderId) },
        {
          $set: { "orders.$.orderStatus": status },
        }
      ).then((response) => {
        resolve(response);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
}

exports.getOrderList = (page, limit) => {
  return new Promise((resolve, reject) => {
    Order.aggregate([
      { $unwind: "$orders" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ])
      .then((totalOrders) => {
        const count = totalOrders.length > 0 ? totalOrders[0].count : 0;
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const startSerialNumber = (page - 1) * limit + 1;

        Order.aggregate([
          { $unwind: "$orders" },
          { $sort: { "orders.createdAt": -1 } },
          { $skip: skip },
          { $limit: limit },
        ])
          .then((orders) => {
            resolve({ orders, totalPages, page, limit, startSerialNumber });
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};

exports.totalCheckOutAmount = async (userId) => {
  try {
    return new Promise(async(resolve, reject) => {
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
      ])

    })
  
  } catch (error) {
    console.log(error.message);
  }
}

exports.getWalletBalance = async (userId) => { console.log("in order helper get wallet ")
  try {
   
     const wallet = await User.findOne({_id:new ObjectId(userId)},{wallet:1})
      return wallet
   
  }
  catch (error) {
    console.log(error.message);
  }

}