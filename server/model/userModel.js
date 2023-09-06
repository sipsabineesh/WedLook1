const mongoose = require('mongoose')

// const cartItemSchema = new mongoose.Schema({
//     productId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref:'product',
//         required:true,
//     },
//     quantity:{
//         type:Number,
//         required:true,
//         default:1,
//     },
// });

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phoneNumber:
    {
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
     //   required: true,
    },
    blocked:{
        type:Boolean,
        default : false
    },
    emailVerified:{
        type:Boolean
    },
    addresses:[{
        billingAddress:{
            street:{
                type: String
            },
            city:{
                type: String
            },
            state:{
                type: String
            },
            pincode:{
                type:Number
            }
        },
        shippingAddress:{
            street:{
                type: String
            },
            city:{
                type: String
            },
            state:{
                type: String
            },
            pincode:{
                type:Number
            }
        }
    }],
    cart:{
     cartItems:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "product" 
        },
        quantity:{
            type:Number
        }
     }],
     cartTotal:{
        type:Number
     }
       
    },
    wishlist:[{
        productId:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "product" 
        },
        addedDate : 
        { 
            type: Date,
            default: Date.now
        }

    }],
    // cart: [cartItemSchema],
    // wishlist:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'product'
    // }],
    loginOtp:{
        type:Number
    },
    otp:{
        type:Number
    },
    date: {
        type: Date,
        default: Date.now,
      }
})


const User = mongoose.model('user',userSchema)

module.exports = User