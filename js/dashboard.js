document.addEventListener('DOMContentLoaded', function() {
    setupPage();
    
    const userName = document.getElementById('user-name');
    const lastLoginDisplay = document.getElementById('last-login-display');
    const userRoleDisplay = document.getElementById('user-role-display');
    const unreadCount = document.getElementById('unread-count');
    
    if (userName) {
        userName.textContent = localStorage.getItem('username');
    }
    
    // Load user stats
    loadUserStats(lastLoginDisplay, userRoleDisplay, unreadCount);
});

function loadUserStats(lastLoginEl, roleEl, unreadEl) {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        // Last login
        const lastLogin = localStorage.getItem('lastLogin_' + user.id);
        if (lastLoginEl && lastLogin) {
            lastLoginEl.textContent = new Date(lastLogin).toLocaleString();
        }
        
        // User role
        if (roleEl) {
            roleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
            if (user.role === 'admin') {
                roleEl.className = 'badge badge-error';
            } else {
                roleEl.className = 'badge badge-primary';
            }
        }
        
        // Unread messages (mock data for demo)
        if (unreadEl) {
            const unreadCount = Math.floor(Math.random() * 5);
            unreadEl.textContent = unreadCount > 0 ? `${unreadCount} New` : '0';
            if (unreadCount > 0) {
                unreadEl.className = 'badge badge-error animate-pulse';
            } else {
                unreadEl.className = 'badge badge-success';
            }
        }
    }
}