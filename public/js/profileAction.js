function profileAction(data, callback, error) {

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', '/api/profileAction', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.status, xhr.statusText, 'on PUT profile');
                callback(JSON.parse(xhr.response));
            } else {
                console.error(xhr.status, xhr.statusText, 'on PUT profile');
                error(xhr.responseText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.status, xhr.statusText, 'on PUT profile');
        error(xhr.responseText);
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}