const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register',(req,res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async(req,res, next) =>{
    try{
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if(err) return nect(err);
            req.flash('success','Welcome to Discover Museum');
            res.redirect('/museums');
        });
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }

}))

router.get('/login',(req,res) => {
    res.render('users/login');
})

router.post('/login',passport.authenticate('local', {failureFlash: true, failureRedirect:'/login',keepSessionInfo: true}), (req,res) =>{
    req.flash('success','Welcome Back');
    const redirectUrl = req.session.returnTo || '/museums';
    delete req.session.returnTo;
    console.log("RedirectUrl",redirectUrl);
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/museums');
    });
}); 

module.exports = router;