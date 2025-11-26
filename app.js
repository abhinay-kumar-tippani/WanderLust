if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync.js");
// const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user.js');
const LocalStratergy = require('passport-local');
const passport = require('passport');

const listingsRoute = require("./routes/listings.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");

app.listen(port);
const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGOOSE_URL);
}

main()
    .then(() => console.log("Connected to DB"))
    .catch(err => { console.log(err) });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine('ejs', ejsMate);

const sessionOptions = {
    secret:'secretcode', 
    resave:false, 
    saveUninitialized:true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}

app.use(flash());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    res.locals.userStatus = req.user;
    next();
});

app.use("/", userRoute);
app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);



app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let{status=500, message="Something went Wrong!"} = err;
    res.status(status).render("listings/error", {message});
});
