// Clean, Simple, and Reliable JavaScript
class CleanWebsite {
    constructor() {
        this.modal = null;
        this.message = null;
        this.messageTimeout = null;
    }
    
    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
    }
    
    setupEventListeners() {
        // Smooth scroll navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (this.modal && !this.modal.contains(e.target) && !e.target.closest('.modal-content')) {
                this.closeModal();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal) {
                this.closeModal();
            }
        });
    }
    
    setupSmoothScrolling() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    showLoginModal() {
        this.modal = document.getElementById('login-modal');
        if (this.modal) {
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus on username input
            setTimeout(() => {
                const usernameInput = document.getElementById('username');
                if (usernameInput) {
                    usernameInput.focus();
                }
            }, 100);
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
            this.modal = null;
        }
    }
    
    showMessage(text, type = 'success') {
        // Clear any existing message
        this.clearMessage();
        
        // Create new message
        this.message = document.createElement('div');
        this.message.className = `message ${type}`;
        this.message.textContent = text;
        
        // Add to page
        document.body.appendChild(this.message);
        
        // Auto remove after 3 seconds
        this.messageTimeout = setTimeout(() => {
            this.clearMessage();
        }, 3000);
    }
    
    clearMessage() {
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }
        
        if (this.message) {
            this.message.remove();
            this.message = null;
        }
    }
    
    handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Basic validation
        if (!username || !password) {
            this.showMessage('Please enter both username and password', 'error');
            return;
        }
        
        // Simulate login (in real app, this would be an API call)
        if (username === 'admin' && password === 'admin') {
            // Success - store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            this.showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            this.showMessage('Invalid username or password', 'error');
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    window.cleanWebsite = new CleanWebsite();
    window.cleanWebsite.init();
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (isLoggedIn === 'true' && username) {
        // User is logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});