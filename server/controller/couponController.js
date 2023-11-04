const couponHelper = require('../helper/couponHelper')
const Coupon = require('../model/couponModel')


const loadCouponAdd = async(req,res)=>{
    try {
        res.render('admin/add-coupon')
    } catch (error) {
        console.log(error.message);
    }
}


const generateCouponCode = (req,res)=>{
    couponHelper.generatorCouponCode().then((couponCode) => { 
        res.send(couponCode);
      });
}


const addCoupon =  (req, res) => {
    try {
        const data = {
            couponCode: req.body.coupon,
            validity: req.body.validity,
            minPurchase: req.body.minPurchase,
            minDiscountPercentage: req.body.minDiscountPercentage,
            maxDiscountValue: req.body.maxDiscount,
            description: req.body.description,
          };
          console.log("COUPON DATA")
          console.log(data)
          couponHelper.addCoupon(data)
          
            res.json({"response":"success"});
         
        
    } catch (error) {
        console.log(error.message);
        
        
    }
   
  }

  const couponList = async(req,res)=>{
    try {
        
        const defaultPerPage = 10;
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || defaultPerPage; 
        const skip = (page - 1) * limit;
        let totalCountQuery = Coupon.find();

        const totalCoupons = await totalCountQuery.countDocuments();
        const startSerialNumber = (page - 1) * limit + 1;
        // const searchPattern = new RegExp(`.*${productNameSearch}.*`, 'i');

        let couponQuery = Coupon.find();
        // if (productNameSearch) {
        //     productsQuery = productsQuery.where('productName').regex(searchPattern);
        // }
                
          const couponList = await couponQuery
            .skip(skip)
            .limit(limit)
            .exec();
        
        res.render('admin/couponList', {
        couponList,
          currentPage: page,
          pages: Math.ceil(totalCoupons / limit),
          startSerialNumber:startSerialNumber,
          selectedLimit:limit,
        });
        
    } catch (error) {
        
    }
  }
 
const removeCoupon = async(req,res)=>{
    try {
        const id = req.body.couponId
        await Coupon.deleteOne({_id:id})
        res.json({status:true})
        
    } catch (error) {
        
    }
}



module.exports = {
    loadCouponAdd,
    generateCouponCode,
    addCoupon,
    couponList,
    removeCoupon
}