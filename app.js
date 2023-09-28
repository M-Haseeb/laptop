const express=require("express");
const flash=require("connect-flash");
const sessions=require("express-session");
const mongoose=require("mongoose");
const ntpClient = require('ntp-client');
const passport=require("passport");
const dotenv=require("dotenv");
const ejs=require("ejs");
const path=require("path");
require("./Config/strategy")(passport);


//setting environment
dotenv.config({ path: path.join(__dirname, '.env') });


//setting database
db=require("./Config/db");
db();
  

//express middlewares

const app=express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());



app.use(express.static("Public"));
app.set("view engine","ejs");

app.use(sessions({
    secret:'secrete',
    resave:false,
    saveUninitialized:false
}));




app.use('/Public/assets', express.static('Public'));
app.use(passport.initialize());
app.use(passport.session());

//ntp-client

function synchronizeTime() {
    ntpClient.getNetworkTime("pool.ntp.org", 123, (err, date) => {
      if (err) {
        console.error('Error synchronizing time:', err);
      } else {
        // Set the system time to the synchronized time in PKT (GMT +05:00)
        const syncedTime = new Date(date);
        const pktTimezoneOffset = 5 * 60; // 5 hours * 60 minutes/hour
        syncedTime.setMinutes(syncedTime.getMinutes() + pktTimezoneOffset);
        console.log('Synchronized time (PKT):', syncedTime);
  
        // You can use 'syncedTime' as the synchronized time in your application
      }
    });
  }
  
  // Call the synchronizeTime function to sync the time
  synchronizeTime();

//flash messages

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.cart_msg=req.flash("cart_msg");
    res.locals.err=req.flash("err");

    next();
})

//@routes
app.use("/",require("./routes/user.js"));

const port=process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
})