const express = require('express');
const router = express.Router();

const isAdminCheck = require('../lib/isAdminCheck.js');
const admRoute = require('./admRoute.js');

// Warning message for non-validated emails
router.use(function (req, res, next) {
    let userId = req.session.userId;
    db.query("SELECT emailVerified, email FROM users WHERE userId = ?", [userId], function(err, results) {
        if(results.length > 0 && results[0].emailVerified == 0) {
            let emailAlert = `📩 votre email <small>${results[0].email}</small> n\'est pas vérifiée ! suivez les instructions du mail reçu ou <a href="/app/profile">cliquez ici</a> pour plus d'informations. (Pensez à vérifier vos spams)`;
            req.flash('alertEmail');
            req.flash('alertEmail', emailAlert);
        };
        next();
    })
})

// 
// DASHBOARD
// 
router.get('/dashboard', function(req, res) {
    res.render('pages/dashboard', { 
        pageTitle: 'tableau de bord',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// CALENDARS
// 
router.get('/calendars', function(req, res) {
    res.render('pages/calendars', {
        pageTitle: 'calendriers',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// COLLISIONS
// 
router.get('/collisions', function(req, res) {
    res.render('pages/collisions', {
        pageTitle: 'collisions',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// OPTIONS
// 
// router.get('/options', function(req, res) {
//     res.render('pages/options', {
//         pageTitle: 'options',
//         alertDanger: req.flash('alertDanger'),
//         alertSuccess: req.flash('alertSuccess'),
//         alertInfo: req.flash('alertInfo'),
//         alertEmail: req.flash('alertEmail')
//     })
// })

// 
// ADMIN DASHBOARD : /app/admin DEPRECATED --> USE /admin
// 
router.get('/admin', function(req, res) {
    res.redirect("/admin");
});

// 
// TUTORIAL
// 
router.get('/tutorial', function(req, res) {
    res.render('pages/tutorial', {
        pageTitle: 'tutoriel',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// FIRST VISIT
// 
router.get('/firstVisit', function(req, res) {
    res.render('pages/firstVisit', {
        pageTitle: 'bienvenue',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// CONTACT
// 
router.get('/contact', function(req, res) {
    res.render('pages/contact', {
        pageTitle: 'contact',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: req.flash('alertEmail')
    })
})

// 
// PROFILE
// 
router.get('/profile', function(req, res) {
    res.render('pages/profile', {
        pageTitle: 'profil',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        alertInfo: req.flash('alertInfo'),
        alertEmail: ""
    })
})

// 
// Default
// 
router.get('/', function(req, res) {
    res.redirect('/app/dashboard');
})

// 
// Unknown
// 
router.use(function(req, res) {
    req.flash('errorCode', "404");
    req.flash('errorText', "Page non trouvée");
    req.flash('errorRedirect', "/app");
    res.redirect("/err");
})

// 
// Export
// 
module.exports = router;