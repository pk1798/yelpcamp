const campground = require('D:/Workstation/Javascript/yelpCamp/models/campground');
const ErrorClass = require('D:/Workstation/Javascript/yelpCamp/utils/ErrorClass');
const multer = require('multer');
const { cloudinary } = require('../Cloudinary/cloudinary');
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCode = mbxGeoCoding({ accessToken: mapBoxToken });



//To list all camps in Home page
module.exports.listAllCamp = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds })
}
//To render a form and to add new camp
module.exports.newCampForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.addNewCamp = async (req, res, next) => {
    try {
        const geoLocation = await geoCode.forwardGeocode({
            query: req.body.location,
            limit: 2
        }).send()
        const newcamp = new campground(req.body)
        newcamp.geometry = geoLocation.body.features[0].geometry;
        newcamp.author = req.user.id;
        newcamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
        await newcamp.save()
        req.flash('success', 'Campground Added succesfully!');
        res.redirect(`/campground`)
    } catch (err) {
        next(new ErrorClass('Something Wrong', 500));
    }
}

//To show details of Each campground
module.exports.campDetails = async (req, res) => {
    try {
        const campgrounds = await campground.findById(req.params.id).populate('reviews').populate('author')
        res.render('campgrounds/details', { campgrounds })
    } catch {
        req.flash('error', 'No Camppground found!');
        res.redirect(`/campground`)
        // next(new ErrorClass('No product found', 401))
    }
}

//To render a form and to update existing camp
module.exports.updateCampForm = async (req, res) => {
    try {

        const id = req.params.id;
        const foundproduct = await campground.findById(id);
        res.render('campgrounds/update', { foundproduct })
    } catch {
        next(new ErrorClass('No product found', 401))
    }
}

module.exports.updateCamp = async (req, res, next) => {
    try {
        const camp = await campground.findById(req.params.id)
        if (!req.user._id.equals(camp.author)) {
            req.flash('error', 'You dont have permission to update the campground');
            res.redirect(`/campground/${req.params.id}`)
        }
        const geoLocation = await geoCode.forwardGeocode({
            query: req.body.location,
            limit: 5
        }).send()
        const foundproduct = await campground.findByIdAndUpdate(req.params.id, req.body);
        foundproduct.geometry = geoLocation.body.features[0].geometry;
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        foundproduct.images.push(...imgs)
        await foundproduct.save()
        if (req.body.deleteImage) {
            for (let filename of req.body.deleteImage) {
                cloudinary.uploader.destroy(filename)
            }
            await foundproduct.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImage } } } })
        }
        console.log(foundproduct)

        req.flash('success', 'Campground Updated succesfully!');
        res.redirect(`/campground/${req.params.id}`)

    } catch (err) {
        req.flash('error', 'Campground Not updated, Something went wrong! ');
        req.flash('error', `${err.stack}`);

        res.redirect(`/campground/${req.params.id}`)
    }
}

//TO delete a campground

module.exports.deleteCamp = async (req, res) => {
    try {
        const id = req.params.id;
        const foundproduct = await campground.findByIdAndDelete(id);
        req.flash('success', 'Campground deleted succesfully!');
        res.redirect('/campground')
    } catch (err) {
        next(new ErrorClass('Cannot delete Product', 500))
    }
}