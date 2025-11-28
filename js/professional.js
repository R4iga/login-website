// Professional Website Controller
class ProfessionalWebsite {
    constructor() {
        this.isLoading = true;
        this.particles = [];
        this.animationSpeed = 1;
        this.effectsEnabled = {
            particles: true,
            animations: true,
            microInteractions: true
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeParticles();
        this.startLoadingSequence();
        this.loadUserPreferences();
        this.initializeCounters();
    }
    
    setupEventListeners() {
        // Smooth scroll navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Parallax effect on scroll
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mouse move effects
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    startLoadingSequence() {
        setTimeout(() => {
            this.animateStats();
            this.hideLoadingScreen();
        }, 2000);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoading = false;
                this.startIntroAnimations();
            }, 500);
        }
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat, index) => {
            const targetCount = parseInt(stat.getAttribute('data-count'));
            let currentCount = 0;
            
            const interval = setInterval(() => {
                currentCount += Math.ceil(targetCount / 50);
                if (currentCount >= targetCount) {
                    currentCount = targetCount;
                    clearInterval(interval);
                }
                stat.textContent = currentCount.toLocaleString();
            }, 30);
            
            // Add delay for staggered animation
            stat.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    startIntroAnimations() {
        // Animate navigation
        const nav = document.getElementById('mainNav');
        if (nav) {
            nav.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                nav.style.transform = 'translateY(0)';
            }, 100);
        }
        
        // Animate hero content
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.classList.add('animate__fadeInLeft');
        }
        
        // Animate floating elements
        this.animateFloatingElements();
        
        // Start particle animation
        if (this.effectsEnabled.particles) {
            this.animateParticles();
        }
    }
    
    animateFloatingElements() {
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.5}s`;
            card.classList.add('animate__fadeInUp');
        });
    }
    
    initializeParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas || !this.effectsEnabled.particles) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create particles
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        this.animateParticles();
    }
    
    animateParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                ctx.fill();
            });
            
            if (this.effectsEnabled.particles) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        const heroSection = document.getElementById('hero');
        
        if (heroSection) {
            // Parallax effect for hero section
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Reveal animations on scroll
        const revealElements = document.querySelectorAll('.feature-card');
        revealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !element.classList.contains('animate__fadeInUp')) {
                element.classList.add('animate__fadeInUp');
            }
        });
    }
    
    handleMouseMove(e) {
        if (!this.effectsEnabled.microInteractions) return;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Add subtle glow effect to cards near mouse
        const cards = document.querySelectorAll('.feature-card, .floating-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(Math.pow(mouseX - cardX, 2) + Math.pow(mouseY - cardY, 2));
            
            if (distance < 150) {
                const intensity = 1 - (distance / 150);
                card.style.boxShadow = `0 ${10 + intensity * 20}px ${50 + intensity * 30}px -12px rgba(99, 102, 241, ${0.1 + intensity * 0.2})`;
                card.style.transform = `translateY(${-intensity * 5}px) scale(${1 + intensity * 0.02})`;
            } else {
                card.style.boxShadow = '';
                card.style.transform = '';
            }
        });
    }
    
    handleKeyboard(e) {
        // Enhanced keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    this.changeTheme('default');
                    break;
                case '2':
                    e.preventDefault();
                    this.changeTheme('dark');
                    break;
                case '3':
                    e.preventDefault();
                    this.changeTheme('light');
                    break;
                case '4':
                    e.preventDefault();
                    this.changeTheme('ocean');
                    break;
                case '5':
                    e.preventDefault();
                    this.changeTheme('forest');
                    break;
                case '6':
                    e.preventDefault();
                    this.changeTheme('sunset');
                    break;
                case 'a':
                    e.preventDefault();
                    this.toggleAnimations();
                    break;
                case 'p':
                    e.preventDefault();
                    this.toggleParticles();
                    break;
            }
        }
    }
    
    changeTheme(themeName) {
        if (window.themeManager) {
            window.themeManager.applyTheme(themeName);
            this.showToast(`Theme changed to ${themeName}!`, 'success');
        }
    }
    
    toggleAnimations() {
        this.effectsEnabled.animations = !this.effectsEnabled.animations;
        document.body.classList.toggle('animations-disabled', !this.effectsEnabled.animations);
        this.showToast(`Animations ${this.effectsEnabled.animations ? 'enabled' : 'disabled'}`, 'info');
    }
    
    toggleParticles() {
        this.effectsEnabled.particles = !this.effectsEnabled.particles;
        const canvas = document.getElementById('particles-canvas');
        if (canvas) {
            canvas.style.display = this.effectsEnabled.particles ? 'block' : 'none';
        }
        this.showToast(`Particles ${this.effectsEnabled.particles ? 'enabled' : 'disabled'}`, 'info');
    }
    
    loadUserPreferences() {
        // Load animation speed
        const speedSlider = document.getElementById('animationSpeed');
        if (speedSlider) {
            speedSlider.value = this.animationSpeed;
            speedSlider.addEventListener('input', (e) => {
                this.animationSpeed = parseFloat(e.target.value);
                this.updateAnimationSpeed();
            });
        }
        
        // Load effect toggles
        const particlesToggle = document.getElementById('particlesEnabled');
        const animationsToggle = document.getElementById('animationsEnabled');
        const microToggle = document.getElementById('microInteractions');
        
        if (particlesToggle) {
            particlesToggle.checked = this.effectsEnabled.particles;
            particlesToggle.addEventListener('change', (e) => {
                this.effectsEnabled.particles = e.target.checked;
                this.toggleParticles();
            });
        }
        
        if (animationsToggle) {
            animationsToggle.checked = this.effectsEnabled.animations;
            animationsToggle.addEventListener('change', (e) => {
                this.effectsEnabled.animations = e.target.checked;
                this.toggleAnimations();
            });
        }
        
        if (microToggle) {
            microToggle.checked = this.effectsEnabled.microInteractions;
            microToggle.addEventListener('change', (e) => {
                this.effectsEnabled.microInteractions = e.target.checked;
                this.showToast(`Micro-interactions ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
            });
        }
    }
    
    updateAnimationSpeed() {
        const root = document.documentElement;
        root.style.setProperty('--animation-duration', `${1 / this.animationSpeed}s`);
        
        // Update all animated elements
        const animatedElements = document.querySelectorAll('[class*="animate"]');
        animatedElements.forEach(element => {
            element.style.animationDuration = `${1 / this.animationSpeed}s`;
        });
    }
    
    initializeCounters() {
        // Animated counter for stats
        const observerOptions = {
            threshold: 0.5
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    this.animateCounter(counter, target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.stat-number').forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 30);
    }
    
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        }
    }
}

// Authentication Modal Functions
function showAuthModal(type = 'login') {
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-title');
    const content = document.getElementById('auth-content');
    
    if (!modal || !title || !content) return;
    
    if (type === 'login') {
        title.innerHTML = '<i class="fas fa-sign-in-alt mr-sm"></i>Welcome Back';
        content.innerHTML = `
            <form id="loginForm" class="auth-form">
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-user icon-sm"></i>
                        Username
                    </label>
                    <input type="text" id="username" class="input" placeholder="Enter your username" required>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-lock icon-sm"></i>
                        Password
                    </label>
                    <input type="password" id="password" class="input" placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-lg w-full">
                    <i class="fas fa-sign-in-alt mr-sm"></i>
                    Sign In
                </button>
            </form>
        `;
    } else if (type === 'register') {
        title.innerHTML = '<i class="fas fa-user-plus mr-sm"></i>Create Account';
        content.innerHTML = `
            <form id="registerForm" class="auth-form">
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-user icon-sm"></i>
                        Username
                    </label>
                    <input type="text" id="reg-username" class="input" placeholder="Choose a username" required>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-envelope icon-sm"></i>
                        Email
                    </label>
                    <input type="email" id="reg-email" class="input" placeholder="Your email address" required>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <i class="fas fa-lock icon-sm"></i>
                        Password
                    </label>
                    <input type="password" id="reg-password" class="input" placeholder="Create a password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-lg w-full">
                    <i class="fas fa-user-plus mr-sm"></i>
                    Create Account
                </button>
            </form>
        `;
    }
    
    modal.classList.add('show');
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize professional website
document.addEventListener('DOMContentLoaded', function() {
    window.professionalWebsite = new ProfessionalWebsite();
});