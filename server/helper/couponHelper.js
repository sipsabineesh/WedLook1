// const voucherCode = require("voucher-code-generator");
const Coupon = require('../model/couponModel')
const User = require('../model/userModel')
const Mongoose= require("mongoose");
// const { ObjectId } = require("mongodb");
const crypto = require('crypto');
const Order = require('../model/orderModel');

function generateRandomCode() {
  // Generate a random 10-digit number
  const randomCode = crypto.randomBytes(5).readUIntBE(0, 5).toString().slice(0, 10);
  return randomCode;
}


const generatorCouponCode =  () => {
    return new Promise(async (resolve, reject) => {
      try {
        let couponCode = generateRandomCode();
        console.log('Random Code:', couponCode);
        resolve({ status: true, couponCode: couponCode});
      } catch (err) {}
    });
  }

  const addCoupon = (data) => { console.log("DATA IN COUPON HELPER")
    try {
      return new Promise((resolve, reject) => {
        Coupon.findOne({ couponCode: data.couponCode }).then(
          (coupon) => {
            if (coupon) {
              resolve({ status: false });
            } else {
              Coupon(data)
                .save()
                .then((response) => {
                  resolve({ status: true });
                });
            }
          }
        );
      });
    } catch (error) {
      console.log(error.mesage);
    }
  }

  const addCouponToUser =  (couponCode, userId) => {
    try {
      return new Promise(async(resolve, reject) => {
        const updated = await User
          .updateOne(
            { _id: new Mongoose.Types.ObjectId(userId) },
            {
              $push: { 
                coupons: couponCode,
              },
            }
          )

          .then((couponAdded) => {
            resolve(couponAdded);

          });

      });


    } catch (error) {
      console.log(error.message);
    }
  }
  const verifyCoupon =  (userId, couponCode) => { console.log("  verify COUPON IN HELPER")
    try {
      return new Promise((resolve, reject) => {
         Coupon.find({ couponCode: couponCode }).then(
          async(couponExist) => {
            if (couponExist.length>0) {
              if (new Date(couponExist[0].validity) - new Date() > 0) {
                const usersCoupon = await User.findOne({
                  _id: userId,
                  coupons: { $in: [couponCode] },
                });

                if (usersCoupon) {
                  resolve({
                    status: false,
                    message: "Coupon already used by the user",
                  });
                } else {
                  resolve({
                    status: true,
                    message: "Coupon added successfuly",
                  });
                }
              } else {
                resolve({ status: false, message: "Coupon have expiried" });
              }
            } else {
              resolve({ status: false, message: "Coupon doesnt exist" });
            }
          }
        );
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  const applyCoupon = (couponCode, total) => { console.log("APPLY COUPON COUPON HELPER +  Total : "+ total)
    try {
      return new Promise((resolve, reject) => {
        Coupon.findOne({ couponCode: couponCode }).then(
          (couponExist) => {
            if (couponExist) {
              if (new Date(couponExist.validity) - new Date() > 0) {
                if (total >= couponExist.minPurchase) {
                  let discountAmount =
                    (total * couponExist.minDiscountPercentage) / 100;
                  if (discountAmount > couponExist.maxDiscountValue) {
                    discountAmount = couponExist.maxDiscountValue;
                    //Order.updateOne({})
                    resolve({
                      status: true,
                      discountAmount: discountAmount,
                      discount: couponExist.minDiscountPercentage,
                      couponCode: couponCode,
                    });
                  } else {
                    resolve({
                      status: true,
                      discountAmount: discountAmount,
                      discount: couponExist.minDiscountPercentage,
                      couponCode: couponCode,
                    });
                  }
                } else {
                  resolve({
                    status: false,
                    message: `Minimum purchase amount is ${couponExist.minPurchase}`,
                  });
                }
              } else {
                resolve({
                  status: false,
                  message: "Coupon expired",
                });
              }
            } else {
              resolve({
                status: false,
                message: "Coupon doesnt Exist",
              });
            }
          }
        );
      });
    } catch (error) {
      console.log(error.message);
    }
  }


  module.exports ={
   generatorCouponCode,
    addCoupon,
    addCouponToUser,
    verifyCoupon,
    applyCoupon
  }