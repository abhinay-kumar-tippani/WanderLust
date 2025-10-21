const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.listen(port);

const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGOOSE_URL);
}

main()
    .then(console.log("Connected to DB"))
    .catch(err => { console.log(err) });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.get("/create", async(req, res)=>{
    res.render("listings/create");
});

app.get("/", async (req,res)=>{
    let count = await Listing.countDocuments();
    res.send(`<h1>We have total of ${count} Listings!</h1><br><br><h2><a href="http://localhost:3000/listings">Click Here</a></h2>`);
});

app.get("/listings", async (req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/home", {listings});
});

app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(`${id}`);
    res.render("listings/list", {list});
});

app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    let list = await Listing.findById(`${id}`);
    res.render("listings/edit", {list});
});

app.patch("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(`${id}`, { ...req.body.listing});
    console.log("Updated successfully!");
    res.redirect(`/listings/${id}`);
});


app.post("/listings", async (req, res)=>{
    let newListing  = req.body.listing;
    await Listing.create(newListing);
    console.log("Inserted successfully!");
    res.redirect("/listings");
});

app.delete("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(`${id}`);
    console.log("Deleted successfully!");
    res.redirect("/listings");
});

