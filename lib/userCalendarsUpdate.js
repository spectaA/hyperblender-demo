const ical = require('ical');

module.exports = function userCalendarsUpdate(userId) {
    db.query("SELECT * FROM calendars WHERE userId = ?", [userId], function(err, results) {
        console.log(`[Info] ${userId} UPDATING ${results.length} CALENDARS`);
        results.forEach(function(cal) {
            if(cal.url) {
                ical.fromURL(cal.url, {}, function(err, data) {
                    if (err) throw err;
                    if(data) {
                        db.query("UPDATE calendars SET content = ?, lastUpdate = ? WHERE id = ?", 
                        [JSON.stringify(data), new Date(), cal.id]);
                    }
                })
            }
        })
    })
}