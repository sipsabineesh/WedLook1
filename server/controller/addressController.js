const Mongoose= require("mongoose");
const Address = require('../model/addressModel')

exports.loadAddresses=async (req,res) => { 
if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
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
     res.render('user/addresses',{user,addresses})
 }
 catch(error){
     console.log(error);
 }
}
else {
    res.render('user/login',{"errMsg":"Please Login"})
 }

}

exports.addAddress = async (req, res) => {
    const user = req.session.user;
    const userId = user._id;
    const name = req.body.name;
    const address = req.body.address;
    const locality = req.body.locality;
    const city = req.body.city;
    const pincode = req.body.pincode;
    const state = req.body.state;
    const phoneNumber = req.body.phoneNumber;


    // Create a new address object
    const newAddress = {
      name: name,
      address: address,
      locality: locality,
      city: city,
      pincode: pincode,
      state: state,
      phoneNumber: phoneNumber
    };

    const userAddress = new Address({
      user: new Mongoose.Types.ObjectId(userId),
      addresses: [newAddress],
    });
    await userAddress.save();
    res.send(true)
  };

exports.editAddress = async (userId, newAddress) => {
    const updatedUser = await Address.findOneAndUpdate(
      { user: userId },
      { $push: { addresses: newAddress } },
      { new: true }
    );
    console.log("+++++++++++++++++++++++++++++++++++++++")
  console.log(updatedUser)
    return updatedUser;
  };
  
  
exports.setAddress = async (req, res) => { 
  if(req.session.loggedIn) {
    const user = req.session.user
    const userId = user._id
    const addressIdToSetActive = req.params.addressId
    try {
      // Update all addresses to set isActive to false
      await Address.updateMany({ user: userId }, { $set: { "addresses.$[].isActive": false } });
  
      // Update the specific address to set isActive to true
      const result = await Address.updateOne(
        { user: new Mongoose.Types.ObjectId( userId), "addresses._id": new Mongoose.Types.ObjectId(addressIdToSetActive) },
        { $set: { "addresses.$.isActive": true } }
      ).then(async (addresstDetails) => {
        console.log(addresstDetails)
        if (!addresstDetails) {
          console.log("Specified address not found.");
          return;
        }
        console.log("Address updated successfully.");
        res.send(true)
      })
      
    } catch (error) {
      console.error("Error updating address:", error);
    }
}

}
