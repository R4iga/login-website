document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('username-display').textContent = username;
    
    loadSettings();
    
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
    
    const accountForm = document.getElementById('account-form');
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateAccount();
    });
    
    const securityForm = document.getElementById('security-form');
    securityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updatePassword();
    });
    
    const apiForm = document.getElementById('api-form');
    apiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveApiSettings();
    });
    
    const temperatureSlider = document.getElementById('api-temperature');
    const temperatureValue = document.getElementById('temperature-value');
    temperatureSlider.addEventListener('input', function() {
        temperatureValue.textContent = this.value;
    });
});

function loadSettings() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        document.getElementById('change-username').value = user.username;
        document.getElementById('change-email').value = user.email;
    }
    
    const settings = JSON.parse(localStorage.getItem('userSettings_' + user.id)) || {};
    
    document.getElementById('email-notifications').checked = settings.emailNotifications !== false;
    document.getElementById('push-notifications').checked = settings.pushNotifications !== false;
    document.getElementById('sms-notifications').checked = settings.smsNotifications === true;
    document.getElementById('marketing-emails').checked = settings.marketingEmails === true;
    
    document.getElementById('profile-public').checked = settings.profilePublic === true;
    document.getElementById('show-email').checked = settings.showEmail === true;
    document.getElementById('allow-messages').checked = settings.allowMessages !== false;
    document.getElementById('data-analytics').checked = settings.dataAnalytics === true;
    
    const apiSettings = JSON.parse(localStorage.getItem('apiSettings_' + user.id)) || {};
    document.getElementById('api-key').value = apiSettings.apiKey || '';
    document.getElementById('api-model').value = apiSettings.model || 'gpt-3.5-turbo';
    document.getElementById('api-temperature').value = apiSettings.temperature || 0.7;
    document.getElementById('temperature-value').textContent = apiSettings.temperature || 0.7;
}

function updateAccount() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        const newUsername = document.getElementById('change-username').value;
        const newEmail = document.getElementById('change-email').value;
        
        if (newUsername !== username && users.some(u => u.username === newUsername)) {
            showError('Username already exists');
            return;
        }
        
        if (newEmail !== users[userIndex].email && users.some(u => u.email === newEmail)) {
            showError('Email already exists');
            return;
        }
        
        users[userIndex].username = newUsername;
        users[userIndex].email = newEmail;
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('username', newUsername);
        
        showSuccess('Account updated successfully!');
    }
}

function updatePassword() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (currentPassword !== users[userIndex].password) {
            showError('Current password is incorrect');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('New passwords do not match');
            return;
        }
        
        if (newPassword.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }
        
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        document.getElementById('security-form').reset();
        showSuccess('Password updated successfully!');
    }
}

function saveNotificationSettings() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        const settings = {
            emailNotifications: document.getElementById('email-notifications').checked,
            pushNotifications: document.getElementById('push-notifications').checked,
            smsNotifications: document.getElementById('sms-notifications').checked,
            marketingEmails: document.getElementById('marketing-emails').checked
        };
        
        localStorage.setItem('userSettings_' + user.id, JSON.stringify(settings));
        showSuccess('Notification preferences saved!');
    }
}

function savePrivacySettings() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        const settings = JSON.parse(localStorage.getItem('userSettings_' + user.id)) || {};
        settings.profilePublic = document.getElementById('profile-public').checked;
        settings.showEmail = document.getElementById('show-email').checked;
        settings.allowMessages = document.getElementById('allow-messages').checked;
        settings.dataAnalytics = document.getElementById('data-analytics').checked;
        
        localStorage.setItem('userSettings_' + user.id, JSON.stringify(settings));
        showSuccess('Privacy settings saved!');
    }
}

function saveApiSettings() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        const apiSettings = {
            apiKey: document.getElementById('api-key').value,
            model: document.getElementById('api-model').value,
            temperature: parseFloat(document.getElementById('api-temperature').value)
        };
        
        localStorage.setItem('apiSettings_' + user.id, JSON.stringify(apiSettings));
        showSuccess('API settings saved!');
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.zIndex = '1000';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.zIndex = '1000';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}