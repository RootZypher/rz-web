// ============================================
// PAYMENT PAGE - FINAL FIX VERSION
// ============================================

// Global variables
let timerInterval;
let timeLeft = 300;
let requestSent = false;
let currentPaymentId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadServiceInfo();
    loadSavedTheme();
});

function loadServiceInfo() {
    const username = localStorage.getItem('instaUsername') || 'username';
    const service = localStorage.getItem('selectedService') || 'followers';
    
    const serviceNames = {
        followers: 'Followers Boost',
        blueTick: 'Blue Tick',
        likes: 'Likes Booster',
        combo: 'Combo Pack'
    };
    
    document.getElementById('serviceName').textContent = serviceNames[service];
    document.getElementById('displayUsername').textContent = '@' + username;
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function validateUPIId(upiId) {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return pattern.test(upiId);
}

// ⭐ FIXED VERSION WITH HARDCODED IP
async function sendUPIRequest() {
    const upiId = document.getElementById('upiId').value.trim();

    if (!upiId) {
        alert('Please enter UPI ID');
        return;
    }

    if (!validateUPIId(upiId)) {
        alert('Invalid UPI ID format');
        return;
    }

    // Disable button
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('sendBtn').textContent = 'Sending...';

    try {
        // ⭐ DIRECT IP USE KARO, localhost nahi
        const response = await fetch('http://127.0.0.1:5000/api/upi-collect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                upiId: upiId,
                amount: 5,
                username: localStorage.getItem('instaUsername') || 'test'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            alert('✅ Request sent! Check your UPI app');
            
            currentPaymentId = data.paymentId;
            localStorage.setItem('currentPaymentId', currentPaymentId);
            
            startTimer();
            requestSent = true;
            
            document.getElementById('cancelBtn').style.display = 'block';
            document.getElementById('upiSection').style.display = 'none';
            document.getElementById('appGuideSection').style.display = 'block';
        } else {
            alert('❌ ' + (data.message || 'Failed'));
            resetSendButton();
        }

    } catch (error) {
        alert('❌ Connection failed! Check if backend is running on port 5000');
        console.error('Error:', error);
        resetSendButton();
    }
}

function startTimer() {
    document.getElementById('timerBox').style.display = 'block';
    
    if (timerInterval) clearInterval(timerInterval);

    timeLeft = 300;
    updateTimerDisplay();

    timerInterval = setInterval(async () => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft % 5 === 0 && currentPaymentId) {
            await checkPaymentStatus();
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft < 60) {
        document.getElementById('timer').style.color = '#ff4d4d';
    }
}

async function checkPaymentStatus() {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/payment-status/${currentPaymentId}`);
        const data = await response.json();
        
        if (data.paid) {
            clearInterval(timerInterval);
            alert('✅ Payment successful! Redirecting...');
            
            localStorage.setItem('trailPaid', 'true');
            
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 2000);
        }
    } catch (error) {
        console.log('Status check failed', error);
    }
}

function handleTimeout() {
    alert('⏰ Time expired! Payment not received');
    document.getElementById('cancelBtn').style.display = 'none';
    document.getElementById('retryBtn').style.display = 'block';
    requestSent = false;
}

function cancelPayment() {
    if (confirm('Cancel this payment request?')) {
        clearInterval(timerInterval);
        alert('Payment cancelled');
        resetPayment();
    }
}

function resetPayment() {
    document.getElementById('timerBox').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
    document.getElementById('retryBtn').style.display = 'block';
    document.getElementById('upiSection').style.display = 'block';
    document.getElementById('appGuideSection').style.display = 'none';
    requestSent = false;
}

function retryPayment() {
    document.getElementById('retryBtn').style.display = 'none';
    resetSendButton();
}

function resetSendButton() {
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('sendBtn').textContent = 'Send Request for ₹5';
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorBox').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('errorBox').style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successBox').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('successBox').style.display = 'none';
    }, 3000);
}

function hideMessages() {
    document.getElementById('errorBox').style.display = 'none';
    document.getElementById('successBox').style.display = 'none';
}

function goBack() {
    if (requestSent) {
        if (confirm('Payment in progress. Go back?')) {
            window.location.href = 'username.html';
        }
    } else {
        window.location.href = 'username.html';
    }
}

// Make functions global
window.sendUPIRequest = sendUPIRequest;
window.cancelPayment = cancelPayment;
window.retryPayment = retryPayment;
window.goBack = goBack;
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        }
    }
}
