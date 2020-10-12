const express = require('express');
const router = express.Router();


        // Unknown error
router.use('/', function(req, res) {
    res.render('pages/error', {
        pageTitle: 'erreur',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        errorCode: req.flash('errorCode'),
        errorText: req.flash('errorText'),
        errorRedirect: req.flash('errorRedirect'),
        alertEmail: req.flash('alertEmail')
    })
})

        // Known error
router.use('/:code', function(req, res) {
    res.render('pages/error', {
        pageTitle: 'erreur',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        errorCode: req.flash('errorCode'),
        errorText: req.flash('errorText'),
        errorRedirect: req.flash('errorRedirect'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// Export
// 
module.exports = router;