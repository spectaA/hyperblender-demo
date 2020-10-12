const express = require('express');
const router = express.Router();

// 
// CONFIRM REGISTER
// 
router.get("/verif/:token", function(req, res) {
    let token = req.params.token;
    db.query("SELECT emailVerified, email FROM users WHERE token = ?", [token], function(err, results) {
        if (err) throw err;
        if(results.length == 1) {
            let r = results[0];
            if(r.emailVerified == 0) {
                db.query("UPDATE users SET emailVerified = 1 WHERE token = ?", [token], function(err, result) {
                    if (err) throw err;
                    console.log(`[INFO] EMAIL VERIFIED <${r.email}>`);
                    res.render('pages/verifRegister', {
                        layout: 'layouts/unlogged',
                        usermail: r.email,
                        alertDanger: req.flash('alertDanger'),
                        alertSuccess: req.flash('alertSuccess'),
                        alertInfo: req.flash('alertInfo')
                    })
                })
            } else {
                req.flash('errorCode', "403");
                req.flash('errorText', `votre adresse email ${results[0].email} est déjà validée`);
                req.flash('errorRedirect', "/auth");
                res.redirect("/err");
            }
        } else {
            req.flash('errorCode', "403");
            req.flash('errorText', "lien invalide");
            req.flash('errorRedirect', "/auth");
            res.redirect("/err");
        }
    })
})

// 
// UNREGISTER
// 
router.get('/unreg/:token', function(req, res) {
    let token = req.params.token;
    db.query("SELECT email FROM users WHERE token = ?", [token], function(err, results) {
        if (err) throw err;
        if (results.length > 0) {
            res.render('pages/unsubscribe', {
                layout: 'layouts/unlogged',
                usermail: results[0].email,
                usertoken: token,
                alertDanger: req.flash('alertDanger'),
                alertSuccess: req.flash('alertSuccess'),
                alertInfo: req.flash('alertInfo')
            })
        } else {
            req.flash('errorCode', "403");
            req.flash('errorText', "lien invalide");
            req.flash('errorRedirect', "/auth");
            res.redirect("/err");
        }
    })
});

// 
// UNREGISTER
// 
router.get('/unregConf/:token', function(req, res) {
    let token = req.params.token;
    db.query("SELECT email FROM users WHERE token = ?", [token], function(err, results) {
        if (err) throw err;
        if (results.length > 0) {
            db.query("DELETE FROM users WHERE token = ?", [token], function(err, result) {
                if (err) throw err;
                console.log(`[INFO] COMPTE SUPPRIMÉ <${results[0].email}>`);
                req.flash('errorCode', "200");
                req.flash('errorText', "compte supprimé");
                req.flash('errorRedirect', "/auth");
                res.redirect("/err");
            })
        } else {
            req.flash('errorCode', "403");
            req.flash('errorText', "lien invalide");
            req.flash('errorRedirect', "/auth");
            res.redirect("/err");
        }
    })
})

// 
// Export
// 
module.exports = router;