const Mongoose= require("mongoose");
const Address = require('../model/addressModel')

exports.loadAddresses=async (userId) => {  console.log("IN ADDRESS HELPER")

    
    console.log("Usr ID :"+userId)
 try{
    const addresses = await Address.aggregate([
        {
          $match: {
            user:new Mongoose.Types.ObjectId(userId),
          },
        },
        {
          $unwind: "$addresses",
        },
      ]);
      console.log(addresses)
    return addresses
 }
 catch(error){
     console.log(error);
 }

}