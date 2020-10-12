function profileRequest(callback) {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/profileRequest', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.status, xhr.statusText, 'on GET profile');
                callback(JSON.parse(xhr.response));
            } else {
                console.error(xhr.status, xhr.statusText, 'on GET profile');
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.status, xhr.statusText, 'on GET profile');
    };
    xhr.send(null);
}