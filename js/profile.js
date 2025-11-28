document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('username-display').textContent = username;
    
    loadUserProfile();
    loadProfileStats();
    
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });
    
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileData();
    });
    
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    changeAvatarBtn.addEventListener('click', function() {
        alert('Avatar upload functionality would be implemented here');
    });
});

function loadUserProfile() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        document.getElementById('profile-username').textContent = user.username;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-role').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        document.getElementById('profile-joined').textContent = 'Joined ' + new Date(user.createdAt).toLocaleDateString();
        
        const profileData = JSON.parse(localStorage.getItem('profileData_' + user.id)) || {};
        document.getElementById('first-name').value = profileData.firstName || '';
        document.getElementById('last-name').value = profileData.lastName || '';
        document.getElementById('bio').value = profileData.bio || '';
        document.getElementById('phone').value = profileData.phone || '';
        document.getElementById('location').value = profileData.location || '';
    }
}

function loadProfileStats() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        const loginCount = parseInt(localStorage.getItem('loginCount_' + user.id)) || 0;
        const lastLogin = localStorage.getItem('lastLogin_' + user.id);
        const createdAt = new Date(user.createdAt);
        const today = new Date();
        const accountAge = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24));
        
        document.getElementById('login-count').textContent = loginCount;
        document.getElementById('last-login').textContent = lastLogin ? new Date(lastLogin).toLocaleString() : 'Never';
        document.getElementById('account-age').textContent = accountAge + ' days';
        
        const profileData = JSON.parse(localStorage.getItem('profileData_' + user.id)) || {};
        const completion = calculateProfileCompletion(profileData);
        document.getElementById('profile-completion').textContent = completion + '%';
    }
}

function calculateProfileCompletion(profileData) {
    const fields = ['firstName', 'lastName', 'bio', 'phone', 'location'];
    let completed = 0;
    
    fields.forEach(field => {
        if (profileData[field] && profileData[field].trim() !== '') {
            completed++;
        }
    });
    
    return Math.round((completed / fields.length) * 100);
}

function saveProfileData() {
    const username = localStorage.getItem('username');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    
    if (user) {
        const profileData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            bio: document.getElementById('bio').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value
        };
        
        localStorage.setItem('profileData_' + user.id, JSON.stringify(profileData));
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message show';
        successMessage.textContent = 'Profile updated successfully!';
        successMessage.style.position = 'fixed';
        successMessage.style.top = '20px';
        successMessage.style.right = '20px';
        successMessage.style.zIndex = '1000';
        
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
        
        loadProfileStats();
    }
}