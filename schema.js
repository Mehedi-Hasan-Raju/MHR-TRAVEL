const Joi = require('joi');

module.exports.listingSchema = Joi.object({
      listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        
        image: Joi.object({
          filename: Joi.string(),
          url: Joi.string().uri(), // Validates as a proper URL
        }),
        price : Joi.number().required().min(0),
        country : Joi.string().required(),
        location : Joi.string().required(),
       
    }).required()
})


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
     rating: Joi.number().required().min(1).max(5),
     Comment: Joi.string().required(),
  }).required()
})