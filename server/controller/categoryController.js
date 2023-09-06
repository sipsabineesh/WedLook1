

var Category = require('../model/categoryModel')
exports.create=(req,res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
        return
    }
    const images = req.files.map(file => file.filename);
    //new category
    const category = new Category({
        categoryName:req.body.categoryName,
        categoryDescription:req.body.categoryDescription,
        categoryImage:images
    })
    //save category in the database
    category
        .save(category)
        .then(data =>{
            // res.send(data)
            res.redirect('/admin/add-category')
    
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Some error occured while creating create operation"
            })
        })
    }

    exports.find=(req,res) => {
        if(req.params.id){
            const id = req.params.id
            Category.findById(id)
                  .then(category => {
                    if(!category){
                        res.status(404).send({message:'Not found user with id:'.id})
                    }
                    else{
                        res.render('admin/update-category',{category})
                    }
                  })
                  .catch(err => {
                        res.status(500).send({message:'Error occured while retrieving data with id'.id})
                  })
         }
         else {
            Category.find()
            .then(category => {
              //res.send(category)
              res.render('admin/view-category',{category})
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
     Category.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
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
    Category.findByIdAndDelete(id)
   .then(data =>{
      if(!data){
          res.status(404).send({message:`Cannot delete  with ${id}.May be user not found`})
      }
      else{
          res.send({
            message:"Category was deleted successfully"
          })
      }
   })
   .catch(err =>{
      res.status(500).send({message:"Could not delete user with id:"+id})
   })
}

