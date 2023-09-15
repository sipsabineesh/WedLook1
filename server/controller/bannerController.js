
var Banner = require('../model/bannerModel')
var bannerHelper = require('../helper/bannerHelper')

exports.create=(req,res) => {
    //validate request

    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
        return
    }
    console.log(req.files)
    const images = req.files.map(file => file.filename);
    //new banner
    const banner = new Banner({
        bannerTitle:req.body.bannerTitle,
        bannerLink:req.body.bannerLink,
        bannerImage:images
    })
    //save category in the database
    banner
        .save(banner)
        .then(data =>{
            // res.send(data)
            res.redirect('/admin/add-banner')
    
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Some error occured while creating create operation"
            })
        })
    }

    exports.find=async (req,res) => {
        Banner.find()
        .then(banner => {
          res.render('admin/view-banner',{banner})
  })
        .catch(err => {
          res.status(500).send({message:err.message||"Error occured while retrieving data"})
  })
  }

  exports.loadBanners=async (req,res) => { 
   const user = req.session.user
    try{
        bannerHelper.getBanner().then((response)=> {
            res.render('user/home',{user,banner:response})

        })
        
    }
    catch(error){
        console.log(error);
    }
  
}
