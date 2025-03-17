const cancelButton = document.getElementById('cancelButton');
const banner = document.getElementById('banner');

function showBanner() {
    banner.style.visibility = 'visible';
}

function hideBanner() {
    banner.style.visibility = 'hidden';
}

cancelButton.addEventListener('click', hideBanner);

showBanner();