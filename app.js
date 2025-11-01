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
const ListingSchema = require("./joi.js");
const Review = require("./models/review.js");

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

const validateSchema = (req,res,next)=>{
    const { error } = ListingSchema.validate(req.body.listing);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, message);
    }
    next();
}

app.get("/create", async(req, res)=>{
    res.render("listings/create");
});

app.get("/", wrapAsync(async (req,res)=>{
    let count = await Listing.countDocuments();
    res.send(`<h1>We have total of ${count} Listings!</h1><br><br><h2><a href="http://localhost:3000/listings">Click Here</a></h2>`);
}));

app.get("/listings",wrapAsync( async (req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/home", {listings});
}));

app.get("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(`${id}`).populate("reviews");
    res.render("listings/list", {list});
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(`${id}`);
    res.render("listings/edit", {list});
}));

app.patch("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(`${id}`, { ...req.body.listing});
    console.log("Updated successfully!");
    res.redirect(`/listings/${id}`);
}));

app.post("/listings", validateSchema, wrapAsync( async (req, res)=>{

    let newListing  = req.body.listing;
    await Listing.create(newListing);
    console.log("Inserted successfully!");
    res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(`${id}`);
    console.log("Deleted successfully!");
    res.redirect("/listings");
}));

app.post("/listings/:id/reviews", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {rating, comment} = req.body;
    let newReview = new Review({rating, comment});
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    console.log("Review Added!");
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id/reviews/:reviewId", async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log(`Deleted Review successfully!`);
    res.redirect(`/listings/${id}`);
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let{status=500, message="Something went Wrong!"} = err;
    res.status(status).render("listings/error", {message});
});
