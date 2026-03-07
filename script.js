// ============================================
// MAIN JAVASCRIPT - COMPLETE WORKING VERSION
// ============================================

// ===== SERVICE SELECTION =====
function selectService(service) {
    localStorage.setItem('selectedService', service);
    
    // Animation
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    });

    // Redirect to username page
    setTimeout(() => {
        window.location.href = 'pages/username.html';
    }, 300);
}

// ===== DARK MODE TOGGLE - FIXED VERSION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page loaded - Initializing theme toggle');
    
    const themeToggle = document.getElementById('themeToggle');
    const loginBtn = document.getElementById('loginBtn');
    
    // ===== THEME TOGGLE BUTTON =====
    if (themeToggle) {
        console.log('✅ Theme toggle button found');
        
        // Remove any existing listeners by cloning
        const newToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newToggle, themeToggle);
        
        // Add fresh click listener
        newToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Theme toggle clicked');
            
            // Toggle class
            document.body.classList.toggle('dark-mode');
            
            // Update icon
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
                console.log('🌙 Switched to DARK mode');
            } else {
                icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
                console.log('☀️ Switched to LIGHT mode');
            }
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        console.log('💾 Saved theme:', savedTheme);
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            newToggle.querySelector('i').className = 'fas fa-sun';
        } else {
            document.body.classList.remove('dark-mode');
            newToggle.querySelector('i').className = 'fas fa-moon';
        }
    } else {
        console.error('❌ Theme toggle button NOT found!');
    }
    
    // ===== LOGIN BUTTON =====
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            alert('🔐 Please login with your Instagram account to continue');
        });
    }
    
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            if (mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'block';
            }
        });
    }
    
    // ===== NOTIFICATION BELL =====
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotification('📢 You have 3 new notifications', 'info');
        });
    }
});

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'info') icon = 'fa-info-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// ===== VIEW ALL SERVICES =====
function viewAllServices() {
    showNotification('📱 All services coming soon!', 'info');
}

// ===== MAKE FUNCTIONS GLOBAL =====
window.selectService = selectService;
window.showNotification = showNotification;
window.viewAllServices = viewAllServices;
