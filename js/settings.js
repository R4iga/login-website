document.addEventListener('DOMContentLoaded', function() {
    setupPage();
    
    loadSettings();
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            const targetTab = document.getElementById(tabName + '-tab');
            if (targetTab) targetTab.classList.add('active');
        });
    });
    
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateAccount();
        });
    }
    
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updatePassword();
        });
    }
    
    const apiForm = document.getElementById('api-form');
    if (apiForm) {
        apiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveApiSettings();
        });
    }
    
    const temperatureSlider = document.getElementById('api-temperature');
    const temperatureValue = document.getElementById('temperature-value');
    if (temperatureSlider && temperatureValue) {
        temperatureSlider.addEventListener('input', function() {
            temperatureValue.textContent = this.value;
        });
    }
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
        const emailNotif = document.getElementById('email-notifications');
        const pushNotif = document.getElementById('push-notifications');
        const smsNotif = document.getElementById('sms-notifications');
        const marketingEmails = document.getElementById('marketing-emails');
        
        const settings = {
            emailNotifications: emailNotif ? emailNotif.checked : true,
            pushNotifications: pushNotif ? pushNotif.checked : true,
            smsNotifications: smsNotif ? smsNotif.checked : false,
            marketingEmails: marketingEmails ? marketingEmails.checked : false
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
        const profilePublic = document.getElementById('profile-public');
        const showEmail = document.getElementById('show-email');
        const allowMessages = document.getElementById('allow-messages');
        const dataAnalytics = document.getElementById('data-analytics');
        
        const settings = JSON.parse(localStorage.getItem('userSettings_' + user.id)) || {};
        settings.profilePublic = profilePublic ? profilePublic.checked : false;
        settings.showEmail = showEmail ? showEmail.checked : false;
        settings.allowMessages = allowMessages ? allowMessages.checked : true;
        settings.dataAnalytics = dataAnalytics ? dataAnalytics.checked : false;
        
        localStorage.setItem('userSettings_' + user.id, JSON.stringify(settings));
        showSuccess('Privacy settings saved!');
    }
}

function saveApiSettings() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        const apiKeyInput = document.getElementById('api-key');
        const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
        const modelSelect = document.getElementById('api-model');
        const model = modelSelect ? modelSelect.value : 'gpt-3.5-turbo';
        const tempInput = document.getElementById('api-temperature');
        const temperature = tempInput ? parseFloat(tempInput.value) : 0.7;
        
        // Validate API key format
        if (apiKey && !apiKey.startsWith('sk-')) {
            showError('Invalid API key format. OpenAI API keys should start with "sk-"');
            return;
        }
        
        const apiSettings = {
            apiKey: apiKey,
            model: model,
            temperature: temperature
        };
        
        localStorage.setItem('apiSettings_' + user.id, JSON.stringify(apiSettings));
        
        if (apiKey) {
            showSuccess('API settings saved! You can now use the chatbot.');
        } else {
            showSuccess('API settings saved! Add an API key to enable ChatGPT.');
        }
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
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

async function testApiKey() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (!user) return;
    
    const apiSettings = JSON.parse(localStorage.getItem('apiSettings_' + user.id)) || {};
    
    if (!apiSettings.apiKey || apiSettings.apiKey.trim() === '') {
        showError('Please enter an API key first');
        return;
    }
    
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiSettings.apiKey.trim()}`
            }
        });
        
        if (response.ok) {
            showSuccess('API key is valid!');
        } else {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
                showError('Invalid API key');
            } else {
                showError(`API Error: ${errorData.error?.message || 'Unknown error'}`);
            }
        }
    } catch (error) {
        showError('Network error. Please check your connection.');
    }
}