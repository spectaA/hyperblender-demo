const fs = require('fs');
const path = require('path');
const ical = require('ical');
const icalGen = require('ical-generator');
const genToken = require('generate-password');

const randomColor = require("./randomColor.js");
const urlify = require("./urlify.js");
const getCalendars = require("./getCalendars.js");
const emailModified = require("../emails/emailModifiedSender.js");

const Validation = require('./Validation.js');

// 
// POST URL
// 
module.exports.postURL = function(req, res) {
    let userId = req.session.userId;
    let rb = req.body;
    if(rb.alias.length > config.MAX_CAL_ALIAS_LENGTH) {
        req.flash("alertDanger", "l'alias ne peut pas dépasser 60 caractères");
        res.redirect(req.headers.referer);
    } else {
        ical.fromURL(rb.url, {}, function (err, data) {
            if (err) throw err;
            if (data) {
                db.query("INSERT INTO calendars (userId, url, content, alias, color) VALUES (?, ?, ?, ?, ?)",
                [userId, rb.url, JSON.stringify(data), rb.alias, randomColor()],
                function (err, result) {
                    if (err) throw err;
                    req.flash('alertSuccess', 'le calendrier à bien été téléchargé.');
                    res.redirect(req.headers.referer);
                })
            } else {
                req.flash('alertDanger', 'vous avez saisi une URL invalide, celle-ci ne correspond pas à un agenda')
                res.redirect(req.headers.referer);
            }
        })
    }
}

// 
// POST FILE
// 
module.exports.postFile = function(req, res) {
    let userId = req.session.userId;
    let rf = req.file;
    let rb = req.body;
    if(rb.alias.length > config.MAX_CAL_ALIAS_LENGTH) {
        req.flash("alertDanger", "l'alias ne peut pas dépasser 60 caractères");
        res.redirect(req.headers.referer);
    } else {
        // Read temp file
        let data = fs.readFileSync('uploads/' + rf.filename, 'utf8');
        // Parse data
        data = JSON.stringify(ical.parseICS(data));
        // Check for no-ics files and too big files
        if(data == '{}') {
            req.flash('alertDanger', 'le fichier est vide ou n\'est pas un calendrier');
            res.redirect(req.headers.referer);
        } else if(data.length > config.MAX_FILE_LENGTH_BYTES) { /* value for local : 1048576    Best value for mediumtext : 16777215 */
            req.flash('alertDanger', `fichier trop volumineux (max ${config.MAX_FILE_LENGTH_BYTES} caractères`);
            res.redirect(req.headers.referer);
        } else {
            // Correct file : DB insertion
            db.query("INSERT INTO calendars (userId, url, content, alias, color) VALUES (?, ?, ?, ?, ?)",
            [userId, rb.url, data, rb.alias, randomColor()],
            function (err, result) {
                if (err) throw err;
                req.flash('alertSuccess', 'le calendrier à bien été importé.');
                res.redirect(req.headers.referer);
            })
        }
        // Delete temp file
        fs.unlinkSync('uploads/' + rf.filename);
    }
}

// 
// ACTION ON CALENDAR
// 
module.exports.actionsCalendar = function(req, res) {
    let userId = req.session.userId;
    let b = req.body;
    let actions = {
        delete: { sql: "DELETE FROM calendars WHERE userId = ? AND id = ?", values: [userId, b.id] },
        edit: { sql: "UPDATE calendars SET alias = ? WHERE userId = ? AND id = ?", values: [b.alias, userId, b.id] },
        hide: { sql: "UPDATE calendars SET visible = 0 WHERE userId = ? AND id = ?", values: [userId, b.id] },
        show: { sql: "UPDATE calendars SET visible = 1 WHERE userId = ? AND id = ?", values: [userId, b.id] }
    }
    // Check errors / cheats
    if(b.type == 'edit') {
        if(b.alias.length > config.MAX_CAL_ALIAS_LENGTH) {
            res.sendStatus(400);
            return 0;
        };
    }
    if(actions.hasOwnProperty(b.type)) dbAction(actions[b.type])
    else {
        res.sendStatus(400);
        return 0;
    };
    // Database action
    function dbAction(action) {
        db.query(action.sql, action.values, function(err, results) {
            if (err) throw err;
            if (results.affectedRows == 1) res.sendStatus(200)
            else res.sendStatus(500);
        });
    }
}

// 
// NEW FILTER
// 
module.exports.newFilter = function(req, res) {
    let userId = req.session.userId;
    let b = req.body;
    // Possibilities
    let possib = {
        field: ["title", "loc", "desc", "dow", "start", "end"],
        way: ["0", "1"]
    }
    // Check errors / cheats
    if(possib.field.includes(b.field) && possib.way.includes(b.way) && b.val.length <= config.MAX_FILTER_VAL_LENGTH) {
        db.query("SELECT * FROM calendars WHERE userId = ? AND id = ?", [userId, b.calId], function(err, results) {
            if (err) throw err;
            if(results.length > 0) {
                db.query("INSERT INTO filters (calId, field, val, way) VALUES (?, ?, ?, ?)",
                [b.calId, b.field, b.val, b.way], 
                function(err, results) {
                    if (err) throw err;
                    res.json(results.insertId);
                })
            } else res.sendStatus(400);
        })
    } else res.sendStatus(400);
}

// 
// DELETE FILTER
// 
module.exports.deleteFilter = function(req, res) {
    let userId = req.session.userId;
    let b = req.body;
    db.query("DELETE FROM filters WHERE id = ? AND calId = ? AND calId IN (SELECT id FROM calendars WHERE userId = ?)",
    [b.id, b.calId, userId],
    function(err, results) {
        if (err) throw err;
        if(results.affectedRows < 1) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    })
}

// 
// GET TOKEN INFO
// 
module.exports.getTokenInfos = function(req, res) {
    let userId = req.session.userId;
    db.query("SELECT emailVerified, token FROM users WHERE userId = ?", [userId], function(err, results) {
        if(results.length > 0 && results[0].emailVerified == 1) {
            res.json({
                token: results[0].token,
                subLink: `${req.protocol}://${req.get('host')}/calendar/${results[0].token}`
            })
        } else {
            res.json({
                err: 'vous n\'avez pas encore validé votre email'
            })
        }
    })
}

// 
// SERVE ICAL
// 
module.exports.serveIcal = function(req, res) {
    let token = req.params.token;
    let userAgent = req.headers["user-agent"];
    db.query("SELECT userId, name, emailVerified FROM users WHERE token = ?", [token], function(err, results) {
        if (err) throw err;
        if(results.length == 1) {
            if(results[0].emailVerified == 1) {
                let userId = results[0].userId;
                let name = results[0].name;
                console.log(`[INFO] TOKEN OWNED BY USER ${userId} USED WITH  ${userAgent}`);
                getCalendars(userId, function(data) {
                    // Generate cal
                    let cal = icalGen();
                    cal.domain("thedomain");
                    cal.prodId({
                        company: 'HyperBlender',
                        product: 'Agenda by Mathias BLT',
                        language: 'FR'
                    });
                    cal.name(`Agenda de ${name}`);
                    cal.scale('gregorian');
                    cal.ttl(config.CAL_TTL_SECONDS);
    
                    let serveEvents = [];
                    data.calendars.forEach(function(cal) {
                        if(cal.visible) {
                            cal.events.forEach(function(event) {
                                delete event.categories;
                                serveEvents.push(event);
                            })
                        }
                    })
                    cal.events(serveEvents);
    
                    cal.serve(res, 'HyperBlender-Agenda.ics');
                })
            } else {
                res.sendStatus(403);
            }
        } else {
            console.log(`[WARN] BAD TOKEN  ${token}  USER FROM  ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}  WITH  ${userAgent}`);
            res.sendStatus(404);
        }
    })
}

// 
// PROFILE REQUEST
// 
module.exports.profileRequest = function(req, res) {
    let userId = req.session.userId;
    db.query("SELECT name, email, status FROM users WHERE userId = ?;", [userId], function(err, results) {
        if (err) throw err;
        res.json(results[0]);
    })
}

// 
// PROFILE ACTION
// 
module.exports.profileAction = function(req, res) {
    let userId = req.session.userId;
    let rb = req.body;
    let confirmed = {};
    Validation.email(rb.email, emailValidated);
    function emailValidated(emailVal, email) {
        if (!emailVal) res.status(401).send({field: "email", error: email});
        else {
            confirmed.email = email;
            Validation.name(rb.name, nameValidated);
        }
    }
    function nameValidated(nameVal, name) {
        if (!nameVal) res.status(401).send({field: "name", error: name});
        else {
            confirmed.name = name;
            if (rb.password1 != "") {
                Validation.password(rb.password1, rb.password2, passwordValidated);
            } else {
                allFieldsValidated();
            }
        }
    }
    function passwordValidated(passwordVal, hash) {
        if (!passwordVal) res.status(401).send({field: "password", error: hash});
        else {
            confirmed.hash = hash;
            allFieldsValidated();
        }
    }
    function allFieldsValidated() {
        if (confirmed.hash) {
            // For any change : emailValidated = 0 and new token
            // With password
            db.query("UPDATE users SET name = ?, email = ?, emailVerified = ?, token = ?, password = ?, status = ? WHERE userId = ?", [confirmed.name, confirmed.email, 0, genToken.generate(config.TOKEN_PARAMS), confirmed.hash, rb.status, userId], function (err, results) {
                if (err) throw err;
                responseProfile();
            })
        } else {
            // Without password
            db.query("UPDATE users SET name = ?, email = ?, emailVerified = ?, token = ?, status = ? WHERE userId = ?", [confirmed.name, confirmed.email, 0, genToken.generate(config.TOKEN_PARAMS), rb.status, userId], function (err, results) {
                if (err) throw err;
                responseProfile();
            })
        }
    }
    function responseProfile() {
        db.query("SELECT name, email, status, token FROM users WHERE userId = ?;", [userId], function (err, results) {
            if (err) throw err;
            emailModified(userId);
            if(!req.session.emailValidated) {
                delete results[0].token
            }
            res.json(results[0]);
        });
    }
}

// 
// SQL REQUEST
// 
module.exports.sqlAction = function(req, res) {
    let userId = req.session.userId;
    let rb = req.body;
    switch(rb.action) {
        case "request" :
            db.query(rb.content, function(err, results) {
                res.json({
                    error: err,
                    results: results
                });
            });
            break;
        case "getCommands" :
            db.query("SELECT id,command,alias FROM sqlcommands WHERE userId = ?", [userId], function(err, results) {
                if (err) throw err;
                res.json(results);
            })
            break;
        case "add" : 
            db.query("INSERT INTO sqlcommands (userId, command, alias) VALUES (?, ?, ?);", [userId, rb.content.command, rb.content.alias], function(err, results) {
                if (err) throw err;
                if (results.insertId) res.sendStatus(200);
                else res.send(500);
            })
            break;
        case "remove" :
            db.query("DELETE FROM sqlcommands WHERE id = ?", [rb.content.id], function(err, results) {
                if (err) throw err;
                if (results.affectedRows == 1) res.sendStatus(200);
                else res.sendStatus(500);
            })
            break;
        default : res.sendStatus(400);
    }
}

// 
// SQLCOMMAND ACTION
// 
module.exports.sqlCommandAction = function(req, res) {
    let userId = req.session.userId;
    let rb = req.body;
    if(rb.command) {
        db.query("INSERT INTO sqlcommands (userId, command) VALUES (?, ?);", [userId, rb.command], function(err, results) {
            if (err) throw err;
            if (results.insertId) {
                after();
            }
        })
    } else after();
    function after() {
        db.query("SELECT * FROM sqlcommands WHERE userId = ?", [userId], function(err, results) {
            if (err) throw err;
            console.log(results);
            res.json(results);
        })
    }
}

// 
// LOGSLIST
// 
module.exports.logsList = function(req, res) {
    fs.readdir("./logs", {withFileTypes:true}, function(err, files) {
        if (err) throw err;
        files.sort(function(a,b) {
            if(a.name < b.name) return 1
            if(a.name > b.name) return -1
            if(a.name === b.name) return 0
        })
        let names = [];
        files.forEach(function(f) {
            if(f.isFile() && path.extname(f.name) === '.log') {
                names.push({
                    fileName: f.name,
                    link: req.protocol + '://' + req.get('host') + '/admin/logs/' + f.name
                });
            }
        })
        res.send(names);
    })
}

// 
// LOGFILE
// 
module.exports.logFile = function(req, res) {
    let f = req.params.file;
    if(path.extname(f) === '.log') {
        fs.readFile('./logs/' + f, 'utf8', function(err, data) {
            if(err) res.send('File doesn\'t exists');
            else res.send(data);
        })
    } else {
        res.send('Incorrect file name');
    }
}