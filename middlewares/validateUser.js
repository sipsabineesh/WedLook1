const User = require('../server/model/userModel')

exports.verifyLogin = async (req,res,next)=> {
if(req.session.loggedIn) {
    const sessionUser = req.session.user
    const userId = sessionUser._id
console.log("userId")
console.log(userId)    

    const user = await User.findById(userId)
    console.log("user in validate User middleware")
    console.log(user)
    if(user && user.blocked === false){
        next()
    }
    else{
        res.render("user/login",{"errMsg":"Please Contact the Admin.You have been blocked by the Admin"})
    }
}
else
{
    res.redirect("/login")
}
}