const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Museum = require('../models/museum');
const { museumSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateMuseum } = require('../middleware');

// Index Route: to display museum list
router.get('/',catchAsync( async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', { museums });
}))

// New Route: add a museum page
router.get('/new', isLoggedIn, catchAsync( async (req, res) => {
    res.render('museums/new');
}))

// POST new museum
router.post('/',isLoggedIn, validateMuseum, catchAsync(async (req, res, next) => {
    // if(!req.body.theMuseum) throw new ExpressError('Invalid Museum Data',400);
    const theMuseum = new Museum(req.body.museum);
    theMuseum.author = req.user._id;
    await theMuseum.save();
    req.flash('success','Successfully made a new museum');
    res.redirect(`/museums/${theMuseum._id}`)
}))

// Show Route: to show museum detail
router.get('/:id',catchAsync( async (req, res) => {
    const theMuseum = await Museum.findById(req.params.id).populate({path:'reviews', populate: {path: 'author'}}).populate('author');
    console.log(theMuseum);
    if(!theMuseum){
        req.flash('error','Cannot find that museum');
        return res.redirect('/museums');
    }
    res.render('museums/show', { theMuseum });
}))

// Edit Route: to edit museum
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( async (req, res) => {
    const { id } = req.params;
    const museum = await Museum.findById(id);
    if(!museum){
        req.flash('error','Cannot find that museum');
        return res.redirect('/museums');
    }
    res.render('museums/edit', { museum });
}))

// Update Route: update the museum
router.put('/:id', isLoggedIn,isAuthor, validateMuseum, catchAsync( async (req, res) => {
    const { id } = req.params;
    const museum = await Museum.findByIdAndUpdate(id, { ...req.body.museum });
    req.flash('success','Successfully Updates Museum');
    res.redirect(`/museums/${museum._id}`);
}))

// Delete Route: delete a museum
router.delete('/:id', isLoggedIn, isAuthor, catchAsync( async (req, res) => {
    const { id } = req.params;
    await Museum.findByIdAndDelete(id);
    res.redirect('/museums');
}))

module.exports = router;