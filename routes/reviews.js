const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Museum = require('../models/museum');
const Review = require('../models/review');
const { validateReview, isLoggedIn } = require('../middleware');


// Review POST route: add review
router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const museum = await Museum.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    museum.reviews.push(review);
    await review.save();
    await museum.save();
    req.flash('success','Successfully Add Review');
    res.redirect(`/museums/${museum._id}`);
}))

// Review DELETE route: delete a review
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const  {id, reviewId } = req.params;
    await Museum.findByIdAndUpdate(id, { $pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Delete Review');
    res.redirect(`/museums/${id}`);
}))

module.exports = router;