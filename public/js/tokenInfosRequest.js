function tokenInfosRequest(callback) {

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/getTokenInfos', true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.status, xhr.statusText, 'on getTokenInfos');
                callback(JSON.parse(xhr.response));
            } else {
                console.error(xhr.status, xhr.statusText, 'on getTokenInfos');
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.status, xhr.statusText, 'on getTokenInfos');
    };
    xhr.send(null);

}