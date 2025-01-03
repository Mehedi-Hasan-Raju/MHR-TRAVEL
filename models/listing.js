const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

// const { listingSchema } = require("../schema");
// const { required } = require("joi");
// const { text } = require("express");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },    
     image: {
        url: String,
        filename: String,
     },

   
      
    price: {
        type: Number,
    },    
    location: {
        type: String,
    },    
    country: {
        type: String,
    },  
    
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry :  {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },

});



listingSchema.post("findOneAndDelete", async (Listing) => { 
 
    if (Listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model("Listing", listingSchema);

module.exports = listing;



