const express = require("express")
const route = express.Router()

const services = require('../services/render')
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const categoryController = require('../controller/categoryController')
const bannerController = require('../controller/bannerController')

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
route.get("/dashboard",services.adminDashboardRoutes)

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
@description add user
@method GET/add-user
*/
//route.get("/add-user",services.addUserRoutes)
/*
@description update user
@method GET/update-user
*/
//route.get("/update-user",services.updateUserRoutes)

/*
@description logout
@method GET/add-productlogout
*/
route.get("/logout",services.adminLogoutRoutes)

//API
 
//Login
route.post('/login',userController.login)

//User Management
route.get('/view-user',userController.find)
route.put('/block-unblock-user/:id/:action',userController.blockUnblock)

//Category Management
route.post('/add-category',multer.upload,categoryController.create)
route.get('/view-category',categoryController.find)
route.get('/view-category-names',categoryController.find)
route.get('/update-category/:id',categoryController.find)
route.put('/update-category/:id',multer.upload,categoryController.update)
route.delete('/delete-category/:id',categoryController.delete)

//Product Management
route.get("/add-product",productController.loadProduct)
route.post('/add-product',multer.upload,productController.create)
route.get('/view-product',productController.find)
route.get('/update-product/:id',productController.find)
route.put('/update-product/:id',multer.update,productController.update)
route.delete('/delete-product/:id',productController.delete)

//Banner Management
route.post('/add-banner',multer.bupload,bannerController.create)
route.get('/view-banner',bannerController.find)




module.exports = route