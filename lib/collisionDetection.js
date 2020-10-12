module.exports = function collisionDetection(cl_cals) {
    let collisions = [];
    let today = new Date()
    let oneweek = new Date();
    oneweek.getDate(oneweek.getDate() + 7);
    // Look for collisions
    cl_cals.forEach(function(cl_cal) {
        // If jcal is visible
        if(cl_cal.visible) {
            // check for all events
            cl_cal.events.forEach(function(event) {
                // Check for all events lower or equals than e
                lt('start', event.start).forEach(function(lower) {
                    if(lower.end > event.start) {
                        if(event.uid != lower.uid) {
                            // Collision found between e.start and lower.end
                            if(!isAlreadyIn(event.start, lower.end)) {
                                if(new Date(event.end) > today) {
                                    collisions.push({
                                        cals: {
                                            ids: [cl_cal.id, lower.calId],
                                            aliases: [cl_cal.alias, lower.calAlias],
                                            colors: [cl_cal.color, lower.calColor]
                                        },
                                        start: event.start,
                                        end: lower.end < event.end ? lower.end : event.end
                                    })
                                }
                            }
                        }
                    }
                })          
            })
        }
    });

    // Sorting
    collisions.sort(function(a, b) {
        if(a.start < b.start) return -1
        else if(a.start > b.start) return 1
        else {
            if(a.end < b.end) return -1
            else if(a.end > b.end) return 1
            else return 0
        } 
    })

    // Return data
    return collisions;

    // Check for collisions duplicate
    function isAlreadyIn(s, e) {
        let i = 0
        collisions.forEach(function(c) {
            if(c.start === s || c.end === e) {
                i++;
            }
        })
        if(i > 0) return true
        else return false
    }

    // All dates lower or equals than date
    function lt(a, b) {
        let ret = []
        cl_cals.forEach(function(jcal) {
            if(jcal.visible) {
                jcal.events.forEach(function(e) {
                    if(e[a] <= b) ret.push({
                        uid: e.uid,
                        start: e.start,
                        end: e.end,
                        calId: jcal.id,
                        calAlias: jcal.alias,
                        calColor: jcal.color
                    });
                })
            }
        })
        return ret;
    }
}