const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
    
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
   

router.route("/")
   .get( wrapAsync( listingController.index))                     //index route
   .post(
    isLoggedIn,
     upload.single('listing[image]'),
      validateListing,
     wrapAsync(listingController.createListing))
   ;               //create route
    
   

  //new  route///
  router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
   .get( wrapAsync( listingController.showListing))
   .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
    .delete(
        isLoggedIn,
       isOwner,
       wrapAsync(listingController.deleteListing));


    
    



//edit route///
router.get("/:id/edit",
     isLoggedIn,
     isOwner,
    wrapAsync( listingController.renderEditForm));



module.exports = router;



















// router.post("/", validateListing, wrapAsync(async (req, res, next) => {
//     const newListing = new listing({
//         ...req.body.listing,
//         img: req.body.listing.img // Ensure this is included
//     });
//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// }));
// router.post("/", validateListing, wrapAsync(async (req, res, next) => {
//     const { listing } = req.body;
    
//     // Ensure image is an object
//     if (!listing.image) {
//         listing.image = {
//             url: "default-url", // Or handle default logic
//             filename: "defaultfilename"
//         };
//     }

//     const newListing = new listing(listing);
//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// }));
