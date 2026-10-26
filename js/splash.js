const hideSplash = () => {
    const splash = document.getElementById('splash-screen');
    if (splash && splash.style.display !== 'none') {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
        }, 300);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideSplash, 400);
});
window.addEventListener('load', hideSplash);
setTimeout(hideSplash, 1000);

