const express = require('express');
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const {isLoggedIn, isOwner, validateSchema} = require('../middleware.js');
const ListingController = require('../controllers/listing.js');


router.route("/")
.get(wrapAsync(ListingController.Home)) //Home router
.post( validateSchema, wrapAsync(ListingController.createListing )); //Create

//Create
router.get("/create", isLoggedIn, ListingController.createRequest);

router.route("/:id")
.get(wrapAsync(ListingController.showList))
.patch( wrapAsync(ListingController.editListing))
.delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing))


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.editRequest));

module.exports = router;