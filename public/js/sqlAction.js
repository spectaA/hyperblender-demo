function sqlAction(action, content, callback) {
    let data = {
        action: action,
        content: content
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/sqlAction', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.status, xhr.statusText, 'on SQL', action);
                callback(xhr);
            } else {
                console.error(xhr.status, xhr.statusText, 'on SQL', action);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.status, xhr.statusText, 'on SQL', action);
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}