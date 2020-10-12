const collisionDetection = require("./collisionDetection.js");
const filterCheck = require("./filterCheck.js");

module.exports = function getCalendars(userId, callback) {
    db.query(`SELECT id, alias, color, visible, lastUpdate, content FROM calendars WHERE userId = ${userId};` +
             `SELECT id, calId, field, val, way FROM filters WHERE calId IN (SELECT id FROM calendars WHERE userId = ${userId});`, 
             function(err, queryRes) {
        if(err) throw err;
        let cl_cals = [];
        // Calendars
        queryRes[0].forEach(function(db_cal) {
            db_cal.content = JSON.parse(db_cal.content);
            if(!db_cal.alias && 'WR-CALNAME' in db_cal.content) db_cal.alias = (db_cal.content["WR-CALNAME"].val || db_cal.content["WR-CALNAME"]);
            if('WR-CALDESC' in db_cal.content) db_cal.desc = (db_cal.content['WR-CALDESC'].val || db_cal.content['WR-CALDESC']);
            // Filters
            db_cal.filters = [];
            queryRes[1].forEach(function(filter) {
                if(filter.calId == db_cal.id) {
                    db_cal.filters.push(filter);
                    delete filter.calId;
                }
            })
            // Events
            db_cal.events = [];
            for(let property in db_cal.content) {
                let item = db_cal.content[property];
                if(db_cal.content.hasOwnProperty(property) && item.type == 'VEVENT') {
                    if(typeof item.summary == 'object') item.summary = item.summary.val;
                    if(typeof item.location == 'object') item.location = item.location.val;
                    if(typeof item.description == 'object') item.description = item.description.val;
                    delete item.type;
                    if(filterCheck(item, db_cal.filters)) db_cal.events.push(item);
                }
            }
            // cl_cals pushing
            delete db_cal.content;
            cl_cals.push(db_cal);
        })
        callback({
            calendars: cl_cals,
            collisions: collisionDetection(cl_cals)
        });
    })
}