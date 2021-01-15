const joi = require('joi');

module.exports.campgroundschema = joi.object({
    title: joi.string().required(),
    // images: joi.string().required(),
    price: joi.number().required().min(0),
    description: joi.string().required(),
    location: joi.string().required(),
}).required()


module.exports.reviewSchema = joi.object({
    rating: joi.required(),
    body: joi.string().required(),
}).required()

module.exports.userSchema = joi.object({
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required().min(8)
}).required()