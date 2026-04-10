// ============================================
// AUTHENTICATION JAVASCRIPT
// ============================================

// Toggle password visibility
document.querySelectorAll('.input-with-icon input[type="password"]').forEach(input => {
    const icon = input.parentElement.querySelector('i');
    icon.style.cursor = 'pointer';
    
    icon.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-lock');
            icon.classList.add('fa-eye');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-lock');
        }
    });
});

// Form validation
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = form.querySelectorAll('input[required]');
        let valid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.style.borderColor = 'var(--danger)';
            } else {
                input.style.borderColor = '#e5e7eb';
            }
        });
        
        if (valid) {
            alert('Success! Redirecting...');
            window.location.href = 'index.html';
        }
    });
});