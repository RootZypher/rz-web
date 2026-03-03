// js/script.js - Minimal Version

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const loginBtn = document.getElementById('loginBtn');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            alert('coming soon');
        });
    });
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            alert('coming soon');
        });
    }
});
