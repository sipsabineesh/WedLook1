const express = require("express")
const router = express.Router()

const services = require('../services/render')
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const cartController = require('../controller/cartController')
const bannerController = require('../controller/bannerController')
const wishListController = require('../controller/wishListController')
const verifyToken = require('../../middlewares/auth')
const validationRule= require('../../middlewares/validation-rule');
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

router.get("/home",bannerController.loadBanners)

router.get("/view-categories/",productController.loadCategories)
router.get("/view-products/:categoryId",productController.find)

router.get("/view-cart",cartController.loadCart)
router.post("/add-to-cart/:id",cartController.addToCart)
router.post("/increment-cart-quantity/:prodId",cartController.incrementCartQuantity)
router.post("/decrement-cart-quantity/:prodId",cartController.decrementCartQuantity)
router.get("/remove-cart-product/:prodId",cartController.removeCartProduct)

router.get("/check-out",cartController.loadCheckOut)

router.put("/add-to-wishlist/:id",wishListController.addToWishList)

router.get("/view-wishlist",wishListController.loadWishList)

router.get("/view-product-details/:id",productController.loadProductDetails)


module.exports = router;