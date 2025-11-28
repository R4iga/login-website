// Professional Website Controller
class ProfessionalWebsite {
    constructor() {
        this.modal = null;
        this.message = null;
        this.messageTimeout = null;
        this.isLoggedIn = false;
        this.currentUser = null;
    }
    
    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.initializeAnimations();
    }
    
    checkAuthStatus() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.currentUser = localStorage.getItem('username');
        
        if (this.isLoggedIn && this.currentUser) {
            // Redirect to dashboard if already logged in
            window.location.href = 'dashboard.html';
        }
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
        
        // Form submissions
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }
    
    setupSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    initializeAnimations() {
        // Add entrance animations to elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    showLoginModal() {
        this.modal = document.getElementById('login-modal');
        if (this.modal) {
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus on username input after a short delay
            setTimeout(() => {
                const usernameInput = document.getElementById('username');
                if (usernameInput) {
                    usernameInput.focus();
                }
            }, 300);
        }
    }
    
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
            this.modal = null;
        }
    }
    
    showMessage(text, type = 'info', duration = 3000) {
        this.clearMessage();
        
        this.message = document.createElement('div');
        this.message.className = `message message-${type}`;
        this.message.innerHTML = `
            <div class="message-content">
                <div class="message-icon">
                    <i class="fas fa-${this.getMessageIcon(type)}"></i>
                </div>
                <div class="message-text">${text}</div>
                <button class="message-close" onclick="this.clearMessage()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(this.message);
        
        // Auto remove
        this.messageTimeout = setTimeout(() => {
            this.clearMessage();
        }, duration);
    }
    
    clearMessage() {
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }
        
        if (this.message) {
            this.message.classList.add('fade-out');
            setTimeout(() => {
                if (this.message.parentNode) {
                    this.message.parentNode.removeChild(this.message);
                }
                this.message = null;
            }, 300);
        }
    }
    
    getMessageIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validation
        if (!username || !password) {
            this.showMessage('Please enter both username and password', 'error');
            return;
        }
        
        if (username.length < 3) {
            this.showMessage('Username must be at least 3 characters', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }
        
        // Simulate authentication (in real app, this would be an API call)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user exists
        const existingUser = users.find(u => u.username === username);
        
        if (existingUser && existingUser.password === password) {
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
    
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('rememberMe');
        this.showMessage('Logging out...', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Initialize website
document.addEventListener('DOMContentLoaded', function() {
    window.professionalWebsite = new ProfessionalWebsite();
    window.professionalWebsite.init();
    
    // Make functions globally available
    window.showLoginModal = () => window.professionalWebsite.showLoginModal();
    window.closeModal = () => window.professionalWebsite.closeModal();
    window.showMessage = (text, type, duration) => window.professionalWebsite.showMessage(text, type, duration);
    window.scrollToSection = (sectionId) => window.professionalWebsite.scrollToSection(sectionId);
    window.logout = () => window.professionalWebsite.logout();
});