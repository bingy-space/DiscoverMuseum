const Museum = require('../models/museum');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req, res) => {
    const museums = await Museum.find({});
    res.render('museums/index', { museums });
}

module.exports.renderNewForm = async (req, res) => {
    res.render('museums/new')
}

module.exports.createMuseum = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.museum.location,
        limit: 1
    }).send()
    console.log(geoData.body.features[0].geometry.coordinates);
    res.send("OK")

    // if(!req.body.theMuseum) throw new ExpressError('Invalid Museum Data',400);
    // const theMuseum = new Museum(req.body.museum);
    // theMuseum.images =  req.files.map(f => ({url: f.path, filename: f.filename}))
    // theMuseum.author = req.user._id;
    // await theMuseum.save();
    // console.log(theMuseum)
    // req.flash('success','Successfully made a new museum');
    // res.redirect(`/museums/${theMuseum._id}`)
}

module.exports.showMuseum = async (req, res) => {
    const theMuseum = await Museum.findById(req.params.id).populate({path:'reviews', populate: {path: 'author'}}).populate('author');
    console.log(theMuseum);
    if(!theMuseum){
        req.flash('error','Cannot find that museum');
        return res.redirect('/museums');
    }
    res.render('museums/show', { theMuseum });
}

module.exports.editMuseum = async (req, res) => {
    const { id } = req.params;
    const museum = await Museum.findById(id);
    if(!museum){
        req.flash('error','Cannot find that museum');
        return res.redirect('/museums');
    }
    res.render('museums/edit', { museum });
}

module.exports.updateMuseum = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const museum = await Museum.findByIdAndUpdate(id, { ...req.body.museum });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    museum.images.push(...imgs);
    await museum.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await museum.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success','Successfully Updates Museum');
    res.redirect(`/museums/${museum._id}`);
}

module.exports.deleteMuseum = async (req, res) => {
    const { id } = req.params;
    await Museum.findByIdAndDelete(id);
    res.redirect('/museums');
}