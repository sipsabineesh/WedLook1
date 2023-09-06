const nodemailer = require('nodemailer');

const sendEmail = async(email,msg) =>{
 console.log("IN SEND EMAIL FILE")

 try{
    const transport =  nodemailer.createTransport()({
        host:'',
        port: 587,
        secure:false,
        auth:{
            user:email,
            password:'gycisgobecmixzlc'
        }
 })
 //message obj
 const  message={
 to,
subject:"OTP ",
html: 
      `<h3>Please provide the OTP in the forgot password form for changing your password</h3>`
 };
 //send the email
 const info =await transporter.sendMail(message);
 console.log("Message sent successfully",info.messageId)
} 
 catch(error){
    console.log(error); 
    throw new Error("Email could not be sent")
 }
};

module.exports = sendEmail;  