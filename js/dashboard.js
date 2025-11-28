document.addEventListener('DOMContentLoaded', function() {
    setupPage();
    
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = localStorage.getItem('username');
    }
});