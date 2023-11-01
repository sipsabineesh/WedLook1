exports.verifyAdminLogin = async (req,res,next)=> {
    try{
        if(req.session.adminLoggedIn){
            next()
        }
        else{
            res.redirect("/admin/login")
        }
    }  
    catch(error){
        console.log(error.message)
    }
   
 }