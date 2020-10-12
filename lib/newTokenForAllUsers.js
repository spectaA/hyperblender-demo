const mysql = require('mysql');
const config = require('./config/config');

// MySQL Connection : hyperblender - thesecretcodeis
let connection = mysql.createConnection(config.DBCONNECTION);
connection.connect(function(err) {
    if (err) throw err;
    else console.log('Database connected')
})
connection.on('error', function(err) {
    console.error('[MySQL Error: ', err)
})

global.db = connection;


// Changer le token de tous les utilisateurs

const genToken = require('generate-password');

db.query("SELECT * FROM users", function(err, results) {
    if (err) throw err;
    results.forEach(function(q) {
        console.log(q.userId);
        db.query("UPDATE users SET token = ? WHERE userId = ?", [genToken.generate(config.TOKEN_PARAMS), q.userId]);
    })
});