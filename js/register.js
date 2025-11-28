document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('reg-error-message');
    const successMessage = document.getElementById('reg-success-message');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const email = document.getElementById('reg-email').value;
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(user => user.username === username)) {
            errorMessage.textContent = 'Username already exists';
            errorMessage.classList.add('show');
            successMessage.classList.remove('show');
            
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
            return;
        }
        
        if (users.some(user => user.email === email)) {
            errorMessage.textContent = 'Email already registered';
            errorMessage.classList.add('show');
            successMessage.classList.remove('show');
            
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
            return;
        }
        
        const newUser = {
            id: Date.now(),
            username: username,
            password: password,
            email: email,
            createdAt: new Date().toISOString(),
            role: 'user'
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        successMessage.textContent = 'Registration successful! Redirecting to login...';
        successMessage.classList.add('show');
        errorMessage.classList.remove('show');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
});