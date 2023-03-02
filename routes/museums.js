const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Museum = require('../models/museum');
const { museumSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateMuseum } = require('../middleware');
const museums = require('../controllers/museums');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

// Restructure Route
router.route('/')
    .get(catchAsync(museums.index))
    // .post(isLoggedIn, validateMuseum, catchAsync(museums.createMuseum))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files)
        res.send("It Worked?");
    })

router.get('/new', isLoggedIn, catchAsync(museums.renderNewForm))

router.route('/:id')
    .get(catchAsync(museums.showMuseum))
    .put(isLoggedIn,isAuthor, validateMuseum, catchAsync(museums.updateMuseum))
    .delete(isLoggedIn, isAuthor, catchAsync(museums.deleteMuseum))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(museums.editMuseum))

// Index Route: to display museum list
// router.get('/',catchAsync(museums.index));
// New Route: add a museum page
// router.get('/new', isLoggedIn, catchAsync(museums.renderNewForm))
// POST new museum
// router.post('/',isLoggedIn, validateMuseum, catchAsync(museums.createMuseum))
// Show Route: to show museum detail
// router.get('/:id',catchAsync(museums.showMuseum))
// Edit Route: to edit museum
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(museums.editMuseum))
// Update Route: update the museum
// router.put('/:id', isLoggedIn,isAuthor, validateMuseum, catchAsync(museums.updateMuseum))
// Delete Route: delete a museum
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(museums.deleteMuseum))

module.exports = router;