module.exports = function(req, res, next) {
    if(req.session.userId) {
        next();
    } else {
        res.redirect('/auth');
    }
}