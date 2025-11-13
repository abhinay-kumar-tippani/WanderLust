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
        type : String,
        default : "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: (v)=> v===""?
        "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60":v
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