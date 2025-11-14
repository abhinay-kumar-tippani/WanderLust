const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {rating, comment} = req.body;
    let newReview = new Review({rating, comment, author: req.user._id});
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    console.log("Review Added!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log(`Deleted Review successfully!`);
    res.redirect(`/listings/${id}`);
}