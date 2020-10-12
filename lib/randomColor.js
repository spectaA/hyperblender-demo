module.exports = function randomColor() {
    var letters = '0123456789'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        let rdm = Math.ceil(Math.random() * 9);
        color += letters[rdm];
    }
    return color;
}