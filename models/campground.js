const { required } = require('joi');
const mongoose = require('mongoose');
const review = require('./reviews');
const schema = mongoose.Schema;

const imageSchema = new schema({
    url: String,
    filename: String
})

https://res.cloudinary.com/local-food-review/image/upload/v1610342989/userImages/lafkuuhnkzyml5jyhyy3.jpg

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100')
})

const campgroundschema = new schema({
    title:
    {
        type: String,
        required: true
    },
    images: [imageSchema],
    price:
    {
        type: Number,
        required: true,
    },
    description:
    {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location:
    {
        type: String,
        required: true
    },
    reviews:
        [{
            type: schema.Types.ObjectId,
            ref: 'review',
        }],
    author:
    {
        type: schema.Types.ObjectId,
        ref: 'user',
    }
})

campgroundschema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })

    }
})


module.exports = mongoose.model('campground', campgroundschema)