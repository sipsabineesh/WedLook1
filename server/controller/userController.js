var User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const { validationResult, matchedData } = require('express-validator');
const nodemailer = require('nodemailer');
const { userHomeRoutes } = require('../services/render');

//const sendEmail = require('../../utils/sendEmail')

//create and save new user
exports.create=(req,res) => { 
    //validate request
    // const errors= validationResult(req);
    // if(!errors.isEmpty()){
    //   var errMsg= errors.mapped();
    //   var inputData = matchedData(req);  

    //  }else{
    //     var inputData = matchedData(req);  
    //    // insert query will be written here
       
    //new user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        password:req.body.password,
    })
    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(user.password,salt,(err,hash) => {
            if(err) throw err
            user.password = hash
            //save user in the database
    user
    .save(user)
    .then(data =>{
        // res.send(data)
        //next()
        errMsg =""
        res.render('user/login',{"errMsg":errMsg})
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occured while creating create operation"
        })
    })
  })
 })
// }

}

//update by user id and save user
exports.update=(req,res) => {
    if(!req.body){
           return res
           .status(400)
           .send({message:"Data to update cannot be empty"})
     }
   
     const id = req.params.id
     User.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
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
       Userdb.findByIdAndDelete(id)
      .then(data =>{
         if(!data){
             res.status(404).send({message:`Cannot delete  with ${id}.May be user not found`})
         }
         else{
             res.send({
               message:"User was deleted successfully"
             })
         }
      })
      .catch(err =>{
         res.status(500).send({message:"Could not delete user with id:"+id})
      })
   }
   
   exports.login=(async(req,res) => {
   var errMsg="";
   try {
       // check if the user exists
       const user = await User.findOne({ email: req.body.email});
       const blocked = user.blocked
       if (user && blocked === false) {
         //check if password matches
               bcrypt.compare(req.body.password, user.password, function (err, result) { 
               if (result == true) {
                    if(req.body.email === "admin@gmail.com"){
                        req.session.adminLoggedIn = true
                        req.session.user = user
                        res.render('admin/dashboard');
                    }else{ 
                       req.session.loggedIn = true
                       req.session.user = user
                       res.redirect('/user/home')
                   }
               } else {
               errMsg = "Incorrect password"
               //res.send('Incorrect password');
               res.render('user/login',{"errMsg":errMsg});
               }
           });
       } else {
         if(blocked === true)//res.status(400).json({ error: "User doesn't exist" });
             errMsg = "Please contact the admin"
         else 
             errMsg = "Please enter valid email and password"
         res.render('user/login',{"errMsg":errMsg});
       }
     } catch (error) {
       res.status(400).json({ error });
     }
   })
   
 

exports.findByEmail=(async(req,res) => {
    try {
    const user = await User.findOne({ email: req.params.email })
    .then(user => {
        if(!user){
            res.status(404).send({message:`Email not found`})
        }
        else{
            try {
                const otp = generateOTP()
                const message = "Your OTP : "+otp
                const params = {
                    otp:otp
                }
                const id = user._id
                User.findByIdAndUpdate(id,params,{useFindAndModify:false})
               .then(data =>{
                  if(!data){
                      res.status(404).send({message:`Cannot update  with ${id}.May be user not found`})
                  }
                  else{
                    sendEmail(user.email,message)
                    res.send(user)
                  }
               })
               .catch(err =>{
                  res.status(500).send({message:"Error Update userinformation"})
               })
               
            } catch (error) {
                
            }
        }

    })
}catch (error) {
        res.status(400).json({ error });
      }

   })


const  sendEmail = async(email,message) => {
 
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sipsabineesh@gmail.com',
            pass: 'gycisgobecmixzlc'
        }
    });
     
    let mailDetails = {
        from: 'info@wedlook.com',
        to: email,
        subject: 'OTP',
        text:message
    };
     
   const info = await mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}  

exports.findByOTP=(async(req,res) => {
    try {
    const email = req.body.email  
    const user = await User.findOne({ otp: req.body.otp })
    .then(user => {
        if(!user){
            res.status(404).send({message:`Data to update cannot be empty`})
        }
         else{
            try {
                res.render('user/reset-password',{email:email})
               
            } catch (error) {
                
            }
        }

    })
}catch (error) {
        res.status(400).json({ error });
      }

   })

//update by user id and save user
exports.updatePassword=(req,res) => {
    if(!req.body){
           return res
           .status(400)
           .send({message:"Data to update cannot be empty"})
     }

     let email = req.params.email
     let password = req.params.pswd
     bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(password,salt,(err,hash) => {
            if(err) throw err
              password = hash
    //console.log("Hashed password"+password)
     User.updateOne({email:email},{$set:{password:password}})
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
})
})
   }


exports.updateOTP=(async(req,res) => {
    try {
    const email = req.body.email  
    const otp = generateOTP()
    const message = "Your OTP : "+otp
    User.updateOne({email:email},{$set:{loginOtp:otp}})
    .then(user => {
        if(!user){
            res.status(404).send({message:`Data to update cannot be empty`})
        }
         else{
            try {
                sendEmail(email,message)
                res.render('user/otp-entry',{otp:otp})
            } catch (error) {
            }
        }
    })
}catch (error) {
        res.status(400).json({ error });
      }

   })

   exports.verifyLoginOTP=(async(req,res) => {
    try {
    const user = await User.findOne({ loginOtp: req.body.otp })
    .then(user => {
        if(!user){
            res.status(404).send({message:`Data to update cannot be empty`})
        }
         else{
            try {
                res.render('user/home',{user})
            } catch (error) {
                
            }
        }

    })
}catch (error) {
        res.status(400).json({ error });
      }

   })

   const generateOTP = () => {
    return  Math.floor(Math.random()*10000);
   }

   exports.find=(req,res) => {
    if(req.params.id){
        const id = req.params.id
        User.findById(id)
              .then(user => {
                if(!userHomeRoutes){
                    res.status(404).send({message:'Not found user with id:'.id})
                }
                else{
                    res.render('user/update-user',{user})
                }
              })
              .catch(err => {
                    res.status(500).send({message:'Error occured while retrieving data with id'.id})
              })
     }
     else {
        User.find()
        .then(user => {
          //res.send(user) 
          res.render('admin/view-user',{user})
  })
        .catch(err => {
          res.status(500).send({message:err.message||"Error occured while retrieving data"})
  })
     }
  
} 



//update block or unblock by user id and save user
exports.blockUnblock=(req,res) => {
    if(!req.body){
           return res
           .status(400)
           .send({message:"Data to update cannot be empty"})
     }
   
     const id = req.params.id
     const action = req.params.action
     var params = {}
     console.log("ACTION  "+action)
     if(action === 'block')
      params = { blocked : true }
     else
      params = { blocked : false }
      
     User.findByIdAndUpdate(id,params,{useFindAndModify:false})
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

   
   
   
  