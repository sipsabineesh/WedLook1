const express = require("express")
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const connectDB = require('./server/database/connection')
const session = require('express-session')
const app =  express()

dotenv.config({path :'config.env'})

const PORT = process.env.PORT || 8080
const baseUrl = process.env.BASE_URL;
//log requests
app.use(morgan('tiny'))

//mongodb connection
connectDB()

//set view engine
app.set('view engine','ejs')
//app.set('views',path.resolve(__dirname,'views/ejs'))

app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))

//parse request to body-parser
app.use(bodyparser.urlencoded({urlencoded:true}))

app.use(cookieParser())

app.use(session({
	secret:'secret',
	resave: true,
	saveUninitialized: true
}));

app.use((req, res, next) => {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
	res.header('Expires', '0');
	res.header('Pragma', 'no-cache');
	next();
  });
  
// load routers
app.use('/admin',require ('./server/routes/adminRouter'))
app.use('/',require ('./server/routes/userRouter'))


app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`)
})