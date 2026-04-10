// ============================================
// MAIN JAVASCRIPT
// ============================================

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Chat Widget
const chatBtn = document.querySelector('.chat-btn');
chatBtn.addEventListener('click', () => {
    alert('Chat feature coming soon!');
});

// Form Submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Form submitted successfully!');
    });
});