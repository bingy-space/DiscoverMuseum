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