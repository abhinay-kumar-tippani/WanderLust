const express = require('express');
const route = express.Router({mergeParams:true});

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const Review = require("../models/review.js");

route.post("/", wrapAsync(async (req,res) => {
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

route.delete("/:reviewId", async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log(`Deleted Review successfully!`);
    res.redirect(`/listings/${id}`);
});



module.exports = route;