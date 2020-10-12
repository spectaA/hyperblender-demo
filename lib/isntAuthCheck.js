module.exports = function(req, res, next) {
    if(req.session.userId) {
        res.redirect('/app');
    } else {
        next();
    }
}