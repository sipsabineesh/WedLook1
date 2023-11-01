const express = require("express")
const router = express.Router()

const services = require('../services/render')
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const bannerController = require('../controller/bannerController')
const cartController = require('../controller/cartController')
const wishListController = require('../controller/wishListController')
const orderController = require('../controller/orderController')
const profileController = require('../controller/profileController')
const addressController = require('../controller/addressController')

const verifyToken = require('../../middlewares/auth')
const validationRule= require('../../middlewares/validation-rule');
const verify = require('../../middlewares/validateUser');
const block = require('../../middlewares/blockUserMiddleware');

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

/*
@description Signup Route
@method GET/
*/
router.get("/signup",services.userSignupRoutes)
/*
@description Login Route
@method GET/
*/
router.get("/login",services.userLoginRoutes)
/*
@description Forgot Route
@method GET/
*/
router.get("/forgot-password",services.forgotPasswordRoutes)
/*
@description Reset Password Route
@method GET/
*/
router.get("/reset-password",services.resetPasswordRoutes)
/*
@description Login Route
@method GET/
*/
router.get("/otp-login",services.userOTPLoginRoutes)
/*
@description Home Route
@method GET/
*/
router.get("/",services.userHomeRoutes)
/*
@description view products Route
@method GET/
*/
//router.get("/view-product-details",services.viewProductDetailsRoutes)
/*
@description view products Route
@method GET/
*/
//router.get("/view-cart",services.viewCartsRoutes)
/*
@description view products Route
@method GET/
*/
router.get("/order-response",services.orderResponseRoutes)
/*
@description Logout Route
@method GET/
*/
router.get("/logout",services.userLogoutRoutes)

//API
// function verifyToken(req,res,next){
//     console.log("secret  :  " + secret)
//     const authHeader = req.header('Authorization');
//     if(authHeader == undefined){
//         //res.status(401).send({error:"no token provided"})
//         console.log("no token provided")
//     }
//     else{
//     console.log("authHeader   :"+authHeader)
//     let token = authHeader.split(" ")[1]
//     jwt.verify(token,secret,function(err,decoded){
//         if(err) {
//             console.log("Authentication Failed")
//         }
//         else{
//             next()
//         }
//     })
//    }
//    }

// function verifyToken(req,res,next){
//     console.log("secret  :  " + secret)
//     const tkn = req.session.jwt;
//     console.log("ttttttttttooooooooookkkkkkkkkkkkkennnnnnnnnn:"+tkn)
    
//     let token = tkn.split(".")[1]
//     console.log("AFTER SPLIT"+ token )
//     jwt.verify(token,secret,function(err,decoded){
//         if(err) {
//             console.log("Authentication Failed")
//         }
//         else{
//             next()
//         }
//     })
//   //  }
//    }
router.post("/login",userController.login)
router.post("/signup",validationRule.form,userController.create)
router.post("/forgot-password/:email",userController.findByEmail)
router.post("/reset-password",userController.findByOTP)
router.post("/change-password/:email/:pswd",userController.updatePassword)
router.post("/otp-login",userController.updateOTP)
router.post("/otp-entry",userController.verifyLoginOTP)

router.get("/home",verify.verifyLogin,bannerController.loadBanners)

router.get("/view-categories/",verify.verifyLogin,productController.loadCategories)
router.get("/view-products/:categoryId",verify.verifyLogin,productController.find)
router.get("/view-product-details/:id",verify.verifyLogin,productController.loadProductDetails)

router.put("/add-to-wishlist/:id",verify.verifyLogin,wishListController.addToWishList)
router.get("/view-wishlist",verify.verifyLogin,wishListController.loadWishList)

router.get("/view-cart",verify.verifyLogin,cartController.loadCart)
router.post("/add-to-cart/:id",verify.verifyLogin,cartController.addToCart)
router.post("/increment-cart-quantity/:prodId/:qty",cartController.incrementCartQuantity)
router.post("/decrement-cart-quantity/:prodId",cartController.decrementCartQuantity)
router.get("/remove-cart-product/:prodId",cartController.removeCartProduct)

router.get("/check-out",verify.verifyLogin,orderController.loadCheckOut)
router.post("/add-address/:user",verify.verifyLogin,orderController.addAddress)
router.put("/edit-address/:id",verify.verifyLogin,orderController.editAddress)

router.post("/place-order",verify.verifyLogin,orderController.checkOut)
router.post('/verifyPayment',orderController.verifyPayment)  
router.post('/paymentFailed',orderController.paymentFailed)  
router.get('/view-orders',verify.verifyLogin,orderController.listOrders)
router.get('/order-details',verify.verifyLogin,orderController.getOrderDetails)
router.put('/cancel-order',orderController.cancelOrder)

router.get('/user-profile',verify.verifyLogin,profileController.loadProfile)
router.post('/edit-info',verify.verifyLogin,profileController.editProfile)
router.get('/addresses',verify.verifyLogin,addressController.loadAddresses)
router.put('/set-address/:addressId',verify.verifyLogin,addressController.setAddress)
router.get('/wallet',verify.verifyLogin,profileController.walletTransaction)


router.get('/applyCoupon/:id/:total',verify.verifyLogin,orderController.applyCoupon)
router.get('/couponVerify/:id',orderController.verifyCoupon)

router.get('/error-access',services.errorAccessRoutes)



module.exports = router;