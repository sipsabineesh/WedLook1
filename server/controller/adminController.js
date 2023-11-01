
const Mongoose= require("mongoose");

const User = require('../model/userModel')
const Order = require('../model/orderModel');
const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const adminHelper = require('../helper/adminHelper')
const orderHelper = require('../helper/orderHelper')
const bcrypt = require('bcryptjs')


exports.login=(async(req,res) => {
  var errMsg="";
  try {
      // check if the user exists
      const user = await User.findOne({ email: req.body.email});
      if (user) {
        //check if password matches
              bcrypt.compare(req.body.password, user.password, function (err, result) { 
              if (result == true) {
                   if(req.body.email === "admin@gmail.com"){
                       req.session.adminLoggedIn = true
                       res.redirect('/admin/dashboard');
                   }else{ 
                    errMsg = "Incorrect username"
                    res.redirect('/admin/login');
                  }
              } else {
              errMsg = "Incorrect password"
              //res.send('Incorrect password');
              res.render('admin/login',{"errMsg":errMsg});
              }
          });
      } else {
            errMsg = "Please enter valid admin email and password"
            res.render('admin/login',{"errMsg":errMsg});
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  })
  

exports.loadDashboard = async(req,res)=>{

    try {

  const orders = await Order.aggregate([
        { $unwind: "$orders" },
        {
          $match: {
            "orders.orderStatus": "Delivered"  // Consider only completed orders
          }
        },
        {
          $group: {
            _id: null,
            totalPriceSum: { $sum: { $toInt: "$orders.totalPrice" } },
            count: { $sum: 1 }
          }
        }
  
      ])
  
  
      // const categorySales = await Order.aggregate([
      //   { $unwind: "$orders" },
      //   { $unwind: "$orders.productDetails" },
      //   {
      //     $match: {
      //       "orders.orderStatus": "Delivered",
      //     },
      //   },
      //   {
      //     $project: {
      //       CategoryId: "$orders.productDetails.productCategory",
      //       totalPrice: {
      //         $multiply: [
      //           { $toDouble: "$orders.productDetails.productPrice" },
      //           { $toDouble: "$orders.productDetails.quantity" },
      //         ],
      //       },
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$CategoryId",
      //       PriceSum: { $sum: "$totalPrice" },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "categories",
      //       localField: "_id",
      //       foreignField: "_id",
      //       as: "categoryDetails",
      //     },
      //   },
      //   {
      //     $unwind: "$categoryDetails",
      //   },
      //   {
      //     $project: {
      //       categoryName: "$categoryDetails.categoryName",
      //       PriceSum: 1,
      //       _id: 0,
      //     },
      //   },
      // ]);
  
      const categorySales = await Order.aggregate([
        { $unwind: "$orders" },
        { $unwind: "$orders.productDetails" },
        {
          $match: {
            "orders.orderStatus": "Delivered",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "orders.productDetails.productCategory" , 
            foreignField: "_id",
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
        {
          $project: {
            categoryName: "$categoryDetails.categoryName",
            totalPrice: {
              $multiply: [
                { $toDouble: "$orders.productDetails.productPrice" },
                { $toDouble: "$orders.productDetails.quantity" },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$categoryName",
            PriceSum: { $sum: "$totalPrice" },
          },
        },
      ]);
      
      
      
      
  
      const salesData = await Order.aggregate([ 
        { $unwind: "$orders" }, 
        {
          $match: {
            "orders.orderStatus": "Delivered"  // Consider only completed orders
          }
        },
        {  
          $group: {  
            _id: {
              $dateToString: {  // Group by the date part of createdAt field
                format: "%Y-%m-%d",
                date: "$orders.createdAt"
              }
            },
            dailySales: { $sum: { $toInt: "$orders.totalPrice" } }  // Calculate the daily sales
          } 
        }, 
        {
          $sort: {
            _id: 1  // Sort the results by date in ascending order
          }
        }
      ])
  
      const salesCount = await Order.aggregate([
        { $unwind: "$orders" },
        {
          $match: {
            "orders.orderStatus": "Delivered"  
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {  // Group by the date part of createdAt field
                format: "%Y-%m-%d",
                date: "$orders.createdAt"
              }
            },
            orderCount: { $sum: 1 }  // Calculate the count of orders per date
          }
        },
        {
          $sort: {
            _id: 1  // Sort the results by date in ascending order
          }
        }
      ])
  
      const categoryCount  = await Category.find({}).count()
      const productsCount  = await Product.find({}).count()
      const onlinePay = await adminHelper.getOnlineCount()
      const walletPay = await adminHelper.getWalletCount()
      const codPay = await adminHelper.getCodCount()
  
      const latestorders = await Order.aggregate([
        {$unwind:"$orders"},
        {$sort:{
          'orders.createdAt' :-1
        }},
        {$limit:10}
      ]) 
  console.log("orders")
  console.log(orders)

 console.log("productsCount")
  console.log(productsCount)
  
  
 console.log("categoryCount")
 console.log(categoryCount)
 
 
 console.log("onlinePay")
  console.log(onlinePay)
  
  
 console.log("salesData")
 console.log(salesData)

 
 console.log("latestorders")
 console.log(latestorders)
  
 console.log("salesCount")
 console.log(salesCount)

 
 console.log("walletPay")
 console.log(walletPay)

 
 console.log("codPay")
 console.log(codPay)

 
 console.log("categorySales")
 console.log(categorySales)


 

        res.render('admin/dashboard',{orders,productsCount,categoryCount,
          onlinePay,salesData,order:latestorders,salesCount,
          walletPay,codPay,categorySales})
    } catch (error) {
        console.log(error)
    }
  }
  
  
exports.changeStatus = async(req,res)=>{
    const orderId = req.body.orderId
    const status = req.body.status
    adminHelper.changeOrderStatus(orderId, status).then((response) => {
      res.json(response);
    });
  
  }
  
  exports.cancelOrder = async(req,res)=>{
    const userId = req.body.userId
    const orderId = req.body.orderId
    const status = req.body.status
    console.log(userId + "        " + orderId + "                " + status )
    adminHelper.cancelOrder(orderId,userId,status).then((response) => {
      res.send(response);
    });
  
  }
  
  exports.returnOrder = async(req,res)=>{
    const orderId = req.body.orderId
    const status = req.body.status
    const userId = req.body.userId
    adminHelper.returnOrder(orderId,userId,status).then((response) => {
      res.send(response);
    });
  
  }   


  exports.getSalesReport =  async (req, res) => {
    const report = await adminHelper.getSalesReport();
    
    let details = [];
    const getDate = (date) => {
      const orderDate = new Date(date);
      const day = orderDate.getDate();
      const month = orderDate.getMonth() + 1;
      const year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day} - ${isNaN(month) ? "00" : month} - ${
        isNaN(year) ? "0000" : year
      }`;
    };
  
    report.forEach((orders) => {
      details.push(orders.orders);
    });
  
    res.render('admin/sales-report',{details,getDate})
  
  }

  
exports.postSalesReport =  (req, res) => {
    let details = [];
    const getDate = (date) => {
      const orderDate = new Date(date);
      const day = orderDate.getDate();
      const month = orderDate.getMonth() + 1;
      const year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day} - ${isNaN(month) ? "00" : month} - ${
        isNaN(year) ? "0000" : year
      }`;
    };
  
    adminHelper.postReport(req.body).then((orderData) => {
      orderData.forEach((orders) => {
        details.push(orders.orders);
      });
      res.render("admin/sales-report", {details,getDate});
    });
  }

