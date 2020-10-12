module.exports = function filterCheck(event, filters) {
    let ret = true;
    filters.forEach(function (filter) {
        switch (filter.field) {
            case 'title':
                if (event.summary && ( (filter.way == 1 && event.summary.toUpperCase().includes(filter.val.toUpperCase())) || (filter.way == 0 && !event.summary.toUpperCase().includes(filter.val.toUpperCase())) )) ret = false;
                break;
            case 'loc':
                if (event.location && ( (filter.way == 1 && event.location.toUpperCase().includes(filter.val.toUpperCase())) || (filter.way == 0 && !event.location.toUpperCase().includes(filter.val.toUpperCase())) )) ret = false;
                break;
            case 'desc':
                if (event.description && ( (filter.way == 1 && event.description.toUpperCase().includes(filter.val.toUpperCase())) || (filter.way == 0 && !event.description.toUpperCase().includes(filter.val.toUpperCase())) )) ret = false;
                break;
            case 'dow':
                if ((filter.way == 1 && event.start.getDay() == filter.val) || (filter.way == 0 && !(event.start.getDay() == filter.val) )) ret = false;
                break;
            default: break;
        }
    })
    return ret;
}