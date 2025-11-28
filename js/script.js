document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultUsers();
    
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.classList.add('show');
            
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
        }
    });
});

function initializeDefaultUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.length === 0) {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'admin',
                email: 'admin@example.com',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}