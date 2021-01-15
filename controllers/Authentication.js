// const ErrorClass = require('D:/Workstation/Javascript/yelpCamp/utils/ErrorClass');
const user = require('../models/user');

//Home page and login
module.exports.homePage = async (req, res) => {
    res.render('home')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Succesfully Logged In!');
    res.redirect('/campground')
}

//Sigu up 
module.exports.registerUser = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;
        const User = await new user({ firstname, lastname, username, email });
        const registeredUser = await user.register(User, password)
        req.logIn(registeredUser, (err) => {
            if (err) {
                return next(err)
            } else {
                req.flash('success', `Welcome, ${firstname}`)
                res.redirect(`/campground`)
            }
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/')
    }

}

//logout
module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'You successfully Logged out!')
    res.redirect('/')
}