//const jwt = require('jsonwebtoken');
 const User = require('../server/model/userModel');
 

// require('dotenv').config();


exports.checkBlocked = async (req,res,next)=> {
    console.log("CHECKINGGG BLOCKED USER")
    // const token = req.cookies.jwt;
    if(req.session.loggedIn) {
    const userSession=req.session.user

    const userId = userSession._id
    // if(token){
    //     jwt.verify(token,process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
           const user = await User.findById(userId);
           console.log(user.blocked)
            if (user.blocked === true){
           //   res.clearCookie('jwt')
            //   res.redirect('/error-403')
            console.log("REDIRECTING TO LOGGGGGGIN")
            res.render("user/login",{"errMsg":""})
          }else{
              next()
          }
        // });
    // }else{
    //     next()
    // }

        }
    
  
     
  };
