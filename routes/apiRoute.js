const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const Api = require('../lib/Api.js');
const getCalendars = require('../lib/getCalendars.js');
const isAdminCheck = require('../lib/isAdminCheck.js');

// 
// API
// 

        // postCalURL
router.post('/postCalURL', function(req, res) {
    Api.postURL(req, res)
})

        // postCalFile
router.post('/postCalFile', upload.single('calFile'), function(req, res) {
    Api.postFile(req, res)
})

        // getCalendars
router.get('/getCalendars', function(req, res) {
    getCalendars(req.session.userId, function(data) {
        res.json(data);
    });
})

        // actionsCalendar
router.post('/actionsCalendar', function(req, res) {
    Api.actionsCalendar(req, res)
})

        // newfilter
router.put('/filterAction', function(req, res) {
    Api.newFilter(req, res);
})

        // deleteFilter
router.delete('/filterAction', function(req, res) {
    Api.deleteFilter(req, res);
})

        // getTokenInfos
router.get('/getTokenInfos', function(req, res) {
    Api.getTokenInfos(req, res);
})

        // profileRequest
router.get('/profileRequest', function(req, res) {
    Api.profileRequest(req, res);
})

        // profileRequest
router.put('/profileAction',function(req, res) {
    Api.profileAction(req, res);
})

        // SQL Request
router.use('/sqlAction', isAdminCheck, function(req, res) {
    Api.sqlAction(req, res);
})

        // logsList
router.use('/logsList', isAdminCheck, function(req, res) {
    Api.logsList(req, res);
})

        // logFile
router.use('/logFile/:file', isAdminCheck, function(req, res) {
    Api.logFile(req, res);
})

        // Default
router.use(function(req, res) {
    res.sendStatus(404);
})

// 
// Export
// 

module.exports = router;