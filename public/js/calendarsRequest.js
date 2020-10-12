function calendarsRequest(callback) {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/getCalendars', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.status, xhr.statusText, 'on GET calendars');
                callback(xhr)
            } else {
                console.error(xhr.status, xhr.statusText, 'on GET calendars');
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.status, xhr.statusText, 'on GET calendars');
    };
    xhr.send(null);

}