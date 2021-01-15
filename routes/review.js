
var express = require('express')
const router = express.Router({ mergeParams: true });
const { isLoggedIn, reviewValidation } = require('../middleware/middleware');
const reviews = require('../controllers/review')

//review

router.post('/', reviewValidation, isLoggedIn, reviews.addReview)

router.delete('/:reviewId', isLoggedIn, reviews.deleteReview)


module.exports = router;