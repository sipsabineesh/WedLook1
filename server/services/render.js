const axios = require('axios')
const bannerController = require('../controller/bannerController')
//user part

exports.userSignupRoutes = (req,res) => {
    res.render('user/signup')
}

exports.userLoginRoutes = (req,res) => {
    let user = req.session.user
    if(!(req.session.loggedIn)){
       res.render('user/login',{"errMsg":""})
    }
    else{
        const banner = bannerController.loadBanners
       // res.render('user/home',{banner,user})
    }
}

exports.forgotPasswordRoutes = (req,res) => {
    res.render('user/forgot-password',{})
}

exports.resetPasswordRoutes = (req,res) => {
    res.render('user/reset-password')
}


exports.userOTPLoginRoutes = (req,res) => {
    res.render('user/otp-login',{"errMsg":""})
}
exports.userHomeRoutes = (req,res) => {
    let user = req.session.user
    if(req.session.loggedIn){
        res.redirect('/home')
    }
    else{
        res.render('user/login',{"errMsg":"Please Login"})
    }
}

exports.viewCartsRoutes = (req,res) => {
    let user = req.session.user
    console.log(user)

    if(req.session.loggedIn){
        res.render('user/view-cart',{user})
    }
    else{
        res.render('user/login',{"errMsg":"Please Login"})
    }
}


exports.viewProductsRoutes = (req,res) => {
    let user = req.session.user
    if(req.session.loggedIn){
        res.render('user/view-products',{product,user,admin:false})
    }
    else{
        res.render('user/login',{"errMsg":"Please Login"})
    }
}

exports.viewProductDetailsRoutes = (req,res) => {
    let user = req.session.user
    if(req.session.loggedIn){
        res.render('user/view-product-details',{product,user,admin:false})
    }
    else{
        res.render('user/login',{"errMsg":"Please Login"})
    }
}

exports.userLogoutRoutes = (req,res) => {
	req.session.loggedIn=false;
	req.session.destroy()
	res.redirect('/login');
  }

//admin part

exports.adminLoginRoutes = (req,res) => {
    res.render('admin/login',{errMsg:""})
}

exports.adminDashboardRoutes = (req,res) => {
    res.render('admin/dashboard')
}


exports.addCategoryRoutes = (req,res) => {
    res.render('admin/add-category')
}


exports.addProductRoutes = (req,res) => {
    res.render('admin/add-product')
}


exports.addBannerRoutes = (req,res) => {
    res.render('admin/add-banner')
}


exports.adminLogoutRoutes = (req,res) => {
	req.session.adminLoggedIn=false;
	req.session.destroy()
	res.redirect('/admin/login');
  }


// exports.addUserRoutes = (req,res) => {
//     res.render('add_user')
// }

// exports.updateUserRoutes = (req,res) => {
//     axios.get('http://localhost:3000/api/users',{params:{id:req.query.id}})
//          .then(function(userdata) {
//             res.render("update_user",{user:userdata.data})
//          })
//          .catch(err =>{
//             res.send(err)
//          })
// }

//exports.viewCategoryRoutes = (req,res) => {  
    // var url = 'http://localhost:3000/api/admin'
    // console.log(url)
    // axios.get(url)
    //     .then(function(response){
    //     console.log(response.data)
    //         res.render('admin/',{category:response.data})
    //     })
    //     .catch(err => {
    //         res.send(err)
    //     })
   // res.render('admin/view-category')
//  }

