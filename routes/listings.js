const express = require('express');
const route = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn, isOwner, validateSchema} = require('../middleware.js');


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
    let list = await Listing.findById(`${id}`).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/list", {list});
}));


//Edit Request
route.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res)=>{
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
    newListing.owner = req.user._id;
    await Listing.create(newListing);
    console.log("Inserted successfully!");
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}));


//Delete
route.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(`${id}`);
    console.log("Deleted successfully!");
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));


module.exports = route;