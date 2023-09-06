

var Product = require('../model/productModel')
var Category = require('../model/categoryModel')
const User = require('../model/userModel')
const { ObjectId } = require("mongodb");


exports.loadProduct=async (req,res) => {
    try {
        const categories = await Category.find({})
            res.render('admin/add-product',{category:categories})
      } catch (error) {
        console.log(error.message);
        
      }
}

exports.create=(req,res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
        return
    }
    console.log(req.files)

    //new product
    const images = req.files.map(file => file.filename);
    const product = new Product({
        productName:req.body.productName,
        productCategory:req.body.productCategory,
        productPrice:req.body.productPrice,
        productStock:req.body.productStock,
        productImage:images,
        productDescription:req.body.productDescription
    })
    //save product in the database
    product
        .save(product)
        .then(data =>{
            // res.send(data)
            res.redirect('/admin/add-product')
    
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Some error occured while creating create operation"
            })
        })
    }

    exports.find=async (req,res) => {
        if(req.params.id){
            const id = req.params.id
            const categories = await Category.find({})
            Product.findById(id).populate('productCategory')
                  .then(product => {
                    if(!product){
                        res.status(404).send({message:'Not found user with id:'.id})
                    }
                    else{
                        res.render('admin/update-product',{product,category:categories})
                    }
                  })
                  .catch(err => {
                        res.status(500).send({message:'Error occured while retrieving data with id'.id})
                  })
         }
         else if(req.params.categoryId){
            let categoryId = req.params.categoryId
            let user = req.session.user
            const category= await Category.find({_id:categoryId})
         //   Product.find({productCategory:categoryId})

            Product.aggregate([
                {
                    "$match":{
                        "productCategory":categoryId
                    }
                },
                {
                  "$lookup": {
                    "from": "category",
                    "localField": "productCategory",
                    "foreignField": "_id",
                    "as": "CategoryIds"
                  }
                }
                // {
                //   "$unset": [
                //     "_id",
                //     "categortIds._id"
                //   ]
                // }
              ])


            .then(product => {
              if(!product){
                  res.status(404).send({message:'Not found user with id:'.id})
              }
              else{
                if(req.session.loggedIn){
                    res.render('user/view-products',{product,user,category})
                 }
                 else {
                    res.render('user/login',{"errMsg":"Please Login"})
                 }
               
              }
            })
            .catch(err => {
                  res.status(500).send({message:'Error occured while retrieving data with id'.id})
            })
         }
         else {
            Product.find(req.params.id)
            .then(product => { 
              res.render('admin/view-product',{product})
      })
            .catch(err => {
              res.status(500).send({message:err.message||"Error occured while retrieving data"})
      })
         }
      
   } 


   
   //update by user id and save user
exports.update=(req,res) => { 
    if(!req.body){
           return res
           .status(400)
           .send({message:"Data to update cannot be empty"})
     }
   
     const id = req.params.id
    //  const images = req.files.map(file => productImage.filename);
    //  const updatedImages = images.length > 0 ? images : productData.images; 
    //  req.body.productImage = updatedImages
    const images = req.files.map(file => file.filename);
    req.body.productImage = images
     Product.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
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

   
   //delete a user by user id
   exports.delete=(req,res) => {
    const id = req.params.id  
    Product.findByIdAndDelete(id)
   .then(data =>{
      if(!data){
          res.status(404).send({message:`Cannot delete  with ${id}.May be user not found`})
      }
      else{
          res.send({
            message:"Product was deleted successfully"
          })
      }
   })
   .catch(err =>{
      res.status(500).send({message:"Could not delete user with id:"+id})
   })
}


exports.loadCategories=async (req,res) => {
    let user = req.session.user
    const categories = await Category.find({})
    if(req.session.loggedIn){
        res.render('user/view-categories',{user,category:categories})
    }
    else{
        res.render('user/login',{"errMsg":"Please Login"})
    }
  
} 

// loadProducts
// exports.loadProducts=async (req,res) => {
//     let user = req.session.user
//     const categories = await Category.find({})
//     console.log(categories)

//     if(req.session.loggedIn){
//         res.render('user/view-categories',{user,category:categories})
//     }
//     else{
//         res.render('user/login',{"errMsg":"Please Login"})
//     }
  
// } 

exports.loadProductDetails = async(req,res) => { console.log(req.params.id)
    if(req.params.id){
        const id = req.params.id
       
        Product.findById(id)
              .then(product => {
                if(!product){
                    res.status(404).send({message:'Not found user with id:'.id})
                }
                else{
                    console.log(product)
                    let user = req.session.user
                    if(req.session.loggedIn){
                        res.render('user/view-product-details',{product,user})
                    }
                    else{
                        res.render('user/login',{"errMsg":"Please Login"})
                    }
                    //res.send(product)
                   
                }
              })
              .catch(err => {
                    res.status(500).send({message:'Error occured while retrieving data with id'.id})
              })
     }
}
