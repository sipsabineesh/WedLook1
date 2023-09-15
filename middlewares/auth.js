const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function verifyToken(req,res,next){
  console.log("secret  :  " + secret)
  let jwtToken = res.cookie.jwt
  if(jwtToken == undefined){
      //res.status(401).send({error:"no token provided"})
      console.log("no token provided")
  }
  console.log("jwtToken   :"+jwtToken)
 //let token = authHeader.split(".")[1]
 const parts = jwtToken.split('.');
 console.log(" parts[1]  "+parts[1])

// Decode the header, payload, and signature
const header = JSON.parse(atob(parts[0]));
const payload = JSON.parse(atob(parts[1]));
const signature = parts[2];

console.log('Header:', header);
console.log('Payload:', payload);
console.log('Signature:', signature);


  jwt.verify(parts[1],secret,function(err,decoded){
      if(err) {
          console.log("Authentication Failed")
      }
      else{
          next()
      }
  })
 }


module.exports = verifyToken;