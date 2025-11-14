const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createRequest = async(req, res)=>{
    res.render("listings/create");
}

module.exports.Home =  async (req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/home", {listings});
}

module.exports.showList = async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(`${id}`).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/list", {list});
}

module.exports.editRequest = async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(`${id}`);
    res.render("listings/edit", {list});
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(`${id}`, { ...req.body.listing});
    console.log("Updated successfully!");
    req.flash("success", "Listing edited successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.createListing = async (req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing  = req.body.listing;
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await Listing.create(newListing);
    console.log("Inserted successfully!");
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}

module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(`${id}`);
    console.log("Deleted successfully!");
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}