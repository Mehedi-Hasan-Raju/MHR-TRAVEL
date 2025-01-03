//const { models } = require("mongoose");
const listing = require("../models/listing"); 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

 module.exports.index = ( async (req, res) => {
    const allListing = await listing.find({});
    res.render("listing/index.ejs", {allListing});
});

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs")
 };

 module.exports.showListing =  async (req, res) => {
    let { id } = req.params;
     id = id.trim();
    const Listing = await listing.findById(id)
    .populate({
        path:"reviews",
    populate: {
        path: "author",
    },
})
    .populate("owner");
    if(!Listing) {
        req.flash("error", "Listing you requisted for does not exist");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", { Listing });
 };

 module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    
    
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
   let saveListing = await newListing.save();
   console.log(saveListing);
   req.flash("success", "New Listing Created!");
   res.redirect("/listings");
  
};

module.exports.renderEditForm =  async(req, res) => {
    let {id} = req.params;
    id = id.trim();
    const Listing = await listing.findById(id);
    if(!Listing) {
        req.flash("error", "Listing you requisted for does not exist");
        res.redirect("/listings");
    }

    let originalImageUrl = Listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/c_fill,h_200,w_250/");

    res.render("listing/edit.ejs", {Listing , originalImageUrl});
};

module.exports.updateListing =  async (req, res) => {
    let { id } = req.params;
    id = id.trim();
     // Log the form data
    let updateListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListing.image = { url, filename };
    await updateListing.save();
    }
    
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing =  async (req, res) => {
    let {id} = req.params;
    id = id.trim();
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};