const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Museum = require('./models/museum');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
// parses incoming requests
app.use(express.urlencoded({ extended: true }))
// method-override
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
})

// Index Route: to display museum list
app.get('/museums', async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', {museums});
})

// New Route: add a museum page
app.get('/museums/new', async (req, res) => {
    res.render('museums/new');
})

// POST new museum
app.post('/museums', async (req, res, next) => {
    try{
        const theMuseum = new Museum(req.body.museum);
        await theMuseum.save();
        res.redirect(`/museums/${theMuseum._id}`)
    }catch(e){
        next(e)
    }

})

// Show Route: to show museum detail
app.get('/museums/:id', async (req, res) => {
    const theMuseum = await Museum.findById(req.params.id);
    res.render('museums/show',{ theMuseum });
})

// Edit Route: to edit museum
app.get('/museums/:id/edit', async (req, res) => {
    const museum = await Museum.findById(req.params.id);
    res.render('museums/edit',{ museum });
})

app.put('/museums/:id', async (req, res) => {
    const { id } = req.params;
    const museum = await Museum.findByIdAndUpdate(id, { ...req.body.museum });
    res.redirect(`/museums/${ museum._id }`);
})

// Delete Route: delete a museum
app.delete('/museums/:id', async (req, res) => {
    const { id } = req.params;
    await Museum.findByIdAndDelete(id);
    res.redirect('/museums');
})

app.use((err, req, res, next) => {
    res.send('OMG !!');
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