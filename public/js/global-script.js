// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    });
});
// Scroll to anchor in URL
if (location.hash) {
    let anchor;
    location.hash.indexOf("?") == -1 ?
        anchor = location.hash :
        anchor = location.hash.substring(location.hash.indexOf("#"), location.hash.indexOf("?"));
    document.querySelector(anchor).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}
// SHIFT + SPACE detect and redirect to /admin
document.addEventListener("keypress", function(e) {
    if(e.shiftKey && e.altKey && e.charCode === 32) window.location.href = "/admin";
})