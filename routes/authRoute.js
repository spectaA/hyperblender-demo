const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const genToken = require('generate-password');
const nodemailer = require("nodemailer");
const ejs = require('ejs');

const Validation = require('../lib/Validation.js');

const isntAuthCheck = require('../lib/isntAuthCheck.js');
const userCalendarsUpdate = require('../lib/userCalendarsUpdate');

// 
// Root
// 
router.get('/', function(req, res) {
    res.redirect('/auth/login');
})

// 
// REGISTER
// 
router.get('/register', isntAuthCheck, function (req, res) {
    res.render('pages/register', {
        pageTitle: 'inscription',
        alertDanger: req.flash('alertDanger'),
        layout: 'layouts/connection'
    });
})

router.post('/register', function (req, res) {
    let rb = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [rb.email], function (err, results) {
        if(results.length != 0) {
            req.flash('alertDanger', "email dejà utilisée");
            res.redirect('/auth/register');
        }
        else {
            let confirmed = {};
            Validation.email(rb.email, emailValidated);
            function emailValidated(emailVal, email)  {
                if (!emailVal) {
                    req.flash('alertDanger', email);
                    res.redirect('/auth/register');
                } else {
                    confirmed.email = email;
                    Validation.name(rb.name, nameValidated);
                }
            }
            function nameValidated(nameVal, name) {
                if (!nameVal) {
                    req.flash('alertDanger', name);
                    res.redirect('/auth/register');
                } else {
                    confirmed.name = name;
                    Validation.password(rb.password1, rb.password2, passwordValidated);
                }
            }
            function passwordValidated(passwordVal, hash) {
                if (!passwordVal) {
                    req.flash('alertDanger', hash);
                    res.redirect('/auth/register');
                } else {
                    confirmed.hash = hash;
                    allFieldsValidated();
                }
            }
            function allFieldsValidated() {
                // Add adress to DB
                db.query("INSERT INTO users (name, email, password, token, status) VALUES (?, ?, ?, ?, ?)",
                [confirmed.name, confirmed.email, confirmed.hash, genToken.generate(config.TOKEN_PARAMS), rb.status], function (err, insertResult) {
                    if (err) throw err;
                    console.log(`[Info] NEW USER (${rb.name} <${rb.email}>)`);
                    db.query("SELECT * FROM users WHERE userId = ?", [insertResult.insertId], function(err, selectResult) {
                        if (err) throw err;
                        selectResult = selectResult[0];
                        // Send mail to the adress
                        let contentOptions = {
                            username: selectResult.name,
                            usermail: selectResult.email,
                            registerDate: new Date(selectResult.registration).toLocaleString(),
                            validationLink: "https://hyperblender.be/acc/verif/" + selectResult.token,
                            cancelLink: "https://hyperblender.be/acc/unreg/" + selectResult.token
                        };
                        ejs.renderFile('./emails/welcome.ejs', contentOptions, function(err, renderedMail) {
                            if (err) throw err;
                            let mailOptions = {
                                from: '"hyperblender" <noreply@hyperblender.be>', // sender address
                                to: selectResult.email, // list of receivers
                                bcc: "loggingsentmail@hyperblender.be",
                                subject: "📅 hyperblender - inscription", // Subject line
                                text: renderedMail,
                                html: renderedMail
                            };
                            nodemailer.createTransport(config.NODEMAILER_TRANSPORTER_PARAMS).sendMail(mailOptions, function(err, info) {
                                if (err) {
                                    req.flash('alertDanger', 'erreur lors de l\'envoi du mail à votre adresse');
                                    console.log('[Error] Email sending error :', err);
                                }
                            });
                        })
                        // Res send
                        req.flash('alertSuccess', 'Votre compte a bien été créé. Vous pouvez maintenant vous connecter');
                        res.redirect('/auth/login');
                    })
                })
            }
        }
    })
})

// 
// LOGIN
// 
router.get('/login', isntAuthCheck, function (req, res) {
    res.render('pages/login', {
        pageTitle: 'connexion',
        alertDanger: req.flash('alertDanger'),
        alertSuccess: req.flash('alertSuccess'),
        layout: 'layouts/connection'
    })
})

router.post('/login', function (req, res) {
    let r = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [r.email], function (err, results) {
        if (err) throw err;
        let qresult = results[0];
        if (results.length > 0) {
            // Password comparaison
            bcrypt.compare(r.password, qresult.password, function(err, same) {
                if (err) throw err;
                // If password is ok
                if(same) {
                    db.query("UPDATE users SET lastConnection = ?, connectionCount = connectionCount + 1 WHERE userId = ?", [new Date(), qresult.userId]);
                    console.log(`[INFO] ${qresult.userId} CONNECTION (${qresult.name} <${qresult.email}>)`);
                    // Set session
                    for (let k in qresult) req.session[k] = qresult[k];
                    // Update calendars if last connexion > config.DELAY_BETWEEN_CALS_UPDATE
                    let lastConnDelay = Math.round(((new Date().getTime() - new Date(qresult.lastConnection).getTime())/1000)/60);
                    if(lastConnDelay > config.DELAY_BETWEEN_CALS_UPDATE) userCalendarsUpdate(qresult.userId);
                    // Redirect to tutorial for the first connection
                    if(qresult.connectionCount == 0) res.redirect('/app/tutorial');
                    else res.redirect('/app');
                } else {
                    req.flash('alertDanger', 'mauvais mot de passe');
                    res.redirect('/auth/login');
                }
            })
        } else {
            req.flash('alertDanger', 'cet utilisateur n\'existe pas');
            res.redirect('/auth/login');
        }
    })
})

// 
// LOGOUT
// 
router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/auth');
    })
})

// 
// EXPORT
// 
router.use(function(req, res) {
    req.flash('errorCode', "404");
    req.flash('errorText', "Page non trouvée");
    req.flash('errorRedirect', "/auth");
    res.redirect("/err");
})

module.exports = router;