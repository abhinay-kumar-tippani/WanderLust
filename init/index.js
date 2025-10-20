const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const main = async () => {
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

main()
    .then(console.log("Connected to DB"))
    .catch(err=>{console.log(err)});


const initDB = async () => {
    await Listing.insertMany(initData.data);
}

initDB()
    .then(console.log("Data iniltialized successfully!"))
    .catch(err=>{console.log(err)});