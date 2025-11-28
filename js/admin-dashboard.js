document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.username === username);
    
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }
    
    document.getElementById('username-display').textContent = username;
    document.getElementById('user-name').textContent = username;
    
    loadUsers();
    
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });
    
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
        });
    });
    
    const editForm = document.getElementById('edit-user-form');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = parseInt(document.getElementById('edit-user-id').value);
        const newUsername = document.getElementById('edit-username').value;
        const newPassword = document.getElementById('edit-password').value;
        const newEmail = document.getElementById('edit-email').value;
        const newRole = document.getElementById('edit-role').value;
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                username: newUsername,
                password: newPassword,
                email: newEmail,
                role: newRole
            };
            
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
            closeEditModal();
        }
    });
});

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.getElementById('users-tbody');
    const totalUsersSpan = document.getElementById('total-users');
    
    tbody.innerHTML = '';
    totalUsersSpan.textContent = users.length;
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td><span class="role-badge ${user.role}">${user.role}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="action-btn edit" onclick="editUser(${user.id})">Edit</button>
                <button class="action-btn delete" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (user) {
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-username').value = user.username;
        document.getElementById('edit-password').value = user.password;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-role').value = user.role;
        
        document.getElementById('edit-modal').classList.add('show');
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(user => user.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('show');
}