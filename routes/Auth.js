const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../controllers/Authentication')
const passport = require('passport');



//Home-Login
router.get('/', auth.homePage)

router.post('/login', passport.authenticate('local',
    { failureFlash: 'Username or password is incorrect', failureRedirect: '/' }), auth.loginUser)

//Home- register
router.get('/', auth.homePage)

router.post('/signup', auth.registerUser)

//Logout
router.get('/logout', auth.logoutUser)



module.exports = router;