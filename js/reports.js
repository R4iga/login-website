document.addEventListener('DOMContentLoaded', function() {
    setupPage();
    
    loadReportsData();
    
    // Delay chart initialization to ensure DOM is ready
    setTimeout(() => {
        initializeCharts();
    }, 100);
    
    const dateRange = document.getElementById('date-range');
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            loadReportsData();
            updateCharts();
        });
    }
});

function loadReportsData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const dateRange = parseInt(document.getElementById('date-range').value);
    const today = new Date();
    const startDate = new Date(today.getTime() - (dateRange * 24 * 60 * 60 * 1000));
    
    const recentUsers = users.filter(user => new Date(user.createdAt) >= startDate);
    const totalLogins = calculateTotalLogins(dateRange);
    const messagesSent = calculateMessagesSent(dateRange);
    
    document.getElementById('total-users-report').textContent = users.length;
    document.getElementById('active-sessions').textContent = Math.floor(Math.random() * 50) + 10;
    document.getElementById('new-registrations').textContent = recentUsers.length;
    document.getElementById('messages-sent').textContent = messagesSent;
    
    document.getElementById('daily-logins').textContent = Math.floor(totalLogins / dateRange);
    document.getElementById('peak-hour').textContent = '2:00 PM';
    document.getElementById('active-day').textContent = 'Monday';
    document.getElementById('avg-session').textContent = '15 min';
    
    loadDetailedReports();
}

function calculateTotalLogins(days) {
    let totalLogins = 0;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    users.forEach(user => {
        const loginCount = parseInt(localStorage.getItem('loginCount_' + user.id)) || 0;
        totalLogins += loginCount;
    });
    
    return totalLogins;
}

function calculateMessagesSent(days) {
    return Math.floor(Math.random() * 500) + 100;
}

function loadDetailedReports() {
    const reports = [
        {
            date: new Date().toLocaleDateString(),
            type: 'User Activity',
            description: 'Daily user engagement report',
            status: 'Completed'
        },
        {
            date: new Date(Date.now() - 86400000).toLocaleDateString(),
            type: 'System Performance',
            description: 'Server performance metrics',
            status: 'Completed'
        },
        {
            date: new Date(Date.now() - 172800000).toLocaleDateString(),
            type: 'Security Audit',
            description: 'Monthly security analysis',
            status: 'In Progress'
        },
        {
            date: new Date(Date.now() - 259200000).toLocaleDateString(),
            type: 'User Analytics',
            description: 'User behavior analysis',
            status: 'Completed'
        }
    ];
    
    const tbody = document.getElementById('reports-tbody');
    tbody.innerHTML = '';
    
    reports.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.date}</td>
            <td>${report.type}</td>
            <td>${report.description}</td>
            <td><span class="status-badge ${report.status.toLowerCase().replace(' ', '-')}">${report.status}</span></td>
            <td>
                <button class="action-btn" onclick="viewReport('${report.type}')">View</button>
                <button class="action-btn" onclick="downloadReport('${report.type}')">Download</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.log('Chart.js not loaded, skipping chart initialization');
        return;
    }
    
    const activityCanvas = document.getElementById('activity-chart');
    const demographicsCanvas = document.getElementById('demographics-chart');
    
    if (!activityCanvas || !demographicsCanvas) {
        console.log('Chart canvases not found');
        return;
    }
    
    const activityCtx = activityCanvas.getContext('2d');
    const demographicsCtx = demographicsCanvas.getContext('2d');
    
    try {
        new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Active Users',
                    data: [65, 78, 90, 81, 96, 85, 92],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
        
        new Chart(demographicsCtx, {
            type: 'doughnut',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                datasets: [{
                    data: [25, 35, 20, 15, 5],
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF9800',
                        '#9C27B0',
                        '#F44336'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function updateCharts() {
    const dateRange = parseInt(document.getElementById('date-range').value);
    
    Chart.getChart('activity-chart').data.datasets[0].data = generateRandomData(7, 50, 100);
    Chart.getChart('activity-chart').update();
    
    Chart.getChart('demographics-chart').data.datasets[0].data = generateRandomData(5, 5, 40);
    Chart.getChart('demographics-chart').update();
}

function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

function viewReport(type) {
    alert(`Viewing ${type} report. Full report viewer would be implemented here.`);
}

function downloadReport(type) {
    const reportData = {
        type: type,
        date: new Date().toISOString(),
        data: generateMockReportData(type)
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.toLowerCase().replace(' ', '-')}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateMockReportData(type) {
    const mockData = {
        'User Activity': {
            totalUsers: 150,
            activeUsers: 89,
            newUsers: 12,
            retentionRate: 0.78
        },
        'System Performance': {
            uptime: 0.999,
            responseTime: 120,
            errorRate: 0.002,
            throughput: 1000
        },
        'Security Audit': {
            vulnerabilities: 2,
            patchesApplied: 15,
            securityScore: 92,
            lastAudit: new Date().toISOString()
        },
        'User Analytics': {
            pageViews: 5000,
            bounceRate: 0.35,
            avgSessionDuration: 900,
            conversionRate: 0.05
        }
    };
    
    return mockData[type] || {};
}

function exportReports() {
    alert('PDF export functionality would be implemented here. This would generate a comprehensive PDF report with all charts and data.');
}