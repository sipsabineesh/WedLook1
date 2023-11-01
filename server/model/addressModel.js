const mongoose = require("mongoose");

const userAddressSchema = new mongoose.Schema({
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true,
  },
  addresses: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      mobileNumber: {
        type: Number,
        required: true,  
      },
      address: {
        type: String,
        required: true,
      },
      locality: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      isActive: {
        type:Boolean,
        default:false
      }
    },
  ],
});

module.exports = mongoose.model("address", userAddressSchema)