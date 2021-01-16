
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const session = require('express-session');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const ErrorClass = require('./utils/ErrorClass');
//Routes
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/Auth')
//To flash messages.
const flash = require('connect-flash');
//For Authenthication
const passport = require('passport');
const localStrategy = require('passport-local')
//Models
const user = require('./models/user')
//NOSQL INJESCTION
const mongoSanitize = require('express-mongo-sanitize');
//Session store on MOONGO
const MongoStore = require('connect-mongo')(session);

//image upload
// const multer = require('multer');
// const storage = require('./Cloudinary/cloudinary')
// var upload = multer({ storage })

//process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
// 
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Connected!')
    })
    .catch(() => {
        console.log('Not connected!')
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'Thisisasecret';


const store = new MongoStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})


const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(mongoSanitize())

app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



//routes
app.use('/campground', campgroundRoutes);
app.use('/campground/:id/review', reviewRoutes);
app.use('/', authRoutes);


app.all('*', function (req, res, next) {
    next(new ErrorClass('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { message, statusCode } = err;
    res.render('partials/erroralerts', { err })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listeningg on port 3000')
})



