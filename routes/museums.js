const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Museum = require('../models/museum');
const { museumSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateMuseum } = require('../middleware');
const museums = require('../controllers/museums');

// Index Route: to display museum list
router.get('/',catchAsync(museums.index));

// New Route: add a museum page
router.get('/new', isLoggedIn, catchAsync(museums.renderNewForm))

// POST new museum
router.post('/',isLoggedIn, validateMuseum, catchAsync(museums.createMuseum))

// Show Route: to show museum detail
router.get('/:id',catchAsync(museums.showMuseum))

// Edit Route: to edit museum
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(museums.editMuseum))

// Update Route: update the museum
router.put('/:id', isLoggedIn,isAuthor, validateMuseum, catchAsync(museums.updateMuseum))

// Delete Route: delete a museum
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(museums.deleteMuseum))

module.exports = router;