const express = require('express');
const route = express.Router({mergeParams:true});
const wrapAsync = require("../utils/WrapAsync.js");
const { isAuthor } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');


route.post("/", wrapAsync(reviewController.postReview));

route.delete("/:reviewId", isAuthor, reviewController.destroyReview);

module.exports = route;