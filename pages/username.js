// ============================================
// USERNAME PAGE - COMPLETE JAVASCRIPT
// Dual Mode: Real Data + Fallback Service Cards
// ============================================

// Get selected service from localStorage
const service = localStorage.getItem('selectedService') || 'followers';
let profileData = null;
let selectedAmount = 1000;
let selectedDuration = 1;
let durationPrice = 199;
let postLink = '';

// Service configurations
const serviceConfig = {
    followers: {
        name: '👥 Followers Boost',
        icon: 'fa-users',
        color: '#405de6',
        description: 'Get real followers instantly',
        unit: 'followers',
        min: 100,
        max: 10000,
        default: 1000,
        pricePerUnit: 0.49,
        badges: ['⚡ Instant', '✅ Real', '🔒 Safe']
    },
    blueTick: {
        name: '✅ Blue Tick Verification',
        icon: 'fa-check-circle',
        color: '#1da1f2',
        description: 'Get verified badge on your profile',
        unit: 'months',
        durations: {
            1: 199,
            3: 499,
            6: 899,
            12: 1599
        },
        badges: ['⭐ Verified', '🔷 Premium', '⚡ Fast']
    },
    likes: {
        name: '❤️ Likes Booster',
        icon: 'fa-heart',
        color: '#e1306c',
        description: 'Boost your post engagement',
        unit: 'likes',
        min: 100,
        max: 5000,
        default: 500,
        pricePerUnit: 0.39,
        badges: ['❤️ Real', '📈 Growth', '⚡ Instant']
    },
    combo: {
        name: '💎 Combo Pack',
        icon: 'fa-gem',
        color: 'gold',
        description: 'Followers + Likes together',
        price: 199,
        includes: '1000 Followers + 5000 Likes',
        badges: ['👥 1000 Followers', '❤️ 5000 Likes', '💰 Best Value']
    }
};

// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Show service badge
    document.getElementById('serviceBadge').innerHTML = `
        <i class="fas ${serviceConfig[service].icon}"></i> 
        ${serviceConfig[service].name}
    `;

    // Configure based on service type
    configureServiceUI();
    
    // Show link section only for likes
    if (service === 'likes') {
        document.getElementById('linkSection').style.display = 'block';
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').querySelector('i').className = 'fas fa-sun';
    }
});

// Configure UI based on service
function configureServiceUI() {
    const amountSection = document.getElementById('amountSection');
    const durationSection = document.getElementById('durationSection');
    const amountLabel = document.getElementById('amountLabel');

    if (service === 'blueTick') {
        amountSection.style.display = 'none';
        durationSection.style.display = 'block';
    } 
    else if (service === 'combo') {
        amountSection.style.display = 'none';
        durationSection.style.display = 'none';
    } 
    else {
        amountSection.style.display = 'block';
        durationSection.style.display = 'none';
        amountLabel.innerHTML = `How many ${serviceConfig[service].unit}? (${serviceConfig[service].min}-${serviceConfig[service].max})`;
        
        // Set input attributes
        const amountInput = document.getElementById('amount');
        amountInput.min = serviceConfig[service].min;
        amountInput.max = serviceConfig[service].max;
        amountInput.value = serviceConfig[service].default;
    }
}

// Validate post link for likes
function validateLink() {
    const link = document.getElementById('postLink').value.trim();
    if (!link) {
        showError('Please enter post/reel link');
        return false;
    }
    
    // Simple Instagram link validation
    if (link.includes('instagram.com/p/') || link.includes('instagram.com/reel/')) {
        postLink = link;
        showSuccess('Link validated successfully');
        return true;
    } else {
        showError('Please enter a valid Instagram post/reel link');
        return false;
    }
}

// Fetch Instagram Profile with Fallback
async function fetchInstagramProfile() {
    const username = document.getElementById('username').value.replace('@', '').trim();
    
    if (!username) {
        showError('Please enter a username');
        return;
    }

    // For likes, validate link first
    if (service === 'likes') {
        if (!validateLink()) {
            return;
        }
    }

    // Show loader
    document.getElementById('loader').classList.add('show');
    document.getElementById('previewCard').style.display = 'none';
    document.getElementById('continueBtn').disabled = true;

    try {
        // Call backend API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`http://localhost:5000/api/instagram/${username}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Profile not found');
        }

        const data = await response.json();
        
        // Check if we got real data
        if (data.source === 'scrapingbee_real') {
            // MODE 1: Real data mila
            profileData = data;
            document.getElementById('apiSuccessMode').style.display = 'grid';
            document.getElementById('apiFailMode').style.display = 'none';
            updatePreviewWithRealData();
            showSuccess('Profile fetched successfully!');
        } else {
            // MODE 2: API fail
            throw new Error('Using fallback mode');
        }

    } catch (error) {
        console.log('API Failed - Using Service Only Mode');
        
        // MODE 2: Service card dikhao
        document.getElementById('apiSuccessMode').style.display = 'none';
        document.getElementById('apiFailMode').style.display = 'block';
        
        // Service card update karo
        updateServiceOnlyMode(username);
        
    } finally {
        document.getElementById('loader').classList.remove('show');
        document.getElementById('continueBtn').disabled = false;
    }
}

// MODE 1: Real data ke saath preview
function updatePreviewWithRealData() {
    if (!profileData) return;

    let price = 0;
    let addFollowers = 0;
    let features = [];

    // Update current profile card
    document.getElementById('currentUsername').innerHTML = `@${profileData.username}`;
    document.getElementById('currentFollowers').innerHTML = profileData.followers?.toLocaleString() || '0';
    document.getElementById('currentFollowing').innerHTML = profileData.following?.toLocaleString() || '0';
    document.getElementById('currentPosts').innerHTML = profileData.posts?.toLocaleString() || '0';
    
    if (profileData.profile_pic) {
        document.getElementById('currentAvatar').innerHTML = `<img src="${profileData.profile_pic}" alt="Profile">`;
        document.getElementById('upgradedAvatar').innerHTML = `<img src="${profileData.profile_pic}" alt="Profile">`;
    }

    // Calculate based on service
    if (service === 'followers') {
        const amount = parseInt(document.getElementById('amount').value) || 1000;
        addFollowers = amount;
        price = amount * serviceConfig.followers.pricePerUnit;
        features = [`+${amount} Followers`];
    } 
    else if (service === 'likes') {
        const amount = parseInt(document.getElementById('amount').value) || 500;
        price = amount * serviceConfig.likes.pricePerUnit;
        features = [`+${amount} Likes on your post`];
    } 
    else if (service === 'blueTick') {
        price = durationPrice;
        features = ['✓ Blue Tick Verification', '⭐ Verified Badge'];
        // Show blue tick icon
        document.getElementById('blueTickIcon').style.display = 'inline';
    } 
    else if (service === 'combo') {
        addFollowers = 1000;
        price = serviceConfig.combo.price;
        features = ['+1000 Followers', '+5000 Likes'];
    }

    // Update upgraded card
    document.getElementById('upgradedUsername').innerHTML = `@${profileData.username}`;
    document.getElementById('upgradedFollowers').innerHTML = (profileData.followers + addFollowers).toLocaleString();
    document.getElementById('upgradedFollowing').innerHTML = profileData.following?.toLocaleString() || '0';
    document.getElementById('upgradedPosts').innerHTML = profileData.posts?.toLocaleString() || '0';
    document.getElementById('followersPlus').innerHTML = addFollowers > 0 ? `+${addFollowers}` : '';
    
    // Add features
    const featuresDiv = document.getElementById('upgradeFeatures');
    featuresDiv.innerHTML = '';
    features.forEach(feature => {
        featuresDiv.innerHTML += `<span class="feature-tag">${feature}</span>`;
    });

    document.getElementById('previewCard').style.display = 'block';
    document.getElementById('previewPrice').innerHTML = `₹${Math.round(price)}`;
    
    // Store in localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('upgradeAmount', Math.round(price));
    localStorage.setItem('upgradeQuantity', document.getElementById('amount')?.value || selectedDuration);
    localStorage.setItem('addFollowers', addFollowers);
    localStorage.setItem('dataSource', 'real');
    if (service === 'likes') {
        localStorage.setItem('postLink', postLink);
    }
}

// MODE 2: Sirf service card dikhao
function updateServiceOnlyMode(username) {
    let price = 0;
    let quantity = '';

    switch(service) {
        case 'followers':
            quantity = document.getElementById('amount')?.value || 1000;
            price = quantity * serviceConfig.followers.pricePerUnit;
            document.getElementById('failService').innerHTML = `${quantity} Followers`;
            break;
        case 'blueTick':
            price = durationPrice;
            document.getElementById('failService').innerHTML = `Blue Tick (${selectedDuration} month)`;
            break;
        case 'likes':
            quantity = document.getElementById('amount')?.value || 500;
            price = quantity * serviceConfig.likes.pricePerUnit;
            document.getElementById('failService').innerHTML = `${quantity} Likes`;
            // Show link row
            document.getElementById('failLinkRow').style.display = 'flex';
            document.getElementById('failPostLink').innerHTML = postLink.substring(0, 30) + '...';
            break;
        case 'combo':
            price = serviceConfig.combo.price;
            document.getElementById('failService').innerHTML = 'Combo Pack';
            break;
    }

    // Update service card
    document.getElementById('failServiceIcon').innerHTML = `<i class="fas ${serviceConfig[service].icon}"></i>`;
    document.getElementById('failServiceName').innerHTML = serviceConfig[service].name;
    document.getElementById('failServiceDescription').innerHTML = serviceConfig[service].description;
    document.getElementById('failUsername').innerHTML = `@${username}`;
    document.getElementById('failPrice').innerHTML = `₹${Math.round(price)}`;
    
    // Update badges
    const badges = serviceConfig[service].badges;
    document.getElementById('failBadge1').innerHTML = badges[0];
    document.getElementById('failBadge2').innerHTML = badges[1];
    document.getElementById('failBadge3').innerHTML = badges[2];

    document.getElementById('previewCard').style.display = 'block';
    document.getElementById('previewPrice').innerHTML = `₹${Math.round(price)}`;
    
    // Store in localStorage
    localStorage.setItem('instaUsername', username);
    localStorage.setItem('upgradeAmount', Math.round(price));
    localStorage.setItem('upgradeQuantity', quantity || selectedDuration);
    localStorage.setItem('dataSource', 'service_only');
    if (service === 'likes') {
        localStorage.setItem('postLink', postLink);
    }
}

// Set amount from preset
function setAmount(amount) {
    document.getElementById('amount').value = amount;
    if (profileData) {
        updatePreviewWithRealData();
    }
}

// Select duration for blue tick
function selectDuration(months, price) {
    selectedDuration = months;
    durationPrice = price;
    
    // Highlight selected
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.style.background = '';
        btn.style.color = '';
    });
    event.currentTarget.style.background = 'var(--primary)';
    event.currentTarget.style.color = 'white';
    
    if (profileData) {
        updatePreviewWithRealData();
    }
}

// Continue to payment
function continueToPayment() {
    const username = document.getElementById('username').value.replace('@', '').trim();
    if (!username) {
        showError('Please enter username');
        return;
    }

    localStorage.setItem('instaUsername', username);
    window.location.href = 'payment.html';
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.querySelector('span').textContent = message;
    errorDiv.classList.add('show');
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.querySelector('span').textContent = message;
    successDiv.classList.add('show');
    
    setTimeout(() => {
        successDiv.classList.remove('show');
    }, 3000);
}

// Dark mode toggle
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

// Add input listener
document.getElementById('amount')?.addEventListener('input', function() {
    if (profileData) {
        updatePreviewWithRealData();
    }
});

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').querySelector('i').className = 'fas fa-sun';
        }
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').querySelector('i').className = 'fas fa-sun';
        }
    }
}

// Make functions global
window.fetchInstagramProfile = fetchInstagramProfile;
window.validateLink = validateLink;
window.setAmount = setAmount;
window.selectDuration = selectDuration;
window.continueToPayment = continueToPayment;
