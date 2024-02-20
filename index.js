// header
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.nav_links li a').forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
});