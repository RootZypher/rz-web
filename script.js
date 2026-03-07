// ============================================
// MAIN JAVASCRIPT - DIRECT PATH VERSION
// ============================================

// Service Selection
function selectService(service) {
    localStorage.setItem('selectedService', service);

    const serviceNames = {
        followers: 'Followers Boost',
        blueTick: 'Blue Tick',
        likes: 'Likes Booster',
        combo: 'Combo Pack'
    };

    // Animation
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    });

    // DIRECT PATH - YEH CHANGE KIYA HAI
    setTimeout(() => {
        window.location.href = 'pages/username.html';  // Direct path
        // window.location.href = CONFIG.redirects.username;  // Old line - commented
    }, 300);
}

// Dark Mode Toggle
document.getElementById('themeToggle')?.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');

    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').querySelector('i').className = 'fas fa-sun';
    }
});

// Login Button
document.getElementById('loginBtn')?.addEventListener('click', function() {
    alert('🔐 Please login with your Instagram account to continue');
});

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make functions global
window.selectService = selectService;
window.showNotification = showNotification;
// ===== Auto Detect System Theme =====
function detectSystemTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').querySelector('i').className = 'fas fa-sun';
        }
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').querySelector('i').className = 'fas fa-sun';
        }
    }
}

// System theme change listener
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!localStorage.getItem('theme')) {
        if (event.matches) {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').querySelector('i').className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            document.getElementById('themeToggle').querySelector('i').className = 'fas fa-moon';
        }
    }
});

// Page load pe detect karo
document.addEventListener('DOMContentLoaded', detectSystemTheme);
