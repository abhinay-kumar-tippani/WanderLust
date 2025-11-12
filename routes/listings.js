const express = require('express');
const route = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const ListingSchema = require("../joi.js");
const {isLoggedIn} = require('../middleware.js');


//Schema Validation
const validateSchema = (req,res,next)=>{
    const { error } = ListingSchema.validate(req.body.listing);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, message);
    }
    next();
}


//Create
route.get("/create", isLoggedIn , async(req, res)=>{
    res.render("listings/create");
});

//Home route
route.get("/",wrapAsync( async (req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/home", {listings});
}));


//Single List
route.get("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(`${id}`).populate("reviews");
    if(!list){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/list", {list});
}));


//Edit Request
route.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(`${id}`);
    res.render("listings/edit", {list});
}));


//Edit
route.patch("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(`${id}`, { ...req.body.listing});
    console.log("Updated successfully!");
    req.flash("success", "Listing edited successfully!");
    res.redirect(`/listings/${id}`);
}));

//Create
route.post("/", validateSchema, wrapAsync( async (req, res)=>{
    let newListing  = req.body.listing;
    await Listing.create(newListing);
    console.log("Inserted successfully!");
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}));


//Delete
route.delete("/:id", isLoggedIn, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(`${id}`);
    console.log("Deleted successfully!");
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));


module.exports = route;