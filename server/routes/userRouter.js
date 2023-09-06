const express = require("express")
const router = express.Router()

const services = require('../services/render')
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const cartController = require('../controller/cartController')
const bannerController = require('../controller/bannerController')
const wishListController = require('../controller/wishListController')

const validationRule= require('../../middlewares/validation-rule');

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
//router.get("/home",services.userHomeRoutes)
/*
@description view products Route
@method GET/
*/
//router.get("/view-product-details",services.viewProductDetailsRoutes)
/*
@description Logout Route
@method GET/
*/
router.get("/logout",services.userLogoutRoutes)

//API

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

router.post("/add-to-cart/:id",cartController.addToCart)

router.put("/add-to-wishlist/:id",wishListController.addToWishList)

router.get("/view-wishlist",wishListController.loadWishList)

router.get("/view-product-details/:id",productController.loadProductDetails)


module.exports = router;