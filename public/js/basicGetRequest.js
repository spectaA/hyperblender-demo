function getRequest(endpoint, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.status, xhr.statusText, 'on GET', endpoint);
                callback(xhr.response)
            } else {
                console.error(xhr.status, xhr.statusText, 'on GET', endpoint);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.status, xhr.statusText, 'on GET', endpoint);
    };
    xhr.send(null);
}