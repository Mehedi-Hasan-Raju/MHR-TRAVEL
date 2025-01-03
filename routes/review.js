const express = require("express");
const router = express.Router({mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");
const review = require("../models/review.js")
//Reviews/////////////
router.post("/",isLoggedIn,
     validateReview,
      wrapAsync(reviewController.createReview));
 
 //Delete Reviews route//
 router.delete("/:reviewId",
    isLoggedIn,
     isReviewAuthor, 
     wrapAsync(reviewController.deleteReview));
 
 module.exports = router;