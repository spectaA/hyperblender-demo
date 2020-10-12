async function filterAction(action, body, callback) {

    const xhr = new XMLHttpRequest();
    xhr.open(action, '/api/filterAction', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.status, xhr.statusText, 'on', action, 'filter');
                callback(xhr.response);
            } else {
                console.error(xhr.status, xhr.statusText, 'on', action, 'filter');
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.status, xhr.statusText, 'on', action, 'filter');
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));

}