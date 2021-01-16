const ErrorClass = require('../utils/ErrorClass');
const review = require('../models/reviews');
const campground = require('../models/campground');

//To add a review
module.exports.addReview = async (req, res) => {
    const camp = await campground.findById(req.params.id);
    const reviews = await new review(req.body);
    reviews.author = req.user.username;
    reviews.authorid = req.user.id;
    camp.reviews.push(reviews)
    reviews.save();
    camp.save();
    req.flash('success', 'Review Added succesfully!');
    res.redirect(`/campground/${req.params.id}`)
}

//To delete Review
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted succesfully!');
    res.redirect(`/campground/${id}`)
}