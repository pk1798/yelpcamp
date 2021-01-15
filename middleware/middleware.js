const { campgroundschema, reviewSchema } = require('../utils/ValidateSchema');


//To check is the user is logged In or not before doing any action
module.exports.isLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in.')
        res.redirect('/')
    } else {
        next();
    }
}

//------------------Back-end Validations.--------------

//campground validation

module.exports.campValidation = (req, res, next) => {
    const { error } = campgroundschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//review validation

module.exports.reviewValidation = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        next(new ErrorClass(error, 500))
    } else {
        next()
    }
}