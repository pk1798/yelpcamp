const mongoose = require('mongoose');
const schema = mongoose.Schema;


const reviewSchema = new schema({
    body: {
        type: String,
    },
    rating: {
        type: Number,
    },
    author:
    {
        type: String
    },
    authorid:
    {
        type: schema.Types.ObjectId,
        ref: 'user',
    }
})


module.exports = mongoose.model('review', reviewSchema);