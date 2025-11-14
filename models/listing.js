const mongoose = require("mongoose");
const Review = require("./review.js");

const ListingSchema = new mongoose.Schema({
    title: {
        type : String,
        require : true
    },
    description: {
        type : String
    },
    image: {
        url : String,
        filename : String
    },
    price : {
        type : Number
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    reviews : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    }
});

ListingSchema.post("findOneAndDelete", async (listing) => {
    if(listing.reviews.length){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
    console.log("Reviews Deleted!");
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;