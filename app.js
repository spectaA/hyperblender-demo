// 
// Requests
// 

const express = require('express');
const session = require('express-session');
const layouts = require('express-ejs-layouts');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const mysqlsession = require('express-mysql-session')(session);
const nodemailer = require("nodemailer");
const os = require('os');

const config = require('./config/config');
const dbcredentials = require('./config/dbcredentials');
const authRoute = require('./routes/authRoute.js');
const appRoute = require('./routes/appRoute.js');
const apiRoute = require('./routes/apiRoute.js');
const errRoute = require('./routes/errRoute.js');
const accRoute = require('./routes/accRoute.js');
const admRoute = require('./routes/admRoute.js');

const isAuthCheck = require('./lib/isAuthCheck.js');
const isntAuthCheck = require('./lib/isntAuthCheck.js');
const Api = require('./lib/Api.js')

// 
// App definitions
// 

const app = express();

app.set('view engine', 'ejs');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set("layout", "layouts/default");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/ressources', express.static('public'));
app.use(layouts);
app.use(cookieParser('thesecretcodeis'));
app.use(flash());
app.disable('x-powered-by');

// MySQL Connection pooling
let connection = mysql.createPool(dbcredentials);
connection.on('error', function(err) {
    if(err.code === "PROTOCOL_CONNECTION_LOST") setTimeout(createSqlConnection, 2000)
    else console.error("Database error:", err);
});

// MySQL Session cookie
const sessionStore  = new mysqlsession({}, connection);
app.use(session({
    key: 'hyperblenderSession',
    secret: 'thesecretcodeis',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// Global variables
global.db = connection;
global.config = config;

// 
// Routes
// 
    // AUTH
app.use('/auth', authRoute);

    // APP
app.use('/app', isAuthCheck, appRoute);

    // API
app.use('/api', isAuthCheck, apiRoute);

    // TOKEN
app.use('/calendar/:token', function(req, res) {
    Api.serveIcal(req, res);
});

    // ACCOUNT
app.use('/acc', accRoute);

    // ERROR
app.use('/err', errRoute);

    // ADMIN
app.use('/admin', isAuthCheck, admRoute);

    // ROOT
app.use('/', isAuthCheck, isntAuthCheck);

// 
// Create server & listening
// 
app.listen(config.PORT, function() {
    console.log(`[${new Date().toLocaleString()}] Starting...\nServer listening on port ${config.PORT}\nFrom ${__filename}\n-----------------`);
})