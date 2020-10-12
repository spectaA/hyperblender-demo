module.exports = function(req, res, next) {
    if(config.ADMIN_ROLES_ID.includes(req.session.role)) next();
    else {
        req.flash('errorCode', "403");
        req.flash('errorText', "Nous n'avez pas les droits.");
        req.flash('errorRedirect', "/app/dashboard");
        res.redirect("/err");
    }
}