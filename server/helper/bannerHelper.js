var Banner = require('../model/bannerModel')

exports.getBanner = async(req,res) => {
    // const banner = await Banner.find({isActive:true})
    // .then(banner => {
    //     const user = req.session.user
    //   res.render('user/home',{banner,user})
    // })
    // .catch(err => {
    //   res.status(500).send({message:err.message||"Error occured while retrieving data"})
    // })
    return new Promise(async (resolve, reject) => {
        await Banner.find({isActive:true}).then((response) => {
            resolve(response);
        });
    });
}
