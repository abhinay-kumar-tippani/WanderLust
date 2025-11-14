const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const ListingSchema = require("./joi.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
} 

module.exports.saveredirectLink = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    const { id } = req.params;  
    let list = await Listing.findById(`${id}`);
    if(!req.user._id.equals(list.owner._id)){
        req.flash("error", "you are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Schema Validation
module.exports.validateSchema = (req,res,next)=>{
    const { error } = ListingSchema.validate(req.body.listing);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, message);
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    let authorId = review.author;
    if(!req.user || !authorId.equals(res.locals.userStatus._id)){
        req.flash("error", "you dont have access to delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}