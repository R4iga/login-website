// Theme Customization System
class ThemeManager {
    constructor() {
        this.themes = {
            default: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            },
            dark: {
                primary: '#3b82f6',
                secondary: '#8b5cf6',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            },
            light: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #cfdbff 100%)'
            },
            ocean: {
                primary: '#0891b2',
                secondary: '#06b6d4',
                background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)'
            },
            forest: {
                primary: '#10b981',
                secondary: '#059669',
                background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)'
            },
            sunset: {
                primary: '#f97316',
                secondary: '#ea580c',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
            }
        };
        
        this.currentTheme = localStorage.getItem('selectedTheme') || 'default';
        this.currentAccent = localStorage.getItem('accentColor') || null;
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        if (this.currentAccent) {
            this.applyAccentColor(this.currentAccent);
        }
        
        // Initialize theme selector
        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.value = this.currentTheme;
        }
    }
    
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;
        
        const root = document.documentElement;
        root.setAttribute('data-theme', themeName);
        
        // Apply custom colors if accent is set
        if (this.currentAccent) {
            root.style.setProperty('--primary', this.currentAccent);
        }
        
        localStorage.setItem('selectedTheme', themeName);
        this.currentTheme = themeName;
    }
    
    applyAccentColor(color) {
        const root = document.documentElement;
        root.style.setProperty('--primary', color);
        
        // Generate complementary colors
        const lighterColor = this.lightenColor(color, 20);
        const darkerColor = this.darkenColor(color, 20);
        
        root.style.setProperty('--primary-light', lighterColor);
        root.style.setProperty('--primary-dark', darkerColor);
        
        localStorage.setItem('accentColor', color);
        this.currentAccent = color;
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 255 : 255) * 0x10000 + 
                (G < 255 ? G < 255 : 255) * 0x100 + 
                (B < 255 ? B < 255 : 255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 + 
                (G > 0 ? G : 0) * 0x100 + 
                (B > 0 ? B : 0)).toString(16).slice(1);
    }
}

// Global theme manager instance
let themeManager;

// Theme functions for global access
function changeTheme(themeName) {
    if (themeManager) {
        themeManager.applyTheme(themeName);
        showToast('Theme changed successfully!', 'success');
    }
}

function changeAccentColor(color) {
    if (themeManager) {
        themeManager.applyAccentColor(color);
        showToast('Accent color updated!', 'success');
    }
}

function toggleThemePanel() {
    const panel = document.getElementById('themePanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Enhanced toast notification
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-fade-in`;
    toast.innerHTML = `
        <div class="flex items-center gap-sm">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    themeManager = new ThemeManager();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Shift + T for theme panel
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleThemePanel();
        }
    });
    
    // Close theme panel when clicking outside
    document.addEventListener('click', function(e) {
        const panel = document.getElementById('themePanel');
        if (panel && !panel.contains(e.target) && !e.target.closest('.theme-header button')) {
            panel.classList.remove('show');
        }
    });
});

// Add fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    .animate-fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
`;
document.head.appendChild(style);