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

const museums = require('./routes/museums');

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

const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

// For museum routes
app.use('/museums', museums)

app.get('/', (req, res) => {
    res.render('home');
})

// Review POST route: add review
app.post('/museums/:id/reviews',validateReview, catchAsync(async (req, res) => {
    const museum = await Museum.findById(req.params.id);
    const review = new Review(req.body.review);
    museum.reviews.push(review);
    await review.save();
    await museum.save();
    res.redirect(`/museums/${museum._id}`);
}))

// Review DELETE route: delete a review
app.delete('/museums/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const  {id, reviewId } = req.params;
    await Museum.findByIdAndUpdate(id, { $pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/museums/${id}`);
}))

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})