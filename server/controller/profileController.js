const Mongoose= require("mongoose");

const User = require('../model/userModel')
const Address = require('../model/addressModel')
const Order = require('../model/orderModel')

const addressHelper = require('../helper/addressHelper')

exports.loadProfile = async(req,res) =>
{
    if(req.session.loggedIn) {
    try{
            const userDetails= req.session.user
            const userId = userDetails._id
            const emailId = userDetails.email
            const user = await User.findOne({ _id:userId});
            const addresses = await addressHelper.loadAddresses(userId)
            res.render('user/user-profile',{user,addresses})
           }
    catch(err){

    }
}
 else{
    res.render('user/login',{"errMsg":""})
}
}


exports.editProfile = async (req, res) => {
  try {
      if (req.session.loggedIn) {
          const userDetails = req.session.user;
          const userId = userDetails._id;
          let name = req.body.name;
          let email = req.body.email;
          let phoneNumber = req.body.phoneNumber;
          name = name.trim()
          email = email.trim()
          const result = await User.updateOne(
              { _id: userId },
              { $set: { name: name, email: email, phoneNumber: phoneNumber } }
          );
          if (result) {
              res.redirect('/user-profile');
          } else {
              console.error("Update failed");
          }
      }
  } catch (error) {
      console.error(error);
  }
};

exports.walletTransaction = async(req,res) =>{
    try {
      const user = req.session.user
      const userId = user._id
      // const userData= await User.findOne({_id:user._id})
      const wallet = await User.aggregate([
        {$match:{_id:new Mongoose.Types.ObjectId(userId)}},
        {$unwind:"$walletTransaction"},
        {$sort:{"walletTransaction.date":-1}},
        {$project:{walletTransaction:1,wallet:1}}
      ])
        console.log("wallet")
        console.log(wallet)
        res.render('user/walletTransactions',{wallet,user})
    

    } catch (error) {
      console.log(error.message);
    }
}