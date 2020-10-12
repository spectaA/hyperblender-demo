const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();


// 
// SQL CONSOLE
// 
router.get('/sql', function(req, res) {
    res.render('pages/admin', {
        pageTitle: 'administration',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// LOG FILE
// 
router.get('/logs/:file', function (req, res) {
    res.render('pages/logFile', {
        fileName: req.params.file,
        layout: 'layouts/unlogged',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo')
    })
})

// 
// LOGS LIST
// 
router.get("/logs", function(req, res) {
    res.render('pages/logsList', {
        pageTitle: 'Liste des logs',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// STOPNOW
// 
router.get("/stopnow", function(req, res) {
    res.send("Application stopped by " + req.session.name);
    throw new Error("Application stopped by " + req.session.name);
})

// 
// Default
// 
router.use('/', function(req, res) {
    res.redirect('/admin/sql');
})

// 
// Unknown
// 
router.use(function(req, res) {
    req.flash('errorCode', "404 mes couilles ti");
    req.flash('errorText', "Page non trouvée");
    req.flash('errorRedirect', "/app");
    res.redirect("/err");
})

// 
// Export
// 
module.exports = router;