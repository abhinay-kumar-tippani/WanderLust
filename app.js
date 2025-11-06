const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

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

app.use(flash());

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
app.use(session(sessionOptions));

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let{status=500, message="Something went Wrong!"} = err;
    res.status(status).render("listings/error", {message});
});
