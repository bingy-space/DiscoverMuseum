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
        const price = Math.floor(Math.random() * 20 + 10);

        const theMuseum = new Museum({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(name)}`,
            image: 'https://images.unsplash.com/photo-1513038630932-13873b1a7f29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            price
        })
        await theMuseum.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});