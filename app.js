const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Museum = require('./models/museum');

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

const app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
})

// Route to display museum list
app.get('/museums', async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', {museums});
})


// Creating a new museum
// app.get('/makemuseum', async (req, res) => {
//     const theMusuem = new Museum({title: 'MOMA', description: 'A place that fuels creativity, ignites minds, and provides inspiration'})
//     await theMusuem.save();
//     res.send(theMusuem);
// })

app.listen(3000, () => {
    console.log('Serving on port 3000')
})