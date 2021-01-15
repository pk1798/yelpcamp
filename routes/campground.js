
const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, campValidation } = require('../middleware/middleware');
const campgrounds = require('../controllers/campgrounds')
var multer = require('multer')
const { storage } = require('../Cloudinary/cloudinary')
var upload = multer({ storage })


//list of all campgrounds
router.get('/', campgrounds.listAllCamp)

//add a new campground
router.get('/new', isLoggedIn, campgrounds.newCampForm)

router.post('/', isLoggedIn, upload.array('images'), campgrounds.addNewCamp)
// router.post('/', campValidation, isLoggedIn, upload.single('image'), (req, res) => {
//     // const newcampimages = req.files.map(f => ({ url: f.path, filename: f.filename }))
//     // console.log(newcampimages)
//     console.log(req.body, req.file)
//     res.send('worked')
// })


//details of each campground
router.get('/:id', campgrounds.campDetails)

//updating campground

router.get('/:id/update', isLoggedIn, campgrounds.updateCampForm)

// router.put('/:id', campValidation, isLoggedIn, campgrounds.updateCamp)
router.put('/:id', isLoggedIn, upload.array('images'), campgrounds.updateCamp)


//delete
router.delete('/:id', isLoggedIn, campgrounds.deleteCamp)

module.exports = router;