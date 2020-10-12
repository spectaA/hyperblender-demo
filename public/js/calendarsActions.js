async function calendarsActions(body, callback) {

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/actionsCalendar', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.status, xhr.statusText, 'on', body.type, 'calendars');
                callback()
            } else {
                console.error(xhr.status, xhr.statusText, 'on', body.type, 'calendars');
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.status, xhr.statusText, 'on', body.type, 'calendars');
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));

}