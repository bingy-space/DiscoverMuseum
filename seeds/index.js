// Will run this file on its own separately from our Node app
// Any time we want to seed our database: any time we make changes to the model or to our data
// > node seeds/index.js

const mongoose = require('mongoose');
const Museum = require('../models/museum');
const cities = require('./cities');
const { name } = require('./seedHelpers');

// Call mongoose.connect
mongoose.connect('mongodb://localhost:27017/discover-museum', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true

})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () =>{
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Museum.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const theMuseum = new Museum({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(name)}`
        })
        await theMuseum.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});