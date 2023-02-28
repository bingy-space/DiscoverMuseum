const ExpressError = require('./utils/ExpressError');
const { museumSchema, reviewSchema } = require('./schemas.js');
const Museum = require('./models/museum');
const Review = require('./models/review');

/**
 * Museum Middleware
 */

// IsLoggedIn Middleware
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log(req.path, req.originalUrl)
        // Store the url they are requesting
        req.session.returnTo = req.orginalUrl;
        req.flash('error','Must be signed in');
        return res.redirect('/login');
    }
    next();
}
// Validate Museum Middleware
module.exports.validateMuseum = (req,res,next) => {
    const { error } = museumSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
// IsAuthor Middleware
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const museum = await Museum.findById(id);
    if(!museum.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/museums/${id}`);
    }
    next();
}

/**
 * Review Middleware
 */

// ValidateReview Middleware
module.exports.validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

// IsReviewAuthor Middleware
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/museums/${id}`);
    }
    next();
}