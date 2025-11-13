const express = require('express');
const route = express.Router({mergeParams:true});

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const Review = require("../models/review.js");

route.post("/", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {rating, comment} = req.body;
    let newReview = new Review({rating, comment, author: req.user._id});
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    console.log("Review Added!");
    res.redirect(`/listings/${id}`);
}));

route.delete("/:reviewId", async (req,res) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    let authorId = review._id;
    if(authorId.equals(req.user._id)){
        console.log("hi");
    }
    await Listing.findByIdAndUpdate(id, {$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log(`Deleted Review successfully!`);
    res.redirect(`/listings/${id}`);
});

    // const { id } = req.params;  
    // let list = await Listing.findById(`${id}`);
    // if(!req.user._id.equals(list.owner._id)){
    //     req.flash("error", "you are not the owner of this listing!");
    //     return res.redirect(`/listings/${id}`);
    // }
    // next();

module.exports = route;