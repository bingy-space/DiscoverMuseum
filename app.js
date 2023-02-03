const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Museum = require('./models/museum');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { museumSchema, reviewSchema } = require('./schemas.js');
const Review = require('./models/review');

// Call mongoose.connect
mongoose.connect('mongodb://localhost:27017/discover-museum', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// parses incoming requests
app.use(express.urlencoded({ extended: true }))
// method-override
app.use(methodOverride('_method'));

// Middleware
const validateMuseum = (req,res,next) => {
    const { error } = museumSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home');
})

// Index Route: to display museum list
app.get('/museums',catchAsync( async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', { museums });
}))

// New Route: add a museum page
app.get('/museums/new',catchAsync( async (req, res) => {
    res.render('museums/new');
}))

// POST new museum
app.post('/museums',validateMuseum, catchAsync(async (req, res, next) => {
    // if(!req.body.theMuseum) throw new ExpressError('Invalid Museum Data',400);
    const theMuseum = new Museum(req.body.museum);
    await theMuseum.save();
    res.redirect(`/museums/${theMuseum._id}`)
}))

// Show Route: to show museum detail
app.get('/museums/:id',catchAsync( async (req, res) => {
    const theMuseum = await Museum.findById(req.params.id);
    res.render('museums/show', { theMuseum });
}))

// Edit Route: to edit museum
app.get('/museums/:id/edit',catchAsync( async (req, res) => {
    const museum = await Museum.findById(req.params.id);
    res.render('museums/edit', { museum });
}))

app.put('/museums/:id',validateMuseum, catchAsync( async (req, res) => {
    const { id } = req.params;
    const museum = await Museum.findByIdAndUpdate(id, { ...req.body.museum });
    res.redirect(`/museums/${museum._id}`);
}))

// Delete Route: delete a museum
app.delete('/museums/:id',catchAsync( async (req, res) => {
    const { id } = req.params;
    await Museum.findByIdAndDelete(id);
    res.redirect('/museums');
}))

// Review POST route: add review
app.post('/museums/:id/reviews',validateReview, catchAsync(async (req, res) => {
    const museum = await Museum.findById(req.params.id);
    const review = new Review(req.body.review);
    museum.reviews.push(review);
    await review.save();
    await museum.save();
    res.redirect(`/museums/${museum._id}`);
}))

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
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