const express = require("express")
const route = express.Router()

const services = require('../services/render')
const adminController = require('../controller/adminController')
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const categoryController = require('../controller/categoryController')
const bannerController = require('../controller/bannerController')
const orderController = require('../controller/orderController')
const couponController = require('../controller/couponController')
const verify = require('../../middlewares/validateAdmin');

const multer = require('../../multer/multer')

/*
@description Admin Login 
@method GET/login
*/
route.get("/login",services.adminLoginRoutes)

/*
@description dashboard 
@method GET/dashboard
*/
//route.get("/dashboard",services.adminLoginRoutes)

/*
@description add category
@method GET/add-category
*/
route.get("/add-category",services.addCategoryRoutes)
/*
@description add product
@method GET/add-product
*/
route.get("/add-banner",services.addBannerRoutes)

/*
@description logout
@method GET/add-productlogout
*/
route.get("/logout",services.adminLogoutRoutes)

//API
 
//Login
route.post('/login',adminController.login)

//Admin Dashboard
route.get("/dashboard",verify.verifyAdminLogin,adminController.loadDashboard)

//User Management
route.get('/view-user',verify.verifyAdminLogin,userController.find)
route.put('/block-unblock-user/:id/:action',verify.verifyAdminLogin,userController.blockUnblock)
// route.put('/update-user-status/:user',userController.updateUserStatus)

//Category Management
route.post('/add-category',verify.verifyAdminLogin,multer.upload,categoryController.create)
route.get('/view-category',verify.verifyAdminLogin,categoryController.find)
route.get('/view-category-names',verify.verifyAdminLogin,categoryController.find)
route.get('/update-category/:id',verify.verifyAdminLogin,categoryController.find)
route.post('/update-category', verify.verifyAdminLogin,multer.upload,categoryController.update)
route.delete('/delete-category/:id',verify.verifyAdminLogin,categoryController.delete)

//Product Management
route.get("/add-product",verify.verifyAdminLogin,productController.loadProduct)
route.post('/add-product',verify.verifyAdminLogin,multer.upload,productController.create)
route.get('/view-product',verify.verifyAdminLogin,productController.listProducts)
route.get('/update-product/:id',verify.verifyAdminLogin,productController.find)
route.post('/update-product',verify.verifyAdminLogin,multer.update,productController.update)
route.delete('/delete-product/:id',verify.verifyAdminLogin,productController.delete)

//Banner Management
route.post('/add-banner',verify.verifyAdminLogin,multer.bupload,bannerController.create)
route.get('/view-banner',verify.verifyAdminLogin,bannerController.find)

//Order
route.get('/view-order',verify.verifyAdminLogin,orderController.orderList)
route.get('/order-details',verify.verifyAdminLogin,orderController.orderDetails)
route.put('/order-status',adminController.changeStatus)  
route.put('/cancel-order',adminController.cancelOrder)
route.put('/returnOrder',adminController.returnOrder)

//coupon
route.get('/add-coupon',verify.verifyAdminLogin,couponController.loadCouponAdd)
route.post('/add-coupon',verify.verifyAdminLogin,couponController.addCoupon)
route.get('/generate-coupon-code',couponController.generateCouponCode)
route.get('/coupon-list',verify.verifyAdminLogin,couponController.couponList)
route.delete('/removeCoupon',verify.verifyAdminLogin,couponController.removeCoupon)

//Report
route.get('/sales-report',verify.verifyAdminLogin,adminController.getSalesReport)
route.post('/sales-report',verify.verifyAdminLogin,adminController.postSalesReport)


module.exports = route