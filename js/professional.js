// Professional Website Controller - FIXED VERSION
class ProfessionalWebsite {
    constructor() {
        this.modal = null;
        this.message = null;
        this.messageTimeout = null;
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Professional Website');
        this.checkAuthStatus();
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.initializeAnimations();
    }
    
    checkAuthStatus() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.currentUser = localStorage.getItem('username');
        
        console.log('📝 Auth Status:', {
            isLoggedIn: this.isLoggedIn,
            currentUser: this.currentUser
        });
        
        if (this.isLoggedIn && this.currentUser) {
            console.log('✅ User is logged in, redirecting to dashboard');
            window.location.href = 'dashboard.html';
        }
    }
    
    setupEventListeners() {
        console.log('🔧 Setting up event listeners');
        
        // Smooth scroll navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            console.log('📎 Adding scroll listener to:', anchor.getAttribute('href'));
            anchor.addEventListener('click', (e) => {
                console.log('🖱️ Navigation link clicked:', anchor.getAttribute('href'));
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    console.log('📍 Scrolling to section:', anchor.getAttribute('href'));
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (this.modal && !this.modal.contains(e.target) && !e.target.closest('.modal-content')) {
                console.log('❌ Closing modal - outside click');
                this.closeModal();
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal) {
                console.log('⌨️ Closing modal - escape key');
                this.closeModal();
            }
        });
        
        // Form submissions
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('📝 Adding login form listener');
            loginForm.addEventListener('submit', (e) => {
                console.log('🚀 Login form submitted');
                this.handleLogin(e);
            });
        }
        
        // Button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                console.log('🖱️ Button clicked:', e.target.textContent);
                this.handleButtonClick(e.target);
            }
        });
    }
    
    setupSmoothScrolling() {
        console.log('🌊 Setting up smooth scrolling');
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    initializeAnimations() {
        console.log('✨ Initializing animations');
        // Add entrance animations to sections
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('🎬 Element visible:', entry.target);
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    handleLogin(event) {
        event.preventDefault();
        console.log('🔐 Processing login');
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        console.log('📝 Login attempt:', { username, password, remember });
        
        // Validation
        if (!username || !password) {
            console.log('❌ Validation failed: missing credentials');
            this.showMessage('Please enter both username and password', 'error');
            return;
        }
        
        if (username.length < 3) {
            console.log('❌ Validation failed: username too short');
            this.showMessage('Username must be at least 3 characters', 'error');
            return;
        }
        
        if (password.length < 6) {
            console.log('❌ Validation failed: password too short');
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }
        
        // Simulate authentication (in real app, this would be an API call)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            console.log('✅ Authentication successful');
            
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            this.showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            console.log('❌ Authentication failed: invalid credentials');
            this.showMessage('Invalid username or password', 'error');
        }
    }
    
    handleButtonClick(button) {
        console.log('🖱️ Button clicked:', button.textContent);
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }
    
    showMessage(text, type = 'info', duration = 3000) {
        console.log('💬 Showing message:', { text, type });
        
        // Clear any existing message
        this.clearMessage();
        
        // Create new message
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
        
        // Add to page
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
    
    showLoginModal() {
        console.log('🔐 Showing login modal');
        
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
            }, 100);
        }
    }
    
    closeModal() {
        console.log('❌ Closing modal');
        
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
            this.modal = null;
        }
    }
    
    scrollToSection(sectionId) {
        console.log('📍 Scrolling to section:', sectionId);
        
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    logout() {
        console.log('🚪 Logging out');
        
        // Clear auth state
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('loginTime');
        
        this.showMessage('Logging out...', 'info');
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Initialize website
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Professional Website Loading');
    window.professionalWebsite = new ProfessionalWebsite();
    window.professionalWebsite.init();
    
    // Make functions globally available
    window.showLoginModal = () => window.professionalWebsite.showLoginModal();
    window.closeModal = () => window.professionalWebsite.closeModal();
    window.showMessage = (text, type, duration) => window.professionalWebsite.showMessage(text, type, duration);
    window.scrollToSection = (sectionId) => window.professionalWebsite.scrollToSection(sectionId);
    window.logout = () => window.professionalWebsite.logout();
});