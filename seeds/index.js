const mongoose = require('mongoose');
const campground = require('../models/campground');
const seeds = require('./seeds');
const { descriptors, places } = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected!')
    })
    .catch(() => {
        console.log('Not connected!')
    })


const seedHelpers = arr => arr[Math.floor(Math.random() * arr.length)]

const seedDb = async () => {
    await campground.deleteMany({});
    for (i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new campground({
            location: `${seeds[random1000].city},${seeds[random1000].city}`,
            title: `${seedHelpers(descriptors)} ${seedHelpers(places)}`,
            price: 400,
            image: 'https://source.unsplash.com/random',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum'
        })

        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})